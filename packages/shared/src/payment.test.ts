import { describe, expect, it } from "vitest";
import { splitPaymentAmounts } from "./payment.js";

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
