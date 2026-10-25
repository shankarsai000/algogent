import type { PaymentPlan } from "@algogent/shared";
import type { SettleContext, SettlementProvider, SettlementResult } from "../types";

export const simulateAdapter: SettlementProvider = {
  rail: "simulate",
  async settle(plan: PaymentPlan, _ctx: SettleContext): Promise<SettlementResult> {
    return {
      ok: true,
      rail: "simulate",
      txIds: [
        `sim-dev-${plan.runId.slice(0, 8)}`,
        `sim-plat-${plan.runId.slice(0, 8)}`,
      ],
      paymentId: `sim-pay-${plan.runId}`,
    };
  },
};
