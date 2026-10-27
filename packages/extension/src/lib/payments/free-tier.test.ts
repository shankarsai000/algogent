import { describe, expect, it } from "vitest";
import { isFreeSkill } from "./free-tier";

describe("isFreeSkill", () => {
  it("treats zero and negative as free", () => {
    expect(isFreeSkill(0)).toBe(true);
    expect(isFreeSkill(-1)).toBe(true);
  });

  it("treats positive micro as paid", () => {
    expect(isFreeSkill(1)).toBe(false);
    expect(isFreeSkill(50_000)).toBe(false);
  });
});
