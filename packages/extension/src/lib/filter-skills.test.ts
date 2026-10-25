import { describe, expect, it } from "vitest";
import { parseSkillManifest } from "@algogent/shared";
import { filterSkills } from "./filter-skills";

const sample = [
  parseSkillManifest({
    id: "summarize-text",
    name: "Summarize text",
    version: "0.1.0",
    description: "Summarize",
    author: "algogent",
    providers: ["chatgpt", "claude"],
    pricing: { amountMicro: 1, asset: "ALGO", platformFeeBps: 0 },
    tags: ["writing"],
  }),
  parseSkillManifest({
    id: "code-review",
    name: "Code review",
    version: "0.1.0",
    description: "Review code",
    author: "algogent",
    providers: ["chatgpt"],
    pricing: { amountMicro: 1, asset: "ALGO", platformFeeBps: 0 },
    tags: ["code"],
  }),
];

describe("filterSkills", () => {
  it("filters by query", () => {
    expect(filterSkills(sample, { query: "code" }).map((s) => s.id)).toEqual([
      "code-review",
    ]);
  });

  it("filters by provider", () => {
    expect(filterSkills(sample, { provider: "claude" }).map((s) => s.id)).toEqual([
      "summarize-text",
    ]);
  });

  it("filters by tag", () => {
    expect(filterSkills(sample, { tag: "writing" }).map((s) => s.id)).toEqual([
      "summarize-text",
    ]);
  });
});
