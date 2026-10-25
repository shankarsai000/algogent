/**
 * ChatGPT content adapter (Phase 1 skeleton).
 *
 * Strategy:
 * 1. Locate the composer textarea / contenteditable.
 * 2. Set value and dispatch input events.
 * 3. Click send.
 * 4. Observe DOM for completion markers (stop button → regenerate, etc.).
 *
 * Selectors are intentionally centralized so provider UI churn is isolated.
 */

const SELECTORS = {
  composer: "#prompt-textarea, textarea[data-id], div[contenteditable='true']",
  sendButton: "button[data-testid='send-button'], button[aria-label*='Send']",
} as const;

export function findComposer(): HTMLElement | null {
  return document.querySelector(SELECTORS.composer);
}

export async function injectPrompt(text: string): Promise<void> {
  const el = findComposer();
  if (!el) {
    throw new Error("chatgpt_composer_not_found");
  }

  if (el instanceof HTMLTextAreaElement) {
    el.focus();
    el.value = text;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  } else {
    el.focus();
    el.textContent = text;
    el.dispatchEvent(new InputEvent("input", { bubbles: true, data: text }));
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "RUN_SKILL" && typeof message.renderedBody === "string") {
    void injectPrompt(message.renderedBody)
      .then(() => sendResponse({ type: "SKILL_RESULT", status: "success", runId: message.runId }))
      .catch((err: unknown) =>
        sendResponse({
          type: "SKILL_RESULT",
          status: "failed",
          runId: message.runId,
          errorCode: err instanceof Error ? err.message : "inject_failed",
        }),
      );
    return true;
  }
  return false;
});
