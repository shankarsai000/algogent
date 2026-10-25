import type { PaymentPlan } from "@algogent/shared";
import type { SettleContext, SettlementProvider, SettlementResult } from "../types";
import { burnBalance, getBalanceMicro } from "../balance-store";

/**
 * Local prepaid USDC balance (fiat top-up via Stripe Checkout → credit ledger).
 * Burns developer+platform total from the user balance on successful runs.
 * Does not call Stripe APIs from the extension; top-up is a separate flow.
 */
export const stripeBalanceAdapter: SettlementProvider = {
  rail: "stripe_balance",
  async settle(plan: PaymentPlan, _ctx: SettleContext): Promise<SettlementResult> {
    const balance = await getBalanceMicro();
    if (balance < plan.totalMicro) {
      return {
        ok: false,
        rail: "stripe_balance",
        txIds: [],
        errorCode: "stripe_balance_insufficient",
      };
    }

    const next = await burnBalance(plan.totalMicro);
    if (next == null) {
      return {
        ok: false,
        rail: "stripe_balance",
        txIds: [],
        errorCode: "stripe_balance_burn_failed",
      };
    }

    return {
      ok: true,
      rail: "stripe_balance",
      txIds: [`balance-burn-${plan.runId.slice(0, 8)}`],
      paymentId: `bal-${plan.runId}`,
    };
  },
};
