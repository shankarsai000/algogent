import type { SettlementRail } from "@algogent/shared";
import type { SettlementProvider } from "./types";
import { simulateAdapter } from "./adapters/simulate";
import { x402BaseAdapter } from "./adapters/x402-base";
import { x402SolanaAdapter } from "./adapters/x402-solana";
import { stripeBalanceAdapter } from "./adapters/stripe-balance";

const PROVIDERS: Record<SettlementRail, SettlementProvider> = {
  simulate: simulateAdapter,
  x402_base: x402BaseAdapter,
  x402_solana: x402SolanaAdapter,
  stripe_balance: stripeBalanceAdapter,
};

export function getSettlementProvider(rail: SettlementRail): SettlementProvider {
  return PROVIDERS[rail];
}

/**
 * Resolve which rail to use.
 * Priority: plan.preferredRail → config default → simulate.
 */
export function resolveRail(
  preferred: SettlementRail | undefined,
  configuredDefault: SettlementRail,
): SettlementRail {
  if (preferred && PROVIDERS[preferred]) return preferred;
  if (PROVIDERS[configuredDefault]) return configuredDefault;
  return "simulate";
}
