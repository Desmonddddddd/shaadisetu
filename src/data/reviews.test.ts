import { describe, it, expect } from "vitest";
import { sampleVendors } from "./vendors";
import { reviewsByVendor } from "./reviews";

describe("reviewsByVendor", () => {
  it("has 5–10 reviews per vendor", () => {
    for (const v of sampleVendors) {
      const r = reviewsByVendor[v.id];
      expect(r.length).toBeGreaterThanOrEqual(5);
      expect(r.length).toBeLessThanOrEqual(10);
      for (const x of r) {
        expect(x.rating).toBeGreaterThanOrEqual(1);
        expect(x.rating).toBeLessThanOrEqual(5);
        expect(x.body.length).toBeGreaterThan(20);
      }
    }
  });
});
