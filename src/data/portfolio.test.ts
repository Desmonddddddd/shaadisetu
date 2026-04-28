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

describe("portfolio URLs", () => {
  it("every URL has w=1200&q=80 query params", () => {
    for (const v of sampleVendors) {
      for (const img of portfolioByVendor[v.id]) {
        expect(img.url).toMatch(/\?w=1200&q=80$/);
      }
    }
  });
});

describe("portfolio determinism", () => {
  it("first vendor's image ids are stable", () => {
    const first = sampleVendors[0];
    const ids = portfolioByVendor[first.id].slice(0, 3).map((i) => i.id);
    expect(ids).toEqual([`${first.id}-0`, `${first.id}-1`, `${first.id}-2`]);
  });
});
