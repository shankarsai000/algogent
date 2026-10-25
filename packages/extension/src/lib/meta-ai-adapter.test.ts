import { describe, expect, it } from "vitest";
import { isGenerating, normalizePrompt } from "./meta-ai-adapter";

describe("meta ai normalizePrompt", () => {
  it("trims", () => {
    expect(normalizePrompt("  z  ")).toBe("z");
  });
});

describe("meta ai generating", () => {
  it("detects stop control", () => {
    const root = {
      querySelector: (sel: string) =>
        sel.toLowerCase().includes("stop") ? {} : null,
    } as unknown as ParentNode;
    expect(isGenerating(root)).toBe(true);
  });
});
