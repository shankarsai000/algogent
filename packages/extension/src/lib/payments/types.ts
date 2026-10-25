import type { PaymentPlan, PaymentReceipt, SettlementRail } from "@algogent/shared";

export type SettleContext = {
  /** When true, adapters that need live chain/wallet may still soft-fail. */
  allowSimulateFallback: boolean;
};

export type SettlementResult = {
  ok: boolean;
  rail: SettlementRail;
  txIds: string[];
  paymentId?: string;
  errorCode?: string;
};

/**
 * Pluggable settlement backend.
 * success → PaymentPlan → adapter.settle → Receipt
 */
export interface SettlementProvider {
  readonly rail: SettlementRail;
  settle(plan: PaymentPlan, ctx: SettleContext): Promise<SettlementResult>;
}

export function receiptFromPlan(
  plan: PaymentPlan,
  result: SettlementResult,
  status: PaymentReceipt["status"],
): PaymentReceipt {
  return {
    runId: plan.runId,
    skillId: plan.skillId,
    network: plan.network,
    mode: result.rail === "simulate" ? "simulate" : result.rail,
    rail: result.rail,
    txIds: result.txIds,
    paymentId: result.paymentId,
    totalMicro: status === "settled" ? plan.totalMicro : 0,
    developerMicro: status === "settled" ? plan.developerMicro : 0,
    platformMicro: status === "settled" ? plan.platformMicro : 0,
    paidAt: new Date().toISOString(),
    status,
    errorCode: result.errorCode,
  };
}
