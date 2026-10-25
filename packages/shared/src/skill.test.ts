import { describe, expect, it } from "vitest";
import { parseSkillManifest, renderSkillBody } from "./skill.js";

describe("parseSkillManifest", () => {
  it("accepts a valid manifest", () => {
    const manifest = parseSkillManifest({
      id: "summarize-page",
      name: "Summarize",
      version: "0.1.0",
      description: "Summarize user text",
      author: "algogent",
      providers: ["chatgpt"],
      pricing: { amountMicro: 100_000, asset: "ALGO", platformFeeBps: 1000 },
    });
    expect(manifest.id).toBe("summarize-page");
  });
});

describe("renderSkillBody", () => {
  it("fills known placeholders", () => {
    expect(renderSkillBody("Hello {{ name }}", { name: "Ada" })).toBe(
      "Hello Ada",
    );
  });

  it("leaves unknown placeholders", () => {
    expect(renderSkillBody("Hi {{ missing }}", {})).toBe("Hi {{ missing }}");
  });
});
