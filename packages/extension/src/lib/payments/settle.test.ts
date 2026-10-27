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

vi.mock("./free-tier", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./free-tier")>();
  return {
    ...actual,
    hasFreePaidAllowance: vi.fn(async () => true),
    incrementFreePaidRunsUsed: vi.fn(async () => 1),
  };
});

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

  it("settles free skills with zero total and no rail requirement", async () => {
    const receipt = await settleAfterRun({
      result: {
        type: "SKILL_RESULT",
        runId: "run-free-01",
        status: "success",
      },
      skillId: "summarize-text",
      amountMicro: 0,
      asset: "USDC",
      developerPayTo: "",
      platformFeeBps: 1000,
    });
    expect(receipt.status).toBe("settled");
    expect(receipt.totalMicro).toBe(0);
    expect(receipt.errorCode).toBe("free_skill");
  });

  it("settles success via simulate allowance for paid skills", async () => {
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
    });
    expect(receipt.status).toBe("settled");
    expect(receipt.developerMicro).toBe(90_000);
    expect(receipt.txIds.length).toBeGreaterThan(0);
  });
});
