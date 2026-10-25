import "./style.css";
import { renderSkillBody, type SkillManifest } from "@algogent/shared";
import { SEED_SKILLS, SKILL_BODIES } from "../../lib/catalog";
import { filterSkills } from "../../lib/filter-skills";
import { createRunId } from "../../lib/ids";
import {
  connectWallet,
  getStoredWalletAddress,
} from "../../lib/payments/wallet";
import { settleAfterRun } from "../../lib/payments/settle";
import { listReceipts } from "../../lib/payments/receipt-store";

const root = document.getElementById("root");
if (!root) throw new Error("missing #root");

let statusText = "Connect wallet (or use simulate) · open ChatGPT/Claude · run a skill.";
let query = "";
let providerFilter: string | "all" = "all";
let walletLabel = "Wallet: not connected";

function setStatus(text: string): void {
  statusText = text;
  const el = document.getElementById("status");
  if (el) el.textContent = text;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function refreshWalletLabel(): Promise<void> {
  const addr = await getStoredWalletAddress();
  walletLabel = addr
    ? `Wallet: ${addr.slice(0, 6)}…${addr.slice(-4)}`
    : "Wallet: not connected (simulate OK)";
}

function renderList(): void {
  void refreshWalletLabel().then(() => {
    const skills = filterSkills(SEED_SKILLS, {
      query,
      provider: providerFilter === "all" ? undefined : providerFilter,
    });

    root!.innerHTML = `
    <header class="header">
      <h1>Algogent</h1>
      <p class="tagline">Pay per completed run · Algorand Testnet</p>
      <p class="meta">${escapeHtml(walletLabel)}</p>
      <button type="button" class="run" id="connect">Connect wallet</button>
    </header>
    <div class="search">
      <input id="q" type="search" placeholder="Search skills…" value="${escapeHtml(query)}" />
    </div>
    <div class="filters">
      ${["all", "chatgpt", "claude"]
        .map(
          (p) =>
            `<button type="button" data-provider="${p}" class="${providerFilter === p ? "active" : ""}">${p}</button>`,
        )
        .join("")}
    </div>
    <section class="skills" id="skills"></section>
    <p id="status" class="status" role="status">${escapeHtml(statusText)}</p>
  `;

    document.getElementById("connect")?.addEventListener("click", () => {
      void connectWallet()
        .then((w) => {
          setStatus(`Connected ${w.address.slice(0, 8)}…`);
          renderList();
        })
        .catch((e: unknown) =>
          setStatus(e instanceof Error ? e.message : "wallet_failed"),
        );
    });

    document.getElementById("q")?.addEventListener("input", (e) => {
      query = (e.target as HTMLInputElement).value;
      renderList();
    });

    root!.querySelectorAll("[data-provider]").forEach((btn) => {
      btn.addEventListener("click", () => {
        providerFilter = (btn as HTMLElement).dataset.provider ?? "all";
        renderList();
      });
    });

    const list = document.getElementById("skills");
    if (!list) return;

    if (skills.length === 0) {
      list.innerHTML = `<p class="tagline">No skills match.</p>`;
      return;
    }

    for (const skill of skills) {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
      <h2>${escapeHtml(skill.name)}</h2>
      <p>${escapeHtml(skill.description)}</p>
      <p class="meta">${(skill.pricing.amountMicro / 1_000_000).toFixed(3)} ${skill.pricing.asset} · fee ${skill.pricing.platformFeeBps / 100}% · ${skill.providers.join(", ")}</p>
      <button type="button" class="run">Configure &amp; run</button>
    `;
      card.querySelector("button")?.addEventListener("click", () =>
        renderDetail(skill),
      );
      list.appendChild(card);
    }
  });
}

function renderDetail(skill: SkillManifest): void {
  const fields = skill.inputs
    .map(
      (input) => `
      <label class="field">
        <span>${escapeHtml(input.label)}${input.required ? " *" : ""}</span>
        <textarea data-key="${escapeHtml(input.key)}" rows="4" placeholder="${escapeHtml(input.placeholder ?? "")}" ${input.required ? "required" : ""}></textarea>
      </label>`,
    )
    .join("");

  root!.innerHTML = `
    <header class="header">
      <button type="button" class="back" id="back">← Back</button>
      <h1>${escapeHtml(skill.name)}</h1>
      <p class="tagline">${escapeHtml(skill.description)}</p>
    </header>
    <form id="run-form" class="form">
      ${fields || "<p class=\"tagline\">No inputs required.</p>"}
      <button type="submit" class="run primary">Run &amp; settle on success</button>
    </form>
    <p id="status" class="status" role="status">${escapeHtml(statusText)}</p>
  `;

  document.getElementById("back")?.addEventListener("click", renderList);
  document.getElementById("run-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    void handleRun(skill);
  });
}

async function handleRun(skill: SkillManifest): Promise<void> {
  const inputs: Record<string, string> = {};
  for (const input of skill.inputs) {
    const el = document.querySelector(
      `[data-key="${CSS.escape(input.key)}"]`,
    ) as HTMLTextAreaElement | null;
    const value = el?.value.trim() ?? "";
    if (input.required && !value) {
      setStatus(`Missing required input: ${input.label}`);
      return;
    }
    inputs[input.key] = value;
  }

  const bodyTemplate = SKILL_BODIES[skill.id];
  if (!bodyTemplate) {
    setStatus(`Skill body not found for ${skill.id}`);
    return;
  }

  const renderedBody = renderSkillBody(bodyTemplate, inputs);
  const runId = createRunId();

  setStatus("Checking active tab…");
  const active = await chrome.runtime.sendMessage({ type: "GET_ACTIVE_PROVIDER" });
  if (!active?.ok) {
    setStatus(`Open ChatGPT or Claude first (${active?.error ?? "no_active_tab"}).`);
    return;
  }
  if (!skill.providers.includes(active.provider)) {
    setStatus(`Skill supports ${skill.providers.join(", ")}; active is ${active.provider}.`);
    return;
  }

  setStatus("Running skill…");
  const result = await chrome.runtime.sendMessage({
    type: "RUN_SKILL",
    skillId: skill.id,
    provider: active.provider,
    renderedBody,
    runId,
  });

  if (result?.status !== "success") {
    setStatus(`Failed: ${result?.errorCode ?? result?.status ?? "unknown"} · no charge`);
    return;
  }

  setStatus("Settling payment (simulate/Testnet)…");
  const receipt = await settleAfterRun({
    result,
    skillId: skill.id,
    amountMicro: skill.pricing.amountMicro,
    asset: skill.pricing.asset,
    developerPayTo: skill.pricing.developerPayTo ?? "",
    platformFeeBps: skill.pricing.platformFeeBps,
  });

  if (receipt.status === "settled") {
    setStatus(
      `Paid ${receipt.totalMicro / 1_000_000} ALGO · dev ${receipt.developerMicro} / platform ${receipt.platformMicro} · ${receipt.mode} · ${receipt.txIds[0] ?? ""}`,
    );
  } else {
    setStatus(`Payment ${receipt.status}: ${receipt.errorCode ?? ""}`);
  }

  void listReceipts();
}

void renderList();
