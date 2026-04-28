import { describe, expect, it } from "vitest";
import {
  parsePriceBand,
  estimatedTotalForVendor,
  vendorFitsTier,
} from "./pricing";

describe("parsePriceBand", () => {
  it("parses ₹X-Y Lakh with shared trailing suffix", () => {
    expect(parsePriceBand("₹5-15 Lakh")).toEqual({
      min: 500_000,
      max: 1_500_000,
      perPlate: false,
      perPiece: false,
    });
  });

  it("parses ₹X-Y Cr", () => {
    expect(parsePriceBand("₹1-2 Cr")).toEqual({
      min: 10_000_000,
      max: 20_000_000,
      perPlate: false,
      perPiece: false,
    });
  });

  it("parses mixed K and Lakh suffixes (₹25K-1 Lakh)", () => {
    expect(parsePriceBand("₹25K-1 Lakh")).toEqual({
      min: 25_000,
      max: 100_000,
      perPlate: false,
      perPiece: false,
    });
  });

  it("parses K-K range (₹15K-50K)", () => {
    expect(parsePriceBand("₹15K-50K")).toEqual({
      min: 15_000,
      max: 50_000,
      perPlate: false,
      perPiece: false,
    });
  });

  it("parses Under ₹X Lakh", () => {
    expect(parsePriceBand("Under ₹1 Lakh")).toEqual({
      min: 0,
      max: 100_000,
      perPlate: false,
      perPiece: false,
    });
  });

  it("flags /plate pricing", () => {
    const band = parsePriceBand("₹800-2000/plate");
    expect(band).toEqual({ min: 800, max: 2_000, perPlate: true, perPiece: false });
  });

  it("flags /piece pricing", () => {
    const band = parsePriceBand("₹500-3000/piece");
    expect(band).toEqual({ min: 500, max: 3_000, perPlate: false, perPiece: true });
  });

  it("returns null for unparseable strings", () => {
    expect(parsePriceBand("on request")).toBeNull();
    expect(parsePriceBand("")).toBeNull();
    expect(parsePriceBand(null)).toBeNull();
  });
});

describe("estimatedTotalForVendor", () => {
  it("uses midpoint for flat-fee vendors", () => {
    expect(
      estimatedTotalForVendor({
        min: 500_000,
        max: 1_500_000,
        perPlate: false,
        perPiece: false,
      }),
    ).toBe(1_000_000);
  });

  it("multiplies by 200 for per-plate vendors", () => {
    expect(
      estimatedTotalForVendor({
        min: 800,
        max: 2_000,
        perPlate: true,
        perPiece: false,
      }),
    ).toBe(280_000);
  });

  it("multiplies by 100 for per-piece vendors", () => {
    expect(
      estimatedTotalForVendor({
        min: 500,
        max: 3_000,
        perPlate: false,
        perPiece: true,
      }),
    ).toBe(175_000);
  });
});

describe("vendorFitsTier", () => {
  it("rejects null bands", () => {
    expect(vendorFitsTier(null, 500_000)).toBe(false);
  });

  it("accepts vendors within the allowance", () => {
    const band = parsePriceBand("₹2-5 Lakh");
    expect(vendorFitsTier(band, 500_000)).toBe(true);
  });

  it("rejects vendors above the allowance", () => {
    const band = parsePriceBand("₹15-50 Lakh");
    expect(vendorFitsTier(band, 500_000)).toBe(false);
  });
});
