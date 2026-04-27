import { describe, it, expect } from "vitest";
import { sampleVendors } from "./vendors";
import { packagesByVendor } from "./packages";

describe("packagesByVendor", () => {
  it("has 3 packages per vendor", () => {
    for (const v of sampleVendors) {
      const pkgs = packagesByVendor[v.id];
      expect(pkgs).toHaveLength(3);
      expect(pkgs.map((p) => p.tier)).toEqual(["basic", "standard", "premium"]);
    }
  });
  it("standard package is marked popular", () => {
    const pkgs = packagesByVendor[sampleVendors[0].id];
    expect(pkgs.find((p) => p.tier === "standard")?.popular).toBe(true);
  });
  it("premium price > standard price > basic price", () => {
    for (const v of sampleVendors) {
      const [b, s, p] = packagesByVendor[v.id];
      expect(s.price).toBeGreaterThan(b.price);
      expect(p.price).toBeGreaterThan(s.price);
    }
  });
});
