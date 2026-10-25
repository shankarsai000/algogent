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

  it("handles zero fee", () => {
    expect(splitPaymentAmounts(500, 0)).toEqual({
      developerMicro: 500,
      platformMicro: 0,
    });
  });
});

describe("shouldChargeOnResult", () => {
  it("charges only on success", () => {
    expect(shouldChargeOnResult("success")).toBe(true);
    expect(shouldChargeOnResult("failed")).toBe(false);
    expect(shouldChargeOnResult("cancelled")).toBe(false);
  });
});

describe("buildPaymentPlan", () => {
  it("builds plan from intent", () => {
    const plan = buildPaymentPlan({
      runId: "run-12345678",
      skillId: "summarize-text",
      amountMicro: 100_000,
      asset: "ALGO",
      developerPayTo: "DEVADDRDEVADDRDEVADDRDEVADDRDEVADDRDEVADDRDEVADDRDEVA",
      platformPayTo: "PLATADDRPLATADDRPLATADDRPLATADDRPLATADDRPLATADDRPLATA",
      platformFeeBps: 1000,
      network: "testnet",
    });
    expect(plan.developerMicro).toBe(90_000);
    expect(plan.platformMicro).toBe(10_000);
  });
});
