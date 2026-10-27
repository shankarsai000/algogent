import "./style.css";
import { renderSkillBody, type SkillManifest } from "@algogent/shared";
import { SEED_SKILLS, SKILL_BODIES } from "../../lib/catalog";
import { filterSkills } from "../../lib/filter-skills";
import { createRunId } from "../../lib/ids";
import { isFreeSkill } from "../../lib/payments/free-tier";
import {
  connectWallet,
  getStoredWalletAddress,
} from "../../lib/payments/wallet";
import { settleAfterRun } from "../../lib/payments/settle";
import { listReceipts } from "../../lib/payments/receipt-store";

const root = document.getElementById("root");
if (!root) throw new Error("missing #root");

const PROVIDER_FILTERS = ["all", "chatgpt", "claude", "gemini", "meta_ai"] as const;

let statusText =
  "Open ChatGPT or Claude · pick a Free skill · no wallet needed.";
let query = "";
let providerFilter: string = "all";
let walletLabel = "Wallet: optional";

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

function priceLabel(skill: SkillManifest): string {
  if (isFreeSkill(skill.pricing.amountMicro)) return "Free";
  return `${(skill.pricing.amountMicro / 1_000_000).toFixed(3)} ${skill.pricing.asset}`;
}

async function refreshWalletLabel(): Promise<void> {
  const addr = await getStoredWalletAddress();
  walletLabel = addr
    ? `Wallet: ${addr.slice(0, 6)}…${addr.slice(-4)}`
    : "Wallet: optional (free skills work without one)";
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
      <p class="tagline">Open skills · ChatGPT · Claude · Gemini · Meta AI</p>
      <p class="meta">${escapeHtml(walletLabel)}</p>
      <button type="button" class="run" id="connect">Connect wallet (optional)</button>
    </header>
    <div class="search">
      <input id="q" type="search" placeholder="Search skills…" value="${escapeHtml(query)}" />
    </div>
    <div class="filters">
      ${PROVIDER_FILTERS.map(
        (p) =>
          `<button type="button" data-provider="${p}" class="${providerFilter === p ? "active" : ""}">${p}</button>`,
      ).join("")}
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
      const free = isFreeSkill(skill.pricing.amountMicro);
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
      <h2>${escapeHtml(skill.name)}${free ? ' <span class="badge">Free</span>' : ""}</h2>
      <p>${escapeHtml(skill.description)}</p>
      <p class="meta">${escapeHtml(priceLabel(skill))} · ${skill.providers.join(", ")}</p>
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
  const free = isFreeSkill(skill.pricing.amountMicro);
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
      <p class="meta">${escapeHtml(priceLabel(skill))}${free ? " · no wallet needed" : ""}</p>
    </header>
    <form id="run-form" class="form">
      ${fields || "<p class=\"tagline\">No inputs required.</p>"}
      <button type="submit" class="run primary">${free ? "Run (free)" : "Run &amp; settle on success"}</button>
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
    setStatus(`Open a supported provider tab (${active?.error ?? "no_active_tab"}).`);
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

  if (isFreeSkill(skill.pricing.amountMicro)) {
    const receipt = await settleAfterRun({
      result,
      skillId: skill.id,
      amountMicro: 0,
      asset: skill.pricing.asset,
      developerPayTo: skill.pricing.developerPayTo ?? "",
      platformFeeBps: skill.pricing.platformFeeBps,
    });
    setStatus(`Done · free skill · ${receipt.paymentId ?? "ok"}`);
    void listReceipts();
    return;
  }

  setStatus("Settling payment…");
  const receipt = await settleAfterRun({
    result,
    skillId: skill.id,
    amountMicro: skill.pricing.amountMicro,
    asset: skill.pricing.asset,
    developerPayTo: skill.pricing.developerPayTo ?? "",
    platformFeeBps: skill.pricing.platformFeeBps,
  });

  if (receipt.status === "settled") {
    const unit = skill.pricing.asset;
    setStatus(
      `Paid ${(receipt.totalMicro / 1_000_000).toFixed(3)} ${unit} · ${receipt.mode} · ${receipt.txIds[0] ?? ""}`,
    );
  } else {
    setStatus(`Payment ${receipt.status}: ${receipt.errorCode ?? ""}`);
  }

  void listReceipts();
}

void renderList();
