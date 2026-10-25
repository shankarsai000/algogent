import { describe, expect, it } from "vitest";
import { isGenerating, normalizePrompt, appearsComplete } from "./claude-adapter";

describe("claude normalizePrompt", () => {
  it("trims", () => {
    expect(normalizePrompt("  x  ")).toBe("x");
  });
});

describe("claude completion", () => {
  it("detects generating", () => {
    const root = {
      querySelector: (sel: string) => (sel.toLowerCase().includes("stop") ? {} : null),
    } as unknown as ParentNode;
    expect(isGenerating(root)).toBe(true);
    expect(appearsComplete(root)).toBe(false);
  });
});
