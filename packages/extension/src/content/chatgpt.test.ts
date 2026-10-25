import { describe, expect, it } from "vitest";

/** Pure helper extracted for testability without full DOM. */
export function normalizePrompt(text: string): string {
  return text.trim().replace(/\r\n/g, "\n");
}

describe("normalizePrompt", () => {
  it("trims and normalizes newlines", () => {
    expect(normalizePrompt("  hello\r\nworld  ")).toBe("hello\nworld");
  });
});
