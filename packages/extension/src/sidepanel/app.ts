import type { SkillManifest } from "@algogent/shared";

/** Seed catalog until remote marketplace exists (Phase 2). */
const SEED_SKILLS: SkillManifest[] = [
  {
    id: "summarize-text",
    name: "Summarize text",
    version: "0.1.0",
    description: "Produce a concise summary of the provided text.",
    author: "algogent",
    providers: ["chatgpt", "claude"],
    pricing: {
      amountMicro: 100_000,
      asset: "ALGO",
      platformFeeBps: 1000,
    },
    bodyPath: "SKILL.md",
    tags: ["writing"],
    inputs: [
      {
        key: "text",
        label: "Text to summarize",
        required: true,
        placeholder: "Paste text…",
      },
    ],
  },
  {
    id: "rewrite-clear",
    name: "Rewrite for clarity",
    version: "0.1.0",
    description: "Rewrite the input in clearer, simpler language.",
    author: "algogent",
    providers: ["chatgpt"],
    pricing: {
      amountMicro: 100_000,
      asset: "ALGO",
      platformFeeBps: 1000,
    },
    bodyPath: "SKILL.md",
    tags: ["writing"],
    inputs: [
      {
        key: "text",
        label: "Text",
        required: true,
      },
    ],
  },
];

function render(): void {
  const root = document.getElementById("root");
  if (!root) return;

  root.innerHTML = `
    <header class="header">
      <h1>Algogent</h1>
      <p class="tagline">Skills marketplace · pay per completed run</p>
    </header>
    <section class="skills">
      ${SEED_SKILLS.map(
        (s) => `
        <article class="card" data-skill-id="${s.id}">
          <h2>${s.name}</h2>
          <p>${s.description}</p>
          <p class="meta">${(s.pricing.amountMicro / 1_000_000).toFixed(3)} ${s.pricing.asset} · ${s.providers.join(", ")}</p>
          <button type="button" class="run" data-skill-id="${s.id}">Run (Phase 1)</button>
        </article>`,
      ).join("")}
    </section>
    <footer class="footer">Phase 1 scaffold · Algorand payments in Phase 3</footer>
  `;

  root.querySelectorAll("button.run").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = (btn as HTMLButtonElement).dataset.skillId;
      const status = document.getElementById("status");
      if (status) {
        status.textContent = `Selected skill: ${id}. Wire RUN_SKILL to active tab in Phase 1.`;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", render);
