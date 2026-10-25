import type { SettlementRail } from "@algogent/shared";

export type PaymentRuntimeConfig = {
  network: "testnet" | "mainnet";
  /** Default settlement rail when skill does not override. */
  defaultRail: SettlementRail;
  /** If preferred rail fails config, fall back to simulate. */
  allowSimulateFallback: boolean;
  platformPayTo: string;
};

export const DEFAULT_PLATFORM_TREASURY =
  "0xAlgogentPlatformTreasuryReplace0000000001";

export function defaultPaymentConfig(): PaymentRuntimeConfig {
  return {
    network: "testnet",
    defaultRail: "x402_base",
    allowSimulateFallback: true,
    platformPayTo: DEFAULT_PLATFORM_TREASURY,
  };
}

export async function loadPaymentConfig(): Promise<PaymentRuntimeConfig> {
  const defaults = defaultPaymentConfig();
  try {
    const stored = await chrome.storage.local.get([
      "algoNetwork",
      "paymentNetwork",
      "defaultSettlementRail",
      "allowSimulateFallback",
      "platformPayTo",
    ]);
    const network =
      stored.paymentNetwork === "mainnet" || stored.algoNetwork === "mainnet"
        ? "mainnet"
        : "testnet";
    const rail = normalizeRail(stored.defaultSettlementRail) ?? defaults.defaultRail;
    return {
      network,
      defaultRail: rail,
      allowSimulateFallback:
        typeof stored.allowSimulateFallback === "boolean"
          ? stored.allowSimulateFallback
          : defaults.allowSimulateFallback,
      platformPayTo:
        typeof stored.platformPayTo === "string" && stored.platformPayTo.length > 0
          ? stored.platformPayTo
          : defaults.platformPayTo,
    };
  } catch {
    return defaults;
  }
}

function normalizeRail(value: unknown): SettlementRail | null {
  if (
    value === "simulate" ||
    value === "x402_base" ||
    value === "x402_solana" ||
    value === "stripe_balance"
  ) {
    return value;
  }
  return null;
}
