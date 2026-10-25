const KEY = "usdcBalanceMicro";

/** Prepaid USDC balance in micro-units (1e6 = $1). */
export async function getBalanceMicro(): Promise<number> {
  try {
    const data = await chrome.storage.local.get(KEY);
    const v = data[KEY];
    return typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0;
  } catch {
    return 0;
  }
}

export async function creditBalance(amountMicro: number): Promise<number> {
  if (!Number.isInteger(amountMicro) || amountMicro < 0) {
    throw new Error("invalid_credit");
  }
  const current = await getBalanceMicro();
  const next = current + amountMicro;
  await chrome.storage.local.set({ [KEY]: next });
  return next;
}

/** Returns new balance, or null if insufficient. */
export async function burnBalance(amountMicro: number): Promise<number | null> {
  if (!Number.isInteger(amountMicro) || amountMicro < 0) {
    throw new Error("invalid_burn");
  }
  const current = await getBalanceMicro();
  if (current < amountMicro) return null;
  const next = current - amountMicro;
  await chrome.storage.local.set({ [KEY]: next });
  return next;
}
