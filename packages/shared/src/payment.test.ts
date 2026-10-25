import { describe, expect, it } from "vitest";
import {
  buildPaymentPlan,
  shouldChargeOnResult,
  splitPaymentAmounts,
} from "./payment.js";

describe("splitPaymentAmounts", () => {
  it("splits 10% platform fee", () => {
    expect(splitPaymentAmounts(1_000_000, 1000)).toEqual({
      developerMicro: 900_000,
      platformMicro: 100_000,
    });
  });
});

describe("shouldChargeOnResult", () => {
  it("charges only on success", () => {
    expect(shouldChargeOnResult("success")).toBe(true);
    expect(shouldChargeOnResult("failed")).toBe(false);
  });
});

describe("buildPaymentPlan", () => {
  it("builds USDC plan with preferred rail", () => {
    const plan = buildPaymentPlan({
      runId: "run-12345678",
      skillId: "summarize-text",
      amountMicro: 50_000,
      asset: "USDC",
      developerPayTo: "0xDeveloper000000000000000000000000000001",
      platformPayTo: "0xPlatform0000000000000000000000000000001",
      platformFeeBps: 1000,
      network: "testnet",
      preferredRail: "x402_base",
    });
    expect(plan.developerMicro).toBe(45_000);
    expect(plan.platformMicro).toBe(5_000);
    expect(plan.preferredRail).toBe("x402_base");
  });
});
