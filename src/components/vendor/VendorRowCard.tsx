"use client";
import Link from "next/link";
import type { Vendor } from "@/types/vendor";
import { useCompare } from "@/context/CompareContext";
import { SaveButton } from "@/components/account/SaveButton";

interface Props {
  vendor: Vendor;
  isAuthed?: boolean;
  initialSaved?: boolean;
}

export function VendorRowCard({ vendor, isAuthed = false, initialSaved = false }: Props) {
  const { has, add, remove } = useCompare();
  const inCompare = has(vendor.id);

  return (
    <article className="editorial-card grid grid-cols-[110px_1fr_auto] gap-5 p-5">
      <Link href={`/vendors/v/${vendor.id}`} className="block">
        {vendor.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vendor.coverImage}
            alt={vendor.name}
            className="w-[110px] h-[110px] object-cover"
          />
        ) : (
          <div
            className="w-[110px] h-[110px] bg-gradient-to-br from-cream-soft to-blush"
            aria-hidden
          />
        )}
      </Link>

      <div className="min-w-0 flex flex-col justify-center">
        <Link href={`/vendors/v/${vendor.id}`}>
          <h3 className="font-serif-display text-xl text-ink hover:text-bordeaux transition-colors truncate">
            {vendor.name}
          </h3>
        </Link>
        <span className="block w-6 h-px bg-champagne my-2" />
        <p className="text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft/70 truncate">
          {vendor.tags.join(" · ")}
        </p>
        <p className="text-sm text-ink-soft mt-2 flex items-center gap-3">
          <span className="text-bordeaux">★ {vendor.rating}</span>
          <span className="text-ink-soft/30">|</span>
          <span>{vendor.reviewCount} reviews</span>
          <span className="text-ink-soft/30">|</span>
          <span className="font-medium">{vendor.priceRange}</span>
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <SaveButton
          vendorId={vendor.id}
          initialSaved={initialSaved}
          isAuthed={isAuthed}
          variant="icon"
        />
        <button
          type="button"
          onClick={() => (inCompare ? remove(vendor.id) : add({ id: vendor.id, name: vendor.name }))}
          aria-pressed={inCompare}
          className={`text-[0.65rem] uppercase tracking-[0.18em] px-3 py-1.5 border transition-colors ${
            inCompare
              ? "bg-ink text-cream border-ink"
              : "border-ink/20 text-ink-soft hover:border-bordeaux hover:text-bordeaux"
          }`}
        >
          {inCompare ? "✓ Compare" : "Compare"}
        </button>
      </div>
    </article>
  );
}
