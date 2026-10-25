/**
 * ChatGPT DOM adapter helpers.
 * Selectors are centralized so UI churn is isolated.
 */

export const CHATGPT_SELECTORS = {
  composer:
    "#prompt-textarea, textarea[data-id], div[contenteditable='true']#prompt-textarea, div.ProseMirror[contenteditable='true']",
  sendButton:
    "button[data-testid='send-button'], button[aria-label*='Send message'], button[aria-label='Send prompt']",
  stopButton:
    "button[data-testid='stop-button'], button[aria-label*='Stop']",
  regenerateButton:
    "button[aria-label*='Regenerate'], button[data-testid='regenerate-button']",
} as const;

export function normalizePrompt(text: string): string {
  return text.trim().replace(/\r\n/g, "\n");
}

export function findComposer(root: ParentNode = document): HTMLElement | null {
  return root.querySelector(CHATGPT_SELECTORS.composer);
}

export function findSendButton(root: ParentNode = document): HTMLButtonElement | null {
  return root.querySelector(CHATGPT_SELECTORS.sendButton);
}

export function isGenerating(root: ParentNode = document): boolean {
  return Boolean(root.querySelector(CHATGPT_SELECTORS.stopButton));
}

export function appearsComplete(root: ParentNode = document): boolean {
  if (isGenerating(root)) return false;
  // Prefer explicit regenerate control; fall back to send button re-enabled.
  if (root.querySelector(CHATGPT_SELECTORS.regenerateButton)) return true;
  const send = findSendButton(root);
  return Boolean(send && !send.disabled);
}

export async function injectPrompt(
  text: string,
  root: ParentNode = document,
): Promise<void> {
  const normalized = normalizePrompt(text);
  const el = findComposer(root);
  if (!el) {
    throw new Error("chatgpt_composer_not_found");
  }

  el.focus();

  if (el instanceof HTMLTextAreaElement) {
    const proto = window.HTMLTextAreaElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
    descriptor?.set?.call(el, normalized);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return;
  }

  // contenteditable / ProseMirror
  el.textContent = "";
  el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "deleteContent" }));
  el.textContent = normalized;
  el.dispatchEvent(
    new InputEvent("input", {
      bubbles: true,
      data: normalized,
      inputType: "insertText",
    }),
  );
}

export async function clickSend(root: ParentNode = document): Promise<void> {
  const button = findSendButton(root);
  if (!button) {
    throw new Error("chatgpt_send_not_found");
  }
  if (button.disabled) {
    // Give the UI a brief moment to enable after input events.
    await sleep(300);
  }
  if (button.disabled) {
    throw new Error("chatgpt_send_disabled");
  }
  button.click();
}

export type WaitOptions = {
  timeoutMs: number;
  pollMs: number;
  /** Optional clock for tests. */
  now?: () => number;
  sleepFn?: (ms: number) => Promise<void>;
  root?: ParentNode;
};

/**
 * Wait until generation starts (optional) then finishes.
 * Success when stop button is gone and completion markers appear,
 * or when send is enabled again after generation was observed.
 */
export async function waitForCompletion(options: WaitOptions): Promise<boolean> {
  const now = options.now ?? Date.now;
  const sleepFn = options.sleepFn ?? sleep;
  const root = options.root ?? document;
  const deadline = now() + options.timeoutMs;

  let sawGenerating = false;

  while (now() < deadline) {
    if (isGenerating(root)) {
      sawGenerating = true;
    } else if (sawGenerating && appearsComplete(root)) {
      return true;
    } else if (!sawGenerating && appearsComplete(root)) {
      // Fast path: some UIs never show stop; accept stable complete state after first poll window.
      await sleepFn(options.pollMs);
      if (!isGenerating(root) && appearsComplete(root)) {
        return true;
      }
    }
    await sleepFn(options.pollMs);
  }

  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
