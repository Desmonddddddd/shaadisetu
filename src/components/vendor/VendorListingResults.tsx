"use client";
import { useMemo } from "react";
import type { Vendor } from "@/types/vendor";
import { applyFilters, useVendorFilters } from "@/hooks/useVendorFilters";
import { VendorRowCard } from "./VendorRowCard";

export function VendorListingResults({
  vendors,
  isAuthed = false,
  savedVendorIds = [],
}: {
  vendors: Vendor[];
  isAuthed?: boolean;
  savedVendorIds?: string[];
}) {
  const savedSet = useMemo(() => new Set(savedVendorIds), [savedVendorIds]);
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
        <VendorRowCard
          key={v.id}
          vendor={v}
          isAuthed={isAuthed}
          initialSaved={savedSet.has(v.id)}
        />
      ))}
    </div>
  );
}
