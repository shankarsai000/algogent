/**
 * Free-tier / no-wallet onboarding.
 * - Skills with amountMicro === 0 never charge.
 * - First FREE_PAID_RUN_ALLOWANCE successful *paid* runs may settle via simulate
 *   so users can try the product without connecting a wallet.
 */

const FREE_RUNS_KEY = "freePaidRunsUsed";

/** How many paid-skill successes can settle in simulate without a wallet. */
export const FREE_PAID_RUN_ALLOWANCE = 5;

export function isFreeSkill(amountMicro: number): boolean {
  return !Number.isFinite(amountMicro) || amountMicro <= 0;
}

export async function getFreePaidRunsUsed(): Promise<number> {
  try {
    const data = await chrome.storage.local.get(FREE_RUNS_KEY);
    const n = data[FREE_RUNS_KEY];
    return typeof n === "number" && n >= 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

export async function incrementFreePaidRunsUsed(): Promise<number> {
  const used = await getFreePaidRunsUsed();
  const next = used + 1;
  await chrome.storage.local.set({ [FREE_RUNS_KEY]: next });
  return next;
}

/** True if this paid run may still use simulate without a configured wallet/facilitator. */
export async function hasFreePaidAllowance(): Promise<boolean> {
  const used = await getFreePaidRunsUsed();
  return used < FREE_PAID_RUN_ALLOWANCE;
}
