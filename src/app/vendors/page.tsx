import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { getCategoryVendorCounts } from "@/lib/queries/vendors";
import { SearchBar } from "@/components/search/SearchBar";

const HIGHLIGHT_CITIES = ["Mumbai", "New Delhi", "Jaipur", "Bangalore", "Lucknow", "Udaipur"];

export default async function BrowseVendors() {
  const [categories, cities, counts] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.city.findMany({ where: { name: { in: HIGHLIGHT_CITIES } } }),
    getCategoryVendorCounts(),
  ]);

  const firstCategory = categories[0];
  const firstCity = cities[0];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Browse Vendors</h1>
        <p className="text-slate-600">Pick a city and category, or search across all vendors.</p>
        <Suspense fallback={<div className="h-12" />}>
          <SearchBar initialQuery="" />
        </Suspense>
      </header>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Popular cities</h2>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <Link
              key={c.id}
              href={`/vendors/${c.slug}/${firstCategory?.id ?? ""}`}
              className="px-4 py-1.5 rounded-full bg-shaadi-light text-shaadi-deep text-sm hover:bg-shaadi-rose hover:text-white transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">All categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/vendors/${firstCity?.slug ?? ""}/${cat.id}`}
              className="p-4 bg-white border border-gray-200 rounded-xl hover:border-shaadi-deep transition-colors block"
            >
              <div className="text-2xl">{cat.emoji}</div>
              <h3 className="font-medium text-slate-900 mt-1">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{counts[cat.id] ?? 0} vendors</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
