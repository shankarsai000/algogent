import { describe, expect, it } from "vitest";
import { detectProviderFromUrl } from "./providers.js";

describe("detectProviderFromUrl", () => {
  it("detects all supported providers", () => {
    expect(detectProviderFromUrl("https://chatgpt.com/")).toBe("chatgpt");
    expect(detectProviderFromUrl("https://claude.ai/chat/x")).toBe("claude");
    expect(detectProviderFromUrl("https://gemini.google.com/app")).toBe(
      "gemini",
    );
    expect(detectProviderFromUrl("https://www.meta.ai/")).toBe("meta_ai");
  });

  it("returns null for unknown hosts", () => {
    expect(detectProviderFromUrl("https://example.com")).toBeNull();
  });
});
