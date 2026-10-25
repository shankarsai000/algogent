import "./style.css";
import { renderSkillBody, type SkillManifest } from "@algogent/shared";
import { SEED_SKILLS, SKILL_BODIES } from "../../lib/catalog";
import { createRunId } from "../../lib/ids";

const root = document.getElementById("root");
if (!root) {
  throw new Error("missing #root");
}

let selected: SkillManifest | null = null;
let statusText = "Open ChatGPT, then run a skill.";

function setStatus(text: string): void {
  statusText = text;
  const el = document.getElementById("status");
  if (el) el.textContent = text;
}

function renderList(): void {
  root!.innerHTML = `
    <header class="header">
      <h1>Algogent</h1>
      <p class="tagline">Skills · pay per completed run (payments in Phase 3)</p>
    </header>
    <section class="skills" id="skills"></section>
    <p id="status" class="status" role="status">${statusText}</p>
  `;

  const list = document.getElementById("skills");
  if (!list) return;

  for (const skill of SEED_SKILLS) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h2>${escapeHtml(skill.name)}</h2>
      <p>${escapeHtml(skill.description)}</p>
      <p class="meta">${(skill.pricing.amountMicro / 1_000_000).toFixed(3)} ${skill.pricing.asset} · ${skill.providers.join(", ")}</p>
      <button type="button" class="run">Configure &amp; run</button>
    `;
    card.querySelector("button")?.addEventListener("click", () => {
      selected = skill;
      renderDetail(skill);
    });
    list.appendChild(card);
  }
}

function renderDetail(skill: SkillManifest): void {
  const fields = skill.inputs
    .map(
      (input) => `
      <label class="field">
        <span>${escapeHtml(input.label)}${input.required ? " *" : ""}</span>
        <textarea
          data-key="${escapeHtml(input.key)}"
          rows="4"
          placeholder="${escapeHtml(input.placeholder ?? "")}"
          ${input.required ? "required" : ""}
        ></textarea>
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
      <button type="submit" class="run primary">Run on active ChatGPT tab</button>
    </form>
    <p id="status" class="status" role="status">${statusText}</p>
  `;

  document.getElementById("back")?.addEventListener("click", () => {
    selected = null;
    renderList();
  });

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
    setStatus(
      `Open a ChatGPT tab first (${active?.error ?? "no_active_tab"}).`,
    );
    return;
  }

  if (!skill.providers.includes(active.provider)) {
    setStatus(
      `This skill supports ${skill.providers.join(", ")}; active is ${active.provider}.`,
    );
    return;
  }

  setStatus("Running skill on provider…");
  const result = await chrome.runtime.sendMessage({
    type: "RUN_SKILL",
    skillId: skill.id,
    provider: active.provider,
    renderedBody,
    runId,
  });

  if (result?.status === "success") {
    setStatus(`Success · run ${runId.slice(0, 8)}…`);
  } else {
    setStatus(`Failed: ${result?.errorCode ?? result?.status ?? "unknown"}`);
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

renderList();
void selected;
