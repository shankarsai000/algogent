import {
  buildPaymentPlan,
  shouldChargeOnResult,
  type PaymentIntent,
  type PaymentReceipt,
  type SkillResult,
} from "@algogent/shared";
import { loadPaymentConfig } from "./config";
import { saveReceipt } from "./receipt-store";

export type SettleInput = {
  result: SkillResult;
  skillId: string;
  amountMicro: number;
  asset: "ALGO" | "USDC";
  developerPayTo: string;
  platformFeeBps: number;
};

/**
 * Gate + settle payment after a skill run.
 * Failed/cancelled runs never charge.
 */
export async function settleAfterRun(input: SettleInput): Promise<PaymentReceipt> {
  const { result } = input;

  if (!shouldChargeOnResult(result.status)) {
    const skipped: PaymentReceipt = {
      runId: result.runId,
      skillId: input.skillId,
      network: "testnet",
      mode: "simulate",
      txIds: [],
      totalMicro: 0,
      developerMicro: 0,
      platformMicro: 0,
      paidAt: new Date().toISOString(),
      status: "skipped",
      errorCode: `no_charge_on_${result.status}`,
    };
    await saveReceipt(skipped);
    return skipped;
  }

  const config = await loadPaymentConfig();

  if (!input.developerPayTo) {
    const failed: PaymentReceipt = {
      runId: result.runId,
      skillId: input.skillId,
      network: config.network,
      mode: config.simulate ? "simulate" : "onchain",
      txIds: [],
      totalMicro: 0,
      developerMicro: 0,
      platformMicro: 0,
      paidAt: new Date().toISOString(),
      status: "failed",
      errorCode: "missing_developer_pay_to",
    };
    await saveReceipt(failed);
    return failed;
  }

  const intent: PaymentIntent = {
    runId: result.runId,
    skillId: input.skillId,
    amountMicro: input.amountMicro,
    asset: input.asset,
    developerPayTo: input.developerPayTo,
    platformPayTo: config.platformPayTo,
    platformFeeBps: input.platformFeeBps,
    network: config.network,
  };

  const plan = buildPaymentPlan(intent);

  // Phase 3.0: simulate atomic group settlement.
  // Phase 3.1+: encode real Payment txns with algosdk + wallet.signTxns + algod send.
  const txIds = config.simulate
    ? [
        `sim-dev-${result.runId.slice(0, 8)}`,
        `sim-plat-${result.runId.slice(0, 8)}`,
      ]
    : await submitAtomicGroupPlaceholder(plan);

  const receipt: PaymentReceipt = {
    runId: plan.runId,
    skillId: plan.skillId,
    network: plan.network,
    mode: config.simulate ? "simulate" : "onchain",
    txIds,
    totalMicro: plan.totalMicro,
    developerMicro: plan.developerMicro,
    platformMicro: plan.platformMicro,
    paidAt: new Date().toISOString(),
    status: "settled",
  };
  await saveReceipt(receipt);
  return receipt;
}

/**
 * Placeholder for real algosdk atomic group submit.
 * Throws until on-chain path is fully wired with a live wallet.
 */
async function submitAtomicGroupPlaceholder(_plan: {
  developerMicro: number;
  platformMicro: number;
}): Promise<string[]> {
  throw new Error(
    "onchain_not_configured: enable simulate mode or wire algosdk + wallet signTxns",
  );
}
