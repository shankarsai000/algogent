/**
 * Gemini (gemini.google.com) DOM adapter helpers.
 */

export const GEMINI_SELECTORS = {
  composer:
    "div.ql-editor[contenteditable='true'], rich-textarea div[contenteditable='true'], div[contenteditable='true'][aria-label*='prompt'], div[contenteditable='true']",
  sendButton:
    "button[aria-label*='Send'], button[aria-label*='submit'], button.send-button, button[mattooltip*='Send']",
  stopButton:
    "button[aria-label*='Stop'], button[aria-label*='stop']",
} as const;

export function normalizePrompt(text: string): string {
  return text.trim().replace(/\r\n/g, "\n");
}

export function findComposer(root: ParentNode = document): HTMLElement | null {
  const nodes = root.querySelectorAll(GEMINI_SELECTORS.composer);
  return (nodes[nodes.length - 1] as HTMLElement) ?? null;
}

export function findSendButton(
  root: ParentNode = document,
): HTMLButtonElement | null {
  return root.querySelector(GEMINI_SELECTORS.sendButton);
}

export function isGenerating(root: ParentNode = document): boolean {
  return Boolean(root.querySelector(GEMINI_SELECTORS.stopButton));
}

export function appearsComplete(root: ParentNode = document): boolean {
  if (isGenerating(root)) return false;
  const send = findSendButton(root);
  return Boolean(send && !send.disabled);
}

export async function injectPrompt(
  text: string,
  root: ParentNode = document,
): Promise<void> {
  const normalized = normalizePrompt(text);
  const el = findComposer(root);
  if (!el) throw new Error("gemini_composer_not_found");
  el.focus();
  el.textContent = "";
  el.dispatchEvent(
    new InputEvent("input", { bubbles: true, inputType: "deleteContent" }),
  );
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
  if (!button) throw new Error("gemini_send_not_found");
  if (button.disabled) await sleep(300);
  if (button.disabled) throw new Error("gemini_send_disabled");
  button.click();
}

export type WaitOptions = {
  timeoutMs: number;
  pollMs: number;
  now?: () => number;
  sleepFn?: (ms: number) => Promise<void>;
  root?: ParentNode;
};

export async function waitForCompletion(
  options: WaitOptions,
): Promise<boolean> {
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
      await sleepFn(options.pollMs);
      if (!isGenerating(root) && appearsComplete(root)) return true;
    }
    await sleepFn(options.pollMs);
  }
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
