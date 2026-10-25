import type { SkillManifest } from "@algogent/shared";
import { parseSkillManifest } from "@algogent/shared";

/** Demo EVM pay-to — replace with real Base USDC recipient. */
const DEMO_DEV = "0xAlgogentSkillDevPlaceholder000000000001";

const RAW_SKILLS = [
  {
    id: "summarize-text",
    name: "Summarize text",
    version: "0.1.0",
    description: "Produce a concise summary of the provided text.",
    author: "algogent",
    providers: ["chatgpt", "claude", "gemini", "meta_ai"],
    pricing: {
      amountMicro: 50_000,
      asset: "USDC",
      platformFeeBps: 1000,
      developerPayTo: DEMO_DEV,
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
    providers: ["chatgpt", "claude", "gemini", "meta_ai"],
    pricing: {
      amountMicro: 50_000,
      asset: "USDC",
      platformFeeBps: 1000,
      developerPayTo: DEMO_DEV,
    },
    bodyPath: "SKILL.md",
    tags: ["writing"],
    inputs: [{ key: "text", label: "Text", required: true }],
  },
] as const;

export const SEED_SKILLS: SkillManifest[] = RAW_SKILLS.map((s) =>
  parseSkillManifest(s),
);

export const SKILL_BODIES: Record<string, string> = {
  "summarize-text": `# Summarize text

You are a precise summarization assistant.

## Task

Summarize the following text in 5 bullets or fewer. Preserve key facts; do not invent details.

## Text

{{text}}
`,
  "rewrite-clear": `# Rewrite for clarity

Rewrite the text below so it is clearer and easier to read.
Keep the original meaning. Use short sentences where possible.

## Text

{{text}}
`,
};

export function getSkillById(id: string): SkillManifest | undefined {
  return SEED_SKILLS.find((s) => s.id === id);
}
