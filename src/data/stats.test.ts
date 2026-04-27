import { describe, it, expect } from "vitest";
import { sampleVendors } from "./vendors";
import { statsByVendor } from "./stats";

describe("statsByVendor", () => {
  it("has stats for every sample vendor", () => {
    for (const v of sampleVendors) {
      expect(statsByVendor[v.id]).toBeDefined();
      expect(statsByVendor[v.id].weddingsCompleted).toBeGreaterThan(0);
      expect(statsByVendor[v.id].yearsExperience).toBe(v.yearsExperience);
    }
  });
});
