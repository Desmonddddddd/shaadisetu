import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVendorFilters, applyFilters, FilterState } from "./useVendorFilters";
import { makeVendor } from "@/test/fixtures";

const replaceMock = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => searchParams,
  usePathname: () => "/vendors/mumbai/photography",
}));

beforeEach(() => {
  searchParams = new URLSearchParams();
  replaceMock.mockClear();
});

const photog = [
  makeVendor({ id: "v1", rating: 4.9, reviewCount: 200, priceRange: "₹50K-₹1L" }),
  makeVendor({ id: "v2", rating: 4.6, reviewCount: 80, priceRange: "₹1L-₹2L" }),
  makeVendor({ id: "v3", rating: 4.3, reviewCount: 50, priceRange: "₹2L+" }),
];

describe("applyFilters", () => {
  it("filters by min rating", () => {
    const out = applyFilters(photog, { rating: 4.7 } as FilterState);
    expect(out.every((v) => v.rating >= 4.7)).toBe(true);
  });
  it("sorts by rating desc", () => {
    const out = applyFilters(photog, { sort: "rating" } as FilterState);
    for (let i = 1; i < out.length; i++) expect(out[i - 1].rating).toBeGreaterThanOrEqual(out[i].rating);
  });
  it("ignores invalid rating", () => {
    const out = applyFilters(photog, { rating: NaN } as FilterState);
    expect(out.length).toBe(photog.length);
  });
});

describe("useVendorFilters", () => {
  it("reads rating from URL", () => {
    searchParams = new URLSearchParams("rating=4");
    const { result } = renderHook(() => useVendorFilters());
    expect(result.current.filters.rating).toBe(4);
  });
  it("setFilter calls router.replace with new param", () => {
    const { result } = renderHook(() => useVendorFilters());
    act(() => result.current.setFilter("rating", 4.5));
    expect(replaceMock).toHaveBeenCalledWith(expect.stringContaining("rating=4.5"));
  });
});
