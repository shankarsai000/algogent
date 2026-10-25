import { describe, expect, it } from "vitest";
import { buildX402Payload } from "./x402-base";

describe("buildX402Payload", () => {
  it("includes developer and platform splits", () => {
    const payload = buildX402Payload(
      {
        runId: "run-abcdef01",
        skillId: "summarize-text",
        network: "testnet",
        asset: "USDC",
        totalMicro: 100_000,
        developerMicro: 90_000,
        platformMicro: 10_000,
        developerPayTo: "0xDev",
        platformPayTo: "0xPlat",
      },
      "base",
    );
    expect(payload.protocol).toBe("x402");
    expect(payload.chain).toBe("base");
    expect(payload.splits).toHaveLength(2);
    expect(payload.splits[0]?.amountMicro).toBe(90_000);
  });
});
