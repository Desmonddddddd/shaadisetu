"use client";
import { useState } from "react";
import { useVendorFilters } from "@/hooks/useVendorFilters";

interface Props {
  cityName: string;
  categoryName: string;
}

const RATINGS = [4.5, 4, 3.5];
const SORT_OPTIONS: { v: "popularity" | "rating" | "price-asc" | "price-desc"; label: string }[] = [
  { v: "popularity", label: "Popularity" },
  { v: "rating", label: "Top rated" },
  { v: "price-asc", label: "Price: low to high" },
  { v: "price-desc", label: "Price: high to low" },
];

export function VendorListingFilters({ cityName, categoryName }: Props) {
  const { filters, setFilter, clear } = useVendorFilters();
  const [open, setOpen] = useState<string | null>(null);
  const hasFilters = !!(filters.budget || filters.rating || filters.date) || filters.sort !== "popularity";

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <span className="px-3 py-1 rounded-full bg-shaadi-deep text-white text-xs">📍 {cityName}</span>
      <span className="px-3 py-1 rounded-full bg-shaadi-deep text-white text-xs">{categoryName}</span>

      <FilterChip
        label={filters.rating ? `⭐ ${filters.rating}+` : "⭐ Rating"}
        active={!!filters.rating}
        onOpen={() => setOpen(open === "rating" ? null : "rating")}
        isOpen={open === "rating"}
      >
        {RATINGS.map((r) => (
          <button
            key={r}
            onClick={() => { setFilter("rating", r); setOpen(null); }}
            className="block w-full text-left px-3 py-1.5 hover:bg-shaadi-light text-sm"
          >
            {r}+ stars
          </button>
        ))}
      </FilterChip>

      <FilterChip
        label={filters.date ? `📅 ${filters.date}` : "📅 Date"}
        active={!!filters.date}
        onOpen={() => setOpen(open === "date" ? null : "date")}
        isOpen={open === "date"}
      >
        <input
          type="date"
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => { setFilter("date", e.target.value); setOpen(null); }}
          className="block w-full px-3 py-2 text-sm"
        />
      </FilterChip>

      <FilterChip
        label={`Sort: ${SORT_OPTIONS.find((s) => s.v === filters.sort)?.label}`}
        active={filters.sort !== "popularity"}
        onOpen={() => setOpen(open === "sort" ? null : "sort")}
        isOpen={open === "sort"}
      >
        {SORT_OPTIONS.map((s) => (
          <button
            key={s.v}
            onClick={() => { setFilter("sort", s.v); setOpen(null); }}
            className="block w-full text-left px-3 py-1.5 hover:bg-shaadi-light text-sm"
          >
            {s.label}
          </button>
        ))}
      </FilterChip>

      {hasFilters && (
        <button onClick={clear} className="text-xs text-shaadi-deep underline ml-2">
          Clear all
        </button>
      )}
    </div>
  );
}

function FilterChip({
  label, active, isOpen, onOpen, children,
}: {
  label: string;
  active: boolean;
  isOpen: boolean;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        onClick={onOpen}
        className={`px-3 py-1 rounded-full border text-xs transition-colors ${
          active ? "border-shaadi-deep text-shaadi-deep bg-shaadi-light" : "border-gray-300 text-slate-700 hover:border-slate-400"
        }`}
      >
        {label} ▾
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}
