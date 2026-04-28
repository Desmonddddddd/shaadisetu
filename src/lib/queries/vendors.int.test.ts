import { describe, it, expect } from "vitest";
import { db } from "@/lib/db";
import {
  getVendorsForListing,
  getVendorProfile,
  getVendorsByIds,
  getCategoryVendorCounts,
} from "./vendors";

describe("getVendorsForListing", () => {
  it("returns vendors for a city + category and decodes tags", async () => {
    const mumbai = await db.city.findFirst({ where: { name: "Mumbai" } });
    expect(mumbai).not.toBeNull();
    const out = await getVendorsForListing({
      cityId: mumbai!.id,
      categoryId: "photography",
    });
    expect(out.length).toBeGreaterThan(0);
    for (const v of out) {
      expect(v.cityId).toBe(mumbai!.id);
      expect(v.categoryId).toBe("photography");
      expect(Array.isArray(v.tags)).toBe(true);
    }
  });

  it("returns [] when city has no vendors in that category", async () => {
    const tirupati = await db.city.findFirst({ where: { name: "Tirupati" } });
    expect(tirupati).not.toBeNull();
    const out = await getVendorsForListing({
      cityId: tirupati!.id,
      categoryId: "photography",
    });
    expect(out).toEqual([]);
  });
});

describe("getVendorProfile", () => {
  it("returns the vendor with decoded packages, portfolio, reviews, bookedDates, stats", async () => {
    const v = await getVendorProfile("v5");
    expect(v).not.toBeNull();
    expect(v!.id).toBe("v5");
    expect(Array.isArray(v!.tags)).toBe(true);
    expect(v!.packages.length).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(v!.packages[0].features)).toBe(true);
    expect(v!.portfolio.length).toBeGreaterThanOrEqual(1);
    expect(v!.reviews.length).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(v!.bookedDates)).toBe(true);
    expect(v!.stats).not.toBeNull();
  });

  it("returns null for an unknown id", async () => {
    const v = await getVendorProfile("nonexistent-id");
    expect(v).toBeNull();
  });
});

describe("getVendorsByIds", () => {
  it("returns vendors in the order requested", async () => {
    const out = await getVendorsByIds(["v5", "v1"]);
    expect(out.map((v) => v.id)).toEqual(["v5", "v1"]);
    expect(Array.isArray(out[0].tags)).toBe(true);
  });

  it("ignores ids that don't exist", async () => {
    const out = await getVendorsByIds(["v5", "missing"]);
    expect(out.length).toBe(1);
    expect(out[0].id).toBe("v5");
  });

  it("returns [] for empty input", async () => {
    const out = await getVendorsByIds([]);
    expect(out).toEqual([]);
  });
});

describe("getCategoryVendorCounts", () => {
  it("returns counts for seeded categories", async () => {
    const counts = await getCategoryVendorCounts();
    expect(counts.photography).toBeGreaterThan(0);
    expect(counts.venues).toBeGreaterThan(0);
  });
});
