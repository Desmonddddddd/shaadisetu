import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { searchVendors, getDistinctPriceRanges } from "@/lib/queries/search";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFacets } from "@/components/search/SearchFacets";
import { VendorListingResults } from "@/components/vendor/VendorListingResults";

interface SearchParams {
  q?: string;
  city?: string;
  category?: string;
  rating?: string;
  price?: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const minRating = sp.rating ? Number(sp.rating) : undefined;

  const [vendors, cities, categories, priceRanges] = await Promise.all([
    searchVendors({
      q: sp.q,
      cityId: sp.city,
      categoryId: sp.category,
      minRating: Number.isFinite(minRating) ? minRating : undefined,
      priceRange: sp.price,
    }),
    db.city.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, state: true } }),
    db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    getDistinctPriceRanges(),
  ]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900">
          {sp.q ? `Results for "${sp.q}"` : "All vendors"}
        </h1>
        <Suspense fallback={<div className="h-12" />}>
          <SearchBar initialQuery={sp.q ?? ""} />
        </Suspense>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <Suspense fallback={<aside className="h-40" />}>
          <SearchFacets
            cities={cities}
            categories={categories}
            priceRanges={priceRanges}
            current={{ city: sp.city, category: sp.category, rating: sp.rating, price: sp.price }}
          />
        </Suspense>
        <div>
          <p className="text-sm text-slate-600 mb-3">{vendors.length} matching</p>
          {vendors.length === 0 ? (
            <div className="py-12 text-center text-slate-600">
              No vendors match. Try a different search or{" "}
              <Link href="/search" className="text-shaadi-deep underline">
                clear filters
              </Link>
              .
            </div>
          ) : (
            <VendorListingResults vendors={vendors} />
          )}
        </div>
      </div>
    </main>
  );
}
