import Link from "next/link";
import type { VendorCredit } from "@/lib/stories-data";

export function VendorCredits({ credits }: { credits: VendorCredit[] }) {
  if (!credits.length) return null;
  return (
    <div className="bg-cream-soft border border-ink/10 p-6 md:p-8">
      <p className="text-[0.62rem] uppercase tracking-[0.24em] text-bordeaux mb-4">
        Vendor Credits
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        {credits.map((c, i) => (
          <li
            key={`${c.role}-${i}`}
            className="flex items-baseline justify-between gap-3 border-b border-ink/8 pb-2 text-sm"
          >
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft shrink-0">
              {c.role}
            </span>
            {c.vendorId ? (
              <Link
                href={`/vendors/v/${c.vendorId}`}
                className="text-ink hover:text-bordeaux transition-colors text-right"
              >
                {c.vendorName} →
              </Link>
            ) : (
              <span className="text-ink text-right">{c.vendorName}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
