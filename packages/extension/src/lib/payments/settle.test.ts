import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("./receipt-store", () => ({
  saveReceipt: vi.fn(async (r: unknown) => r),
}));

vi.mock("./config", () => ({
  loadPaymentConfig: vi.fn(async () => ({
    network: "testnet",
    simulate: true,
    platformPayTo: "PLATFORMADDR",
    algodUrl: "https://testnet-api.algonode.cloud",
  })),
}));

import { settleAfterRun } from "./settle";

describe("settleAfterRun", () => {
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
      amountMicro: 100_000,
      asset: "ALGO",
      developerPayTo: "DEV",
      platformFeeBps: 1000,
    });
    expect(receipt.status).toBe("skipped");
    expect(receipt.totalMicro).toBe(0);
  });

  it("settles on success in simulate mode", async () => {
    const receipt = await settleAfterRun({
      result: {
        type: "SKILL_RESULT",
        runId: "run-success-01",
        status: "success",
      },
      skillId: "summarize-text",
      amountMicro: 100_000,
      asset: "ALGO",
      developerPayTo: "DEVADDR",
      platformFeeBps: 1000,
    });
    expect(receipt.status).toBe("settled");
    expect(receipt.mode).toBe("simulate");
    expect(receipt.developerMicro).toBe(90_000);
    expect(receipt.platformMicro).toBe(10_000);
    expect(receipt.txIds.length).toBe(2);
  });
});
