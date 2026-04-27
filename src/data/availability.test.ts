import { describe, it, expect } from "vitest";
import { sampleVendors } from "./vendors";
import { bookedDatesByVendor, isBooked } from "./availability";

describe("bookedDatesByVendor", () => {
  it("has dates for every vendor", () => {
    for (const v of sampleVendors) {
      expect(bookedDatesByVendor[v.id].length).toBeGreaterThanOrEqual(3);
      for (const d of bookedDatesByVendor[v.id]) {
        expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });
  it("isBooked is deterministic", () => {
    const v = sampleVendors[0];
    const date = bookedDatesByVendor[v.id][0];
    expect(isBooked(v.id, date)).toBe(true);
    expect(isBooked(v.id, "1999-01-01")).toBe(false);
  });
});
