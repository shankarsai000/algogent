import { describe, expect, it } from "vitest";
import {
  appearsComplete,
  isGenerating,
  normalizePrompt,
  waitForCompletion,
} from "./chatgpt-adapter";

describe("normalizePrompt", () => {
  it("trims and normalizes newlines", () => {
    expect(normalizePrompt("  hello\r\nworld  ")).toBe("hello\nworld");
  });
});

describe("completion detection", () => {
  it("detects generating via stop button", () => {
    const root = {
      querySelector: (sel: string) => (sel.includes("stop") ? {} : null),
    } as unknown as ParentNode;
    expect(isGenerating(root)).toBe(true);
    expect(appearsComplete(root)).toBe(false);
  });

  it("detects complete via regenerate button", () => {
    const root = {
      querySelector: (sel: string) => {
        if (sel.includes("stop")) return null;
        if (sel.includes("Regenerate") || sel.includes("regenerate")) return {};
        return null;
      },
    } as unknown as ParentNode;
    expect(isGenerating(root)).toBe(false);
    expect(appearsComplete(root)).toBe(true);
  });
});

describe("waitForCompletion", () => {
  it("resolves after generating then complete", async () => {
    let phase: "idle" | "gen" | "done" = "idle";
    const root = {
      querySelector: (sel: string) => {
        if (sel.includes("stop")) return phase === "gen" ? {} : null;
        if (sel.includes("Regenerate") || sel.includes("regenerate")) {
          return phase === "done" ? {} : null;
        }
        return null;
      },
    } as unknown as ParentNode;

    let t = 0;
    await expect(
      waitForCompletion({
        timeoutMs: 5_000,
        pollMs: 10,
        root,
        now: () => t,
        sleepFn: async (ms) => {
          t += ms;
          if (t >= 20 && phase === "idle") phase = "gen";
          else if (t >= 40 && phase === "gen") phase = "done";
        },
      }),
    ).resolves.toBe(true);
  });
});
