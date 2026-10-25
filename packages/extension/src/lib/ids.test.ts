import { describe, expect, it } from "vitest";
import { createRunId } from "./ids";

describe("createRunId", () => {
  it("returns a non-empty string", () => {
    expect(createRunId().length).toBeGreaterThan(8);
  });
});
