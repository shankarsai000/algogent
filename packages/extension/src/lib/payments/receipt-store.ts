import type { PaymentReceipt } from "@algogent/shared";

const KEY = "paymentReceipts";
const MAX = 50;

export async function saveReceipt(receipt: PaymentReceipt): Promise<void> {
  const existing = await listReceipts();
  const next = [receipt, ...existing.filter((r) => r.runId !== receipt.runId)].slice(
    0,
    MAX,
  );
  await chrome.storage.local.set({ [KEY]: next });
}

export async function listReceipts(): Promise<PaymentReceipt[]> {
  try {
    const data = await chrome.storage.local.get(KEY);
    const raw = data[KEY];
    return Array.isArray(raw) ? (raw as PaymentReceipt[]) : [];
  } catch {
    return [];
  }
}
