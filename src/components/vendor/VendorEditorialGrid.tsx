"use client";

import Link from "next/link";
import type { Vendor } from "@/types/vendor";
import { useCompare } from "@/context/CompareContext";

interface Props {
  vendors: Vendor[];
  isAuthed?: boolean;
  savedVendorIds?: string[];
}

/**
 * Editorial grid for /vendors — staggered fade-up entrance, hover lift,
 * gold underline on title hover. The classic VendorRowCard remains the
 * canonical card used elsewhere; this is the magazine-style variant.
 */
export function VendorEditorialGrid({
  vendors,
}: Props) {
  if (vendors.length === 0) {
    return (
      <div className="py-20 text-center fade-in">
        <p className="font-serif-display text-3xl text-ink mb-3">
          No vendors yet.
        </p>
        <span className="block w-12 h-px bg-champagne mx-auto" />
        <p className="text-sm text-ink-soft mt-4 font-light">
          Loosen a filter, or try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {vendors.map((v, i) => (
        <VendorEditorialCard key={v.id} vendor={v} index={i} />
      ))}
    </div>
  );
}

function VendorEditorialCard({ vendor, index }: { vendor: Vendor; index: number }) {
  const { has, add, remove } = useCompare();
  const inCompare = has(vendor.id);
  const stagger = `stagger-${Math.min((index % 8) + 1, 8)}`;

  return (
    <article className={`editorial-card group fade-up ${stagger} flex flex-col`}>
      <Link href={`/vendors/v/${vendor.id}`} className="block relative overflow-hidden aspect-[16/9]">
        {vendor.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vendor.coverImage}
            alt={vendor.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cream-soft via-blush to-cream" aria-hidden />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {vendor.verified && (
            <span className="text-[0.6rem] uppercase tracking-[0.2em] px-2 py-1 bg-cream/95 text-bordeaux">
              Verified
            </span>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/vendors/v/${vendor.id}`} className="min-w-0 flex-1">
            <h3 className="font-serif-display text-2xl text-ink leading-tight transition-colors group-hover:text-bordeaux">
              {vendor.name}
            </h3>
          </Link>
          <span className="text-[0.7rem] uppercase tracking-[0.18em] text-bordeaux shrink-0 pt-1">
            ★ {vendor.rating.toFixed(1)}
          </span>
        </div>

        <span className="block w-8 h-px bg-champagne transition-all duration-500 group-hover:w-16" />

        <p className="text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft/70 truncate">
          {vendor.tags.slice(0, 4).join(" · ")}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-ink/8">
          <div className="text-xs text-ink-soft">
            <span>{vendor.reviewCount} reviews</span>
            <span className="text-ink/20 mx-2">|</span>
            <span className="font-medium text-ink">{vendor.priceRange}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (inCompare) remove(vendor.id);
              else add({ id: vendor.id, name: vendor.name });
            }}
            aria-pressed={inCompare}
            className={`text-[0.62rem] uppercase tracking-[0.2em] px-2.5 py-1 border transition-all ${
              inCompare
                ? "bg-ink text-cream border-ink"
                : "border-ink/15 text-ink-soft hover:border-bordeaux hover:text-bordeaux"
            }`}
          >
            {inCompare ? "✓" : "+"} Compare
          </button>
        </div>
      </div>
    </article>
  );
}
