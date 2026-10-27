import {
  buildPaymentPlan,
  shouldChargeOnResult,
  type PaymentIntent,
  type PaymentReceipt,
  type SettlementRail,
  type SkillResult,
} from "@algogent/shared";
import { loadPaymentConfig } from "./config";
import {
  hasFreePaidAllowance,
  incrementFreePaidRunsUsed,
  isFreeSkill,
} from "./free-tier";
import { saveReceipt } from "./receipt-store";
import { getSettlementProvider, resolveRail } from "./registry";
import { receiptFromPlan } from "./types";

export type SettleInput = {
  result: SkillResult;
  skillId: string;
  amountMicro: number;
  asset: "ALGO" | "USDC";
  developerPayTo: string;
  platformFeeBps: number;
  preferredRail?: SettlementRail;
};

/**
 * success → (free skip | PaymentPlan → SettlementProvider) → Receipt
 */
export async function settleAfterRun(input: SettleInput): Promise<PaymentReceipt> {
  const { result } = input;

  if (!shouldChargeOnResult(result.status)) {
    const skipped: PaymentReceipt = {
      runId: result.runId,
      skillId: input.skillId,
      network: "testnet",
      mode: "simulate",
      rail: "simulate",
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

  // Free skills: never open a wallet or settlement rail.
  if (isFreeSkill(input.amountMicro)) {
    const free: PaymentReceipt = {
      runId: result.runId,
      skillId: input.skillId,
      network: "testnet",
      mode: "simulate",
      rail: "simulate",
      txIds: [],
      totalMicro: 0,
      developerMicro: 0,
      platformMicro: 0,
      paidAt: new Date().toISOString(),
      status: "settled",
      errorCode: "free_skill",
      paymentId: `free-${result.runId}`,
    };
    await saveReceipt(free);
    return free;
  }

  const config = await loadPaymentConfig();

  if (!input.developerPayTo) {
    const failed: PaymentReceipt = {
      runId: result.runId,
      skillId: input.skillId,
      network: config.network,
      mode: "simulate",
      rail: "simulate",
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

  // First N paid successes: force simulate so no wallet is required.
  let preferredRail = input.preferredRail;
  if (!preferredRail && (await hasFreePaidAllowance())) {
    preferredRail = "simulate";
    await incrementFreePaidRunsUsed();
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
    preferredRail,
  };

  const plan = buildPaymentPlan(intent);
  const rail = resolveRail(plan.preferredRail, config.defaultRail);
  const provider = getSettlementProvider(rail);

  const settleResult = await provider.settle(plan, {
    allowSimulateFallback: config.allowSimulateFallback,
  });

  const status = settleResult.ok ? "settled" : "failed";
  const receipt = receiptFromPlan(plan, settleResult, status);
  await saveReceipt(receipt);
  return receipt;
}
