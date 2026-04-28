"use client";
import { useMemo } from "react";
import type { Vendor } from "@/types/vendor";
import { applyFilters, useVendorFilters } from "@/hooks/useVendorFilters";
import { VendorRowCard } from "./VendorRowCard";

export function VendorListingResults({ vendors }: { vendors: Vendor[] }) {
  const { filters, clear } = useVendorFilters();
  const filtered = useMemo(() => applyFilters(vendors, filters), [vendors, filters]);

  if (filtered.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600 mb-4">No vendors match your filters.</p>
        <button onClick={clear} className="text-shaadi-deep underline">
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {filtered.map((v) => (
        <VendorRowCard key={v.id} vendor={v} />
      ))}
    </div>
  );
}
