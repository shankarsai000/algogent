import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("./receipt-store", () => ({
  saveReceipt: vi.fn(async (r: unknown) => r),
}));

vi.mock("./config", () => ({
  loadPaymentConfig: vi.fn(async () => ({
    network: "testnet",
    defaultRail: "x402_base",
    allowSimulateFallback: true,
    platformPayTo: "0xPlatform",
  })),
}));

import { settleAfterRun } from "./settle";

describe("settleAfterRun pipeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not charge on failed runs", async () => {
    const receipt = await settleAfterRun({
      result: {
        type: "SKILL_RESULT",
        runId: "run-failed-01",
        status: "failed",
        errorCode: "x",
      },
      skillId: "summarize-text",
      amountMicro: 50_000,
      asset: "USDC",
      developerPayTo: "0xDev",
      platformFeeBps: 1000,
    });
    expect(receipt.status).toBe("skipped");
    expect(receipt.totalMicro).toBe(0);
  });

  it("settles success via x402_base with simulate fallback", async () => {
    const receipt = await settleAfterRun({
      result: {
        type: "SKILL_RESULT",
        runId: "run-success-01",
        status: "success",
      },
      skillId: "summarize-text",
      amountMicro: 100_000,
      asset: "USDC",
      developerPayTo: "0xDev",
      platformFeeBps: 1000,
      preferredRail: "x402_base",
    });
    expect(receipt.status).toBe("settled");
    expect(receipt.developerMicro).toBe(90_000);
    expect(receipt.platformMicro).toBe(10_000);
    expect(receipt.txIds.length).toBeGreaterThan(0);
  });

  it("can force pure simulate rail", async () => {
    const receipt = await settleAfterRun({
      result: {
        type: "SKILL_RESULT",
        runId: "run-success-02",
        status: "success",
      },
      skillId: "summarize-text",
      amountMicro: 100_000,
      asset: "USDC",
      developerPayTo: "0xDev",
      platformFeeBps: 1000,
      preferredRail: "simulate",
    });
    expect(receipt.status).toBe("settled");
    expect(receipt.mode).toBe("simulate");
  });
});
