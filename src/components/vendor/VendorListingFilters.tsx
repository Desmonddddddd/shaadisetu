"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useVendorFilters, type SortKey } from "@/hooks/useVendorFilters";

interface Props {
  cityName: string;
  categoryName: string;
}

const RATINGS = [4.5, 4, 3.5];
const SORT_OPTIONS: { v: SortKey; label: string }[] = [
  { v: "popularity", label: "Popularity" },
  { v: "rating", label: "Top rated" },
  { v: "price-asc", label: "Price: low to high" },
  { v: "price-desc", label: "Price: high to low" },
];

function todayLocalISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function VendorListingFilters({ cityName, categoryName }: Props) {
  const { filters, setFilter, clear } = useVendorFilters();
  const [open, setOpen] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasFilters = !!(filters.budget || filters.rating || filters.date) || filters.sort !== "popularity";

  useEffect(() => {
    if (open === null) return;
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="flex flex-wrap items-center gap-2 py-3">
      <span className="px-3 py-1 rounded-full bg-shaadi-deep text-white text-xs">
        <span aria-hidden>📍</span> {cityName}
      </span>
      <span className="px-3 py-1 rounded-full bg-shaadi-deep text-white text-xs">{categoryName}</span>

      <FilterChip
        label={
          filters.rating ? (
            <>
              <span aria-hidden>⭐</span> {filters.rating}+
            </>
          ) : (
            <>
              <span aria-hidden>⭐</span> Rating
            </>
          )
        }
        active={!!filters.rating}
        onOpen={() => setOpen(open === "rating" ? null : "rating")}
        isOpen={open === "rating"}
      >
        {RATINGS.map((r) => (
          <button
            key={r}
            role="menuitem"
            onClick={() => { setFilter("rating", r); setOpen(null); }}
            className="block w-full text-left px-3 py-1.5 hover:bg-shaadi-light text-sm"
          >
            {r}+ stars
          </button>
        ))}
      </FilterChip>

      <FilterChip
        label={
          filters.date ? (
            <>
              <span aria-hidden>📅</span> {filters.date}
            </>
          ) : (
            <>
              <span aria-hidden>📅</span> Date
            </>
          )
        }
        active={!!filters.date}
        onOpen={() => setOpen(open === "date" ? null : "date")}
        isOpen={open === "date"}
      >
        <input
          type="date"
          min={todayLocalISO()}
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
            role="menuitem"
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
  label: React.ReactNode;
  active: boolean;
  isOpen: boolean;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  const panelId = useId();
  return (
    <div className="relative">
      <button
        onClick={onOpen}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={panelId}
        className={`px-3 py-1 rounded-full border text-xs transition-colors ${
          active ? "border-shaadi-deep text-shaadi-deep bg-shaadi-light" : "border-gray-300 text-slate-700 hover:border-slate-400"
        }`}
      >
        {label} <span aria-hidden>▾</span>
      </button>
      {isOpen && (
        <div
          id={panelId}
          role="menu"
          className="absolute z-10 mt-1 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
        >
          {children}
        </div>
      )}
    </div>
  );
}
