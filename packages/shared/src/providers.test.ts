import { describe, expect, it } from "vitest";
import { detectProviderFromUrl } from "./providers.js";

describe("detectProviderFromUrl", () => {
  it("detects ChatGPT", () => {
    expect(detectProviderFromUrl("https://chatgpt.com/")).toBe("chatgpt");
    expect(detectProviderFromUrl("https://chat.openai.com/c/123")).toBe(
      "chatgpt",
    );
  });

  it("detects Claude", () => {
    expect(detectProviderFromUrl("https://claude.ai/chat/xyz")).toBe("claude");
  });

  it("returns null for unknown hosts", () => {
    expect(detectProviderFromUrl("https://example.com")).toBeNull();
  });
});
