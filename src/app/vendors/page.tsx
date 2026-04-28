import Link from "next/link";
import { categories } from "@/data/categories";
import { cities } from "@/data/cities";
import { sampleVendors } from "@/data/vendors";
import { cityToSlug } from "@/lib/slugs";

const HIGHLIGHT_CITIES = ["Mumbai", "New Delhi", "Jaipur", "Bangalore", "Lucknow", "Udaipur"];

export default function BrowseVendors() {
  const visibleCities = cities.filter((c) => HIGHLIGHT_CITIES.includes(c.name));

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Browse Vendors</h1>
        <p className="text-slate-600 mt-1">Pick a city and a category to start exploring.</p>
      </header>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Popular cities</h2>
        <div className="flex flex-wrap gap-2">
          {visibleCities.map((c) => (
            <Link
              key={c.name}
              href={`/vendors/${cityToSlug(c)}/${categories[0].id}`}
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
          {categories.map((cat) => {
            const count = sampleVendors.filter((v) => v.categoryId === cat.id).length;
            const firstCity = visibleCities[0] ?? cities[0];
            return (
              <Link
                key={cat.id}
                href={`/vendors/${cityToSlug(firstCity)}/${cat.id}`}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-shaadi-deep transition-colors block"
              >
                <div className="text-2xl">{cat.emoji}</div>
                <h3 className="font-medium text-slate-900 mt-1">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{count} vendors</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
