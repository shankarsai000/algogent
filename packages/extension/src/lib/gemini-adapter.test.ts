import { describe, expect, it } from "vitest";
import { appearsComplete, isGenerating, normalizePrompt } from "./gemini-adapter";

describe("gemini normalizePrompt", () => {
  it("trims", () => {
    expect(normalizePrompt("  hi  ")).toBe("hi");
  });
});

describe("gemini completion", () => {
  it("detects generating via stop", () => {
    const root = {
      querySelector: (sel: string) =>
        sel.toLowerCase().includes("stop") ? {} : null,
    } as unknown as ParentNode;
    expect(isGenerating(root)).toBe(true);
    expect(appearsComplete(root)).toBe(false);
  });
});
