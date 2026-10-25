/**
 * Phase 3 network + treasury configuration.
 * Override via chrome.storage.local keys or build-time defaults.
 */

export type AlgoNetwork = "testnet" | "mainnet";

export type PaymentRuntimeConfig = {
  network: AlgoNetwork;
  /** When true, do not broadcast — return simulated tx ids (CI / no wallet). */
  simulate: boolean;
  platformPayTo: string;
  /** Algod REST base URL for suggested params (used in on-chain mode). */
  algodUrl: string;
};

const TESTNET_ALGOD = "https://testnet-api.algonode.cloud";
const MAINNET_ALGOD = "https://mainnet-api.algonode.cloud";

/** Placeholder treasury — replace before real Testnet usage. */
export const DEFAULT_PLATFORM_TREASURY =
  "ALGOPLATFORMTREASURYREPLACEWITHREAL58CHARADDR000000";

export function defaultPaymentConfig(): PaymentRuntimeConfig {
  return {
    network: "testnet",
    simulate: true,
    platformPayTo: DEFAULT_PLATFORM_TREASURY,
    algodUrl: TESTNET_ALGOD,
  };
}

export async function loadPaymentConfig(): Promise<PaymentRuntimeConfig> {
  const defaults = defaultPaymentConfig();
  try {
    const stored = await chrome.storage.local.get([
      "algoNetwork",
      "paymentSimulate",
      "platformPayTo",
    ]);
    const network =
      stored.algoNetwork === "mainnet" ? "mainnet" : defaults.network;
    return {
      network,
      simulate:
        typeof stored.paymentSimulate === "boolean"
          ? stored.paymentSimulate
          : defaults.simulate,
      platformPayTo:
        typeof stored.platformPayTo === "string" && stored.platformPayTo.length > 0
          ? stored.platformPayTo
          : defaults.platformPayTo,
      algodUrl: network === "mainnet" ? MAINNET_ALGOD : TESTNET_ALGOD,
    };
  } catch {
    return defaults;
  }
}
