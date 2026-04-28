import Link from "next/link";
import { getUserSessionOrRedirect } from "@/lib/auth/session";
import { getSavedVendors } from "@/lib/queries/saved";

export const dynamic = "force-dynamic";

export default async function SavedVendorsPage() {
  const { userId } = await getUserSessionOrRedirect();
  const items = await getSavedVendors(userId);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 mb-4">Saved vendors</h1>
      {items.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center">
          <p className="text-slate-600 mb-3">You haven&apos;t saved any vendors yet.</p>
          <Link href="/vendors" className="text-shaadi-deep underline text-sm">
            Browse vendors
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map(({ vendor, savedAt }) => (
            <li
              key={vendor.id}
              className="border border-gray-100 rounded-lg p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/vendors/v/${vendor.id}`}
                  className="font-medium text-slate-900 hover:text-shaadi-deep"
                >
                  {vendor.name}
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">
                  {vendor.category.name} · {vendor.city.name}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Saved {new Date(savedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right text-sm shrink-0">
                <span className="text-slate-700">★ {vendor.rating.toFixed(1)}</span>
                <p className="text-xs text-slate-500">{vendor.priceRange}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
