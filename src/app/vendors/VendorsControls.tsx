"use client";

import { useEffect, useState, useTransition, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchSelect } from "@/components/editorial/SearchSelect";

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
    <div className="fade-up stagger-1">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0 border-b lg:border-b-0 lg:border-r border-ink/10 pb-3 lg:pb-0 lg:pr-4">
          <SearchIcon />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search photographers, decor, venues, names…"
            className="editorial-input flex-1 min-w-0"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 lg:flex lg:items-center lg:gap-3 lg:shrink-0">
          <SearchSelect
            label="City"
            placeholder="All cities"
            options={cityOptions}
            value={city}
            onChange={setCity}
            allLabel="All Cities"
          />
          <SearchSelect
            label="Category"
            placeholder="All categories"
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            allLabel="All Categories"
          />
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCity("");
              setCategory("");
            }}
            className="text-[0.65rem] uppercase tracking-[0.2em] text-bordeaux hover:text-ink transition-colors lg:shrink-0 self-start lg:self-center"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {isPending ? (
          <span className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft">
            <span className="w-1 h-1 rounded-full bg-champagne animate-pulse" />
            Refining…
          </span>
        ) : (
          <span className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft inline-flex items-baseline gap-2">
            <span className="font-serif-display text-bordeaux normal-case tracking-normal text-base">
              {totalCount}
            </span>
            {totalCount === 1 ? "Vendor" : "Vendors"} matching
          </span>
        )}
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
