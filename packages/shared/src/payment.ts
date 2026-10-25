import { z } from "zod";

export const PaymentIntentSchema = z.object({
  runId: z.string().min(8),
  skillId: z.string(),
  amountMicro: z.number().int().positive(),
  asset: z.enum(["ALGO", "USDC"]),
  developerPayTo: z.string().min(1),
  platformPayTo: z.string().min(1),
  platformFeeBps: z.number().int().min(0).max(10_000),
  network: z.enum(["testnet", "mainnet"]).default("testnet"),
});

export type PaymentIntent = z.infer<typeof PaymentIntentSchema>;

export const PaymentPlanSchema = z.object({
  runId: z.string().min(8),
  skillId: z.string(),
  network: z.enum(["testnet", "mainnet"]),
  asset: z.enum(["ALGO", "USDC"]),
  totalMicro: z.number().int().positive(),
  developerMicro: z.number().int().nonnegative(),
  platformMicro: z.number().int().nonnegative(),
  developerPayTo: z.string().min(1),
  platformPayTo: z.string().min(1),
});

export type PaymentPlan = z.infer<typeof PaymentPlanSchema>;

export const PaymentReceiptSchema = z.object({
  runId: z.string().min(8),
  skillId: z.string(),
  network: z.enum(["testnet", "mainnet"]),
  mode: z.enum(["onchain", "simulate"]),
  txIds: z.array(z.string()).default([]),
  totalMicro: z.number().int().nonnegative(),
  developerMicro: z.number().int().nonnegative(),
  platformMicro: z.number().int().nonnegative(),
  paidAt: z.string(),
  status: z.enum(["settled", "skipped", "failed"]),
  errorCode: z.string().optional(),
});

export type PaymentReceipt = z.infer<typeof PaymentReceiptSchema>;

export function splitPaymentAmounts(
  amountMicro: number,
  platformFeeBps: number,
): { developerMicro: number; platformMicro: number } {
  if (!Number.isInteger(amountMicro) || amountMicro < 0) {
    throw new Error("amountMicro must be a non-negative integer");
  }
  if (!Number.isInteger(platformFeeBps) || platformFeeBps < 0 || platformFeeBps > 10_000) {
    throw new Error("platformFeeBps must be 0..10000");
  }
  const platformMicro = Math.floor((amountMicro * platformFeeBps) / 10_000);
  const developerMicro = amountMicro - platformMicro;
  return { developerMicro, platformMicro };
}

/** Build a settlement plan from a validated intent. */
export function buildPaymentPlan(intent: PaymentIntent): PaymentPlan {
  const parsed = PaymentIntentSchema.parse(intent);
  const { developerMicro, platformMicro } = splitPaymentAmounts(
    parsed.amountMicro,
    parsed.platformFeeBps,
  );
  return PaymentPlanSchema.parse({
    runId: parsed.runId,
    skillId: parsed.skillId,
    network: parsed.network,
    asset: parsed.asset,
    totalMicro: parsed.amountMicro,
    developerMicro,
    platformMicro,
    developerPayTo: parsed.developerPayTo,
    platformPayTo: parsed.platformPayTo,
  });
}

/** Only successful runs may trigger payment. */
export function shouldChargeOnResult(
  status: "success" | "failed" | "cancelled",
): boolean {
  return status === "success";
}
