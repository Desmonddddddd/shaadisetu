"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FadeOnScroll } from "@/components/editorial/FadeOnScroll";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";
import { SectionDivider } from "@/components/editorial/SectionDivider";

interface Item {
  id: string;
  name: string;
  emoji: string;
  description: string;
  highlight: string | null;
  subcategoryCount: number;
  filterCount: number;
  cover: string;
}

interface Props {
  items: Item[];
  totalCategories: number;
  totalSubcategories: number;
  totalFilters: number;
}

const FILTERS = [
  { id: "all",       label: "All" },
  { id: "featured",  label: "Featured" },
  { id: "essentials", label: "Big-ticket" },
  { id: "sundry",    label: "Sundry" },
];

// Curated buckets for the chip filter — broad strokes, not exhaustive.
const ESSENTIALS = new Set([
  "venues", "decor", "catering", "photography",
  "entertainment", "essentials", "beauty", "rituals",
]);
const SUNDRY = new Set([
  "logistics", "gifts", "rentals", "guests",
  "legal", "last-minute", "digital", "pre-wedding", "honeymoon",
]);

export function CategoriesGallery({
  items,
  totalCategories,
  totalSubcategories,
  totalFilters,
}: Props) {
  const [search, setSearch] = useState("");
  const [bucket, setBucket] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((c) => {
      if (bucket === "featured" && !c.highlight) return false;
      if (bucket === "essentials" && !ESSENTIALS.has(c.id)) return false;
      if (bucket === "sundry" && !SUNDRY.has(c.id)) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [items, search, bucket]);

  return (
    <>
      {/* CONTROLS */}
      <section className="border-b border-ink/10 bg-cream-soft">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
            <div className="flex-1">
              <p className="eyebrow"><span className="eyebrow-num">01</span>Search</p>
              <div className="mt-3 relative">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M21 21l-6-6" strokeLinecap="round" />
                  <circle cx="10" cy="10" r="7" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search venues, decor, mehendi…"
                  className="editorial-input w-full pl-11"
                />
              </div>
            </div>

            <div>
              <p className="eyebrow"><span className="eyebrow-num">02</span>Filter</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setBucket(f.id)}
                    className="filter-pill"
                    data-active={bucket === f.id ? "true" : "false"}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live count */}
          <p className="mt-6 text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft">
            {filtered.length} of {items.length} categories shown
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20 fade-in">
              <p className="font-serif-display text-3xl text-ink">
                Nothing matches that.
              </p>
              <span className="block w-12 h-px bg-champagne mx-auto mt-4" />
              <p className="text-sm text-ink-soft mt-4 font-light">
                Try a different search term, or clear the filter.
              </p>
              <button
                onClick={() => { setSearch(""); setBucket("all"); }}
                className="mt-6 text-[0.7rem] uppercase tracking-[0.22em] text-bordeaux editorial-link"
              >
                Reset
              </button>
            </div>
          ) : (
            <div
              key={`${bucket}-${search}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((cat, i) => (
                <FadeOnScroll key={cat.id} delay={(i % 9) * 60} fadeOut={false} visibleOnLoad={i < 6}>
                  <CategoryTile cat={cat} index={i + 1} />
                </FadeOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STAT STRIP */}
      <section className="border-t border-ink/10 bg-cream-soft py-14">
        <div className="max-w-5xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center">
              <p className="eyebrow"><span className="eyebrow-num">03</span>The full picture</p>
              <SectionDivider className="mt-4" />
            </div>
            <div className="mt-10 grid grid-cols-3 gap-px bg-champagne/30 border border-ink/8">
              <StatCell value={String(totalCategories)} label="Master categories" />
              <StatCell value={String(totalSubcategories)} label="Subcategories" />
              <StatCell value={String(totalFilters)} label="Refinement filters" />
            </div>
            <p className="mt-8 text-center text-sm text-ink-soft font-light leading-relaxed max-w-md mx-auto">
              Or skip the index entirely — open the directory and start browsing.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link href="/vendors" className="btn-editorial">
                Open Directory
              </Link>
              <Link href="/plan-with-me" className="btn-editorial-ghost">
                Or Plan With Me
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}

function CategoryTile({ cat, index }: { cat: Item; index: number }) {
  return (
    <Link href={`/categories/${cat.id}`} className="group block h-full">
      <article className="editorial-card h-full overflow-hidden flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            decoding="async"
            src={cat.cover}
            alt={cat.name}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
          <span className="absolute top-3 left-4 font-serif-display text-3xl text-cream/95 leading-none drop-shadow-md">
            {String(index).padStart(2, "0")}
          </span>
          <span className="absolute top-4 right-4 text-2xl drop-shadow-sm">{cat.emoji}</span>
          {cat.highlight && (
            <span className="absolute bottom-4 left-4 text-[0.6rem] uppercase tracking-[0.22em] px-2 py-1 bg-champagne text-ink">
              ★ {cat.highlight}
            </span>
          )}
        </div>

        <div className="p-6 flex flex-col gap-3 flex-1">
          <h3 className="font-serif-display text-xl md:text-2xl text-ink leading-snug group-hover:text-bordeaux transition-colors">
            {cat.name}
          </h3>
          <span className="block w-8 h-px bg-champagne transition-all duration-500 group-hover:w-16" />
          <p className="text-sm text-ink-soft leading-relaxed font-light flex-1">
            {cat.description}
          </p>
          <div className="pt-3 mt-auto border-t border-ink/8 flex items-center justify-between">
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft">
              {cat.subcategoryCount} subcategories
              {cat.filterCount > 0 && ` · ${cat.filterCount} filters`}
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.22em] text-bordeaux editorial-link">
              View →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-cream px-6 py-8 text-center">
      <p className="font-serif-display text-4xl md:text-5xl text-bordeaux">
        {value}
      </p>
      <span className="block w-8 h-px bg-champagne mx-auto my-3" />
      <p className="text-[0.6rem] uppercase tracking-[0.24em] text-ink-soft">
        {label}
      </p>
    </div>
  );
}
