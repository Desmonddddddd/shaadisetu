"use client";

import Link from "next/link";
import type { Vendor } from "@/types/vendor";
import { useCompare } from "@/context/CompareContext";

interface Props {
  vendors: Vendor[];
  isAuthed?: boolean;
  savedVendorIds?: string[];
}

export function VendorEditorialGrid({ vendors }: Props) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
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
    <article
      className={`vendor-card group fade-up ${stagger} bg-cream border border-ink/8 flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-18px_rgba(0,0,0,0.25)] hover:border-ink/15`}
    >
      <Link
        href={`/vendors/v/${vendor.id}`}
        className="block relative overflow-hidden aspect-[4/3]"
      >
        {vendor.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            loading="lazy"
            decoding="async"
            src={vendor.coverImage}
            alt={vendor.name}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div
            className="w-full h-full bg-gradient-to-br from-cream-soft via-blush to-cream"
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {vendor.verified && (
          <span className="absolute top-2.5 left-2.5 text-[0.55rem] uppercase tracking-[0.2em] px-2 py-0.5 bg-cream/95 text-bordeaux">
            Verified
          </span>
        )}
        <span className="absolute top-2.5 right-2.5 text-[0.6rem] tracking-[0.1em] px-2 py-0.5 bg-ink/85 text-cream backdrop-blur-sm">
          ★ {vendor.rating.toFixed(1)}
        </span>
      </Link>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link href={`/vendors/v/${vendor.id}`} className="min-w-0">
          <h3 className="font-serif-display text-lg text-ink leading-tight transition-colors group-hover:text-bordeaux line-clamp-1">
            {vendor.name}
          </h3>
        </Link>

        <span className="block w-6 h-px bg-champagne transition-all duration-500 group-hover:w-12" />

        <p className="text-[0.62rem] uppercase tracking-[0.16em] text-ink-soft/70 line-clamp-1">
          {vendor.tags.slice(0, 3).join(" · ")}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-ink/8">
          <div className="text-[0.7rem] text-ink-soft min-w-0">
            <span className="font-medium text-ink">{vendor.priceRange}</span>
            <span className="text-ink/20 mx-1.5">·</span>
            <span>{vendor.reviewCount} reviews</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (inCompare) remove(vendor.id);
              else add({ id: vendor.id, name: vendor.name });
            }}
            aria-pressed={inCompare}
            aria-label={inCompare ? "Remove from compare" : "Add to compare"}
            className={`text-[0.6rem] uppercase tracking-[0.18em] px-2 py-1 border transition-all shrink-0 ml-2 ${
              inCompare
                ? "bg-ink text-cream border-ink"
                : "border-ink/15 text-ink-soft hover:border-bordeaux hover:text-bordeaux"
            }`}
          >
            {inCompare ? "✓" : "+"}
          </button>
        </div>
      </div>
    </article>
  );
}
