"use client";

import { useEffect, useState, useTransition, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterPills } from "@/components/editorial/FilterPills";

interface City {
  id: string;
  name: string;
}
interface Category {
  id: string;
  name: string;
}

interface Props {
  cities: City[];
  categories: Category[];
  initialQuery: string;
  initialCity: string;
  initialCategory: string;
  totalCount: number;
}

export function VendorsControls({
  cities,
  categories,
  initialQuery,
  initialCity,
  initialCategory,
  totalCount,
}: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(initialQuery);
  const [city, setCity] = useState(initialCity);
  const [category, setCategory] = useState(initialCategory);
  const [isPending, startTransition] = useTransition();

  // Push state to URL whenever any control changes; debounce only the text input.
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(sp.toString());
      setOrDelete(next, "q", q);
      setOrDelete(next, "city", city);
      setOrDelete(next, "category", category);
      const url = next.toString() ? `/vendors?${next.toString()}` : "/vendors";
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    }, 220);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, city, category]);

  const cityOptions = useMemo(
    () => cities.map((c) => ({ value: c.id, label: c.name })),
    [cities],
  );
  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories],
  );

  const hasFilters = q.trim().length > 0 || city !== "" || category !== "";

  return (
    <div className="space-y-7 fade-up stagger-1">
      <div className="flex items-center gap-3">
        <SearchIcon />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search photographers, decor, venues, names…"
          className="editorial-input flex-1"
        />
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCity("");
              setCategory("");
            }}
            className="text-[0.65rem] uppercase tracking-[0.2em] text-bordeaux hover:text-ink transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <FilterPills
        label="City"
        options={cityOptions}
        value={city}
        onChange={setCity}
        allLabel="All Cities"
      />
      <FilterPills
        label="Category"
        options={categoryOptions}
        value={category}
        onChange={setCategory}
        allLabel="All Categories"
      />

      <div className="flex items-center justify-between pt-2 border-t border-ink/10">
        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft">
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-champagne animate-pulse" />
              Refining…
            </span>
          ) : (
            <span>
              <span className="font-serif-display text-bordeaux normal-case tracking-normal text-base mr-2">
                {totalCount}
              </span>
              {totalCount === 1 ? "Vendor" : "Vendors"} matching
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function setOrDelete(p: URLSearchParams, key: string, value: string) {
  const v = value.trim();
  if (v) p.set(key, v);
  else p.delete(key);
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-ink-soft shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
