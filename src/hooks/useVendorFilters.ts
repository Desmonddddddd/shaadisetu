"use client";
import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { z } from "zod";
import type { Vendor } from "@/types/vendor";

export type SortKey = "popularity" | "rating" | "price-asc" | "price-desc";

export interface FilterState {
  budget?: string;     // raw label, matched against vendor.priceRange
  rating?: number;
  date?: string;       // ISO YYYY-MM-DD
  sort: SortKey;
}

const filterSchema = z.object({
  budget: z.string().optional().catch(undefined),
  rating: z.coerce.number().min(0).max(5).optional().catch(undefined),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .catch(undefined),
  sort: z.enum(["popularity", "rating", "price-asc", "price-desc"]).catch("popularity"),
});

function parseLow(range: string): number {
  const m = range.match(/₹\s*([\d.]+)\s*(K|Lakh|L)?/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const u = (m[2] || "").toLowerCase();
  if (u.startsWith("l")) return n * 100_000;
  if (u === "k") return n * 1000;
  return n;
}

export function applyFilters(vendors: Vendor[], f: FilterState): Vendor[] {
  let out = vendors.slice();
  if (typeof f.rating === "number" && !Number.isNaN(f.rating)) {
    out = out.filter((v) => v.rating >= f.rating!);
  }
  if (f.budget) out = out.filter((v) => v.priceRange === f.budget);

  // Build the secondary comparator from the chosen sort key.
  const secondary = (() => {
    switch (f.sort) {
      case "rating":     return (a: Vendor, b: Vendor) => b.rating - a.rating;
      case "price-asc":  return (a: Vendor, b: Vendor) => parseLow(a.priceRange) - parseLow(b.priceRange);
      case "price-desc": return (a: Vendor, b: Vendor) => parseLow(b.priceRange) - parseLow(a.priceRange);
      default:           return (a: Vendor, b: Vendor) => b.reviewCount - a.reviewCount;
    }
  })();

  out.sort(secondary);
  return out;
}

export function useVendorFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filters: FilterState = useMemo(() => {
    const raw = {
      budget: params.get("budget") ?? undefined,
      rating: params.get("rating") ?? undefined,
      date: params.get("date") ?? undefined,
      sort: params.get("sort") ?? undefined,
    };
    return filterSchema.parse(raw) as FilterState;
  }, [params]);

  const setFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K] | undefined) => {
      const next = new URLSearchParams(params.toString());
      if (value === undefined || value === null || value === "") next.delete(key);
      else next.set(key, String(value));
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [params, pathname, router],
  );

  const clear = useCallback(() => router.replace(pathname), [pathname, router]);

  return { filters, setFilter, clear };
}
