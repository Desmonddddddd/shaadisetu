import { describe, it, expect } from "vitest";
import { sampleVendors } from "./vendors";
import { portfolioByVendor } from "./portfolio";

describe("portfolioByVendor", () => {
  it("has 5–8 images per vendor", () => {
    for (const v of sampleVendors) {
      const imgs = portfolioByVendor[v.id];
      expect(imgs.length).toBeGreaterThanOrEqual(5);
      expect(imgs.length).toBeLessThanOrEqual(8);
      for (const img of imgs) {
        expect(img.url).toMatch(/^https:\/\/images\.unsplash\.com\//);
        expect(img.eventType).toMatch(/haldi|mehendi|wedding|reception|engagement/);
      }
    }
  });
});
