import { z } from "zod";

export const PaymentIntentSchema = z.object({
  runId: z.string().uuid(),
  skillId: z.string(),
  amountMicro: z.number().int().positive(),
  asset: z.enum(["ALGO", "USDC"]),
  developerPayTo: z.string(),
  platformPayTo: z.string(),
  platformFeeBps: z.number().int().min(0).max(10_000),
  network: z.enum(["testnet", "mainnet"]).default("testnet"),
});

export type PaymentIntent = z.infer<typeof PaymentIntentSchema>;

export function splitPaymentAmounts(
  amountMicro: number,
  platformFeeBps: number,
): { developerMicro: number; platformMicro: number } {
  if (amountMicro < 0) {
    throw new Error("amountMicro must be non-negative");
  }
  const platformMicro = Math.floor((amountMicro * platformFeeBps) / 10_000);
  const developerMicro = amountMicro - platformMicro;
  return { developerMicro, platformMicro };
}
