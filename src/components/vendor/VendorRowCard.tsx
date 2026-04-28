"use client";
import Link from "next/link";
import type { Vendor } from "@/data/vendors";
import { useCompare } from "@/context/CompareContext";
import { isBooked } from "@/data/availability";

interface Props {
  vendor: Vendor;
  filterDate?: string;
}

export function VendorRowCard({ vendor, filterDate }: Props) {
  const { has, add, remove } = useCompare();
  const inCompare = has(vendor.id);
  const booked = filterDate ? isBooked(vendor.id, filterDate) : false;

  return (
    <article className="grid grid-cols-[80px_1fr_auto] gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <Link href={`/vendors/v/${vendor.id}`} className="block">
        <div
          className="w-20 h-20 rounded-lg bg-gradient-to-br from-shaadi-light to-shaadi-rose"
          aria-hidden
        />
      </Link>

      <div className="min-w-0">
        <Link href={`/vendors/v/${vendor.id}`} className="hover:underline">
          <h3 className="font-semibold text-slate-900 truncate">{vendor.name}</h3>
        </Link>
        <p className="text-xs text-slate-500 truncate">{vendor.tags.join(" · ")}</p>
        <p className="text-sm text-shaadi-deep mt-1">
          <span>⭐ {vendor.rating} ({vendor.reviewCount})</span>
          <span> · </span>
          <span>{vendor.priceRange}</span>
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className={`text-xs ${booked ? "text-red-600" : "text-emerald-600"}`}>
          ● {booked ? "Booked" : "Available"}
        </span>
        <button
          type="button"
          onClick={() => (inCompare ? remove(vendor.id) : add(vendor.id))}
          aria-pressed={inCompare}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            inCompare
              ? "bg-shaadi-deep text-white border-shaadi-deep"
              : "border-gray-300 text-slate-700 hover:border-shaadi-deep hover:text-shaadi-deep"
          }`}
        >
          {inCompare ? "✓ Comparing" : "+ Compare"}
        </button>
      </div>
    </article>
  );
}
