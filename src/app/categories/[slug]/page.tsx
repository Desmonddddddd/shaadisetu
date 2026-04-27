"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { getCategoryById, categories } from "@/data/categories";
import type { Filter, Subcategory } from "@/data/categories";
import { notFound } from "next/navigation";

// Filter component
function FilterSection({ filters }: { filters: Filter[] }) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  if (filters.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </h3>
      <div className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.id}>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              {filter.label}
            </label>
            {filter.type === "select" && filter.options && (
              <select
                value={activeFilters[filter.id] || ""}
                onChange={(e) =>
                  setActiveFilters((prev) => ({ ...prev, [filter.id]: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm text-slate-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8"
              >
                <option value="">All</option>
                {filter.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
            {filter.type === "range" && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={`Min ${filter.min ?? ""}`}
                  className="flex-1 px-3 py-2 text-sm text-slate-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose"
                  min={filter.min}
                  max={filter.max}
                />
                <span className="text-slate-400 text-xs">to</span>
                <input
                  type="number"
                  placeholder={`Max ${filter.max ?? ""}`}
                  className="flex-1 px-3 py-2 text-sm text-slate-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose"
                  min={filter.min}
                  max={filter.max}
                />
              </div>
            )}
            {filter.type === "toggle" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-shaadi-rose rounded border-gray-300 focus:ring-shaadi-rose"
                />
                <span className="text-sm text-slate-600">{filter.label}</span>
              </label>
            )}
          </div>
        ))}
      </div>
      {Object.keys(activeFilters).some((k) => activeFilters[k]) && (
        <button
          onClick={() => setActiveFilters({})}
          className="mt-4 text-xs text-shaadi-red hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

// Subcategory card
function SubcategoryCard({ sub, categoryId, isPremium }: { sub: Subcategory; categoryId: string; isPremium: boolean }) {
  return (
    <div
      className={`group bg-white rounded-xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${
        isPremium ? "border-amber-200 hover:border-amber-300" : "border-gray-100 hover:border-shaadi-rose/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3
            className={`text-sm font-semibold ${
              isPremium ? "text-amber-800" : "text-slate-900"
            } group-hover:${isPremium ? "text-amber-600" : "text-shaadi-red"} transition-colors`}
          >
            {sub.name}
          </h3>
          {sub.group && (
            <span
              className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                sub.group === "Bride"
                  ? "bg-pink-50 text-pink-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {sub.group}
            </span>
          )}
          <p className="mt-2 text-xs text-slate-400">
            No vendors yet — Coming soon
          </p>
        </div>
        <div
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
            isPremium
              ? "bg-amber-50 group-hover:bg-amber-100"
              : "bg-gray-50 group-hover:bg-shaadi-light"
          }`}
        >
          <svg
            className={`w-4 h-4 ${
              isPremium ? "text-amber-400" : "text-slate-300"
            } group-hover:${isPremium ? "text-amber-600" : "text-shaadi-red"} transition-colors`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const category = getCategoryById(slug);

  if (!category) {
    notFound();
  }

  const isPremium = !!category.highlight;

  // Group subcategories by group field (for Essentials category)
  const hasGroups = category.subcategories.some((s) => s.group);
  const groupedSubs = useMemo(() => {
    if (!hasGroups) return null;
    const groups: Record<string, Subcategory[]> = {};
    for (const sub of category.subcategories) {
      const g = sub.group || "Other";
      if (!groups[g]) groups[g] = [];
      groups[g].push(sub);
    }
    return Object.entries(groups);
  }, [category.subcategories, hasGroups]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-shaadi-light via-white to-shaadi-warm-gray">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className={`absolute inset-0 ${
            isPremium
              ? "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600"
              : "bg-gradient-to-br from-shaadi-red via-shaadi-rose to-shaadi-pink"
          }`}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/categories" className="hover:text-white transition-colors">
              Categories
            </Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">{category.name}</span>
          </nav>

          <div className="flex items-start gap-4">
            <span className="text-4xl md:text-5xl">{category.emoji}</span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  {category.name}
                </h1>
                {isPremium && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white uppercase tracking-wider">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11.3 1.046A1 1 0 0 0 9.832.72l-1.9 3.585-3.95.575a1 1 0 0 0-.554 1.705l2.858 2.786-.675 3.932a1 1 0 0 0 1.45 1.054L10 12.766l3.54 1.86a1 1 0 0 0 1.45-1.054l-.676-3.932 2.859-2.786a1 1 0 0 0-.554-1.705l-3.95-.575-1.9-3.585a1 1 0 0 0-.17-.258z" />
                    </svg>
                    Premium
                  </span>
                )}
              </div>
              <p className="mt-2 text-base md:text-lg text-white/80 max-w-2xl">
                {category.description}
              </p>
              <div className="mt-3 flex items-center gap-4 text-sm text-white/60">
                <span>{category.subcategories.length} subcategories</span>
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <span>{category.filters.length} filters available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Premium banner for Last-Minute */}
        {isPremium && (
          <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-full flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">Premium Service</h3>
              <p className="mt-1 text-sm text-amber-700 leading-relaxed">
                Emergency vendors available on short notice. Premium pricing applies for urgent bookings. All vendors in this category are verified for quick response and reliability.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar — Filters */}
          <aside className="lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <FilterSection filters={category.filters} />

            {/* Related categories */}
            <div className="mt-6 bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Related Categories</h3>
              <div className="space-y-2">
                {categories
                  .filter((c) => c.id !== category.id)
                  .slice(0, 5)
                  .map((c) => (
                    <Link
                      key={c.id}
                      href={`/categories/${c.id}`}
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-shaadi-red transition-colors py-1"
                    >
                      <span className="text-base">{c.emoji}</span>
                      <span>{c.name}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>

          {/* Main — Subcategories */}
          <div className="flex-1 order-1 lg:order-2">
            {/* Grouped subcategories (e.g. Bride / Groom) */}
            {groupedSubs ? (
              <div className="space-y-8">
                {groupedSubs.map(([group, subs]) => (
                  <div key={group}>
                    <h2
                      className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                        group === "Bride"
                          ? "text-pink-600"
                          : group === "Groom"
                          ? "text-blue-600"
                          : "text-slate-900"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          group === "Bride"
                            ? "bg-pink-400"
                            : group === "Groom"
                            ? "bg-blue-400"
                            : "bg-slate-400"
                        }`}
                      />
                      {group}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {subs.map((sub) => (
                        <SubcategoryCard
                          key={sub.id}
                          sub={sub}
                          categoryId={category.id}
                          isPremium={isPremium}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Flat subcategory list */
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  {isPremium ? "Emergency Services" : "Subcategories"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.subcategories.map((sub) => (
                    <SubcategoryCard
                      key={sub.id}
                      sub={sub}
                      categoryId={category.id}
                      isPremium={isPremium}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div
              className={`mt-10 rounded-xl p-6 text-center ${
                isPremium
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
                  : "bg-gradient-to-r from-shaadi-light to-rose-50 border border-rose-100"
              }`}
            >
              <h3
                className={`text-base font-bold ${
                  isPremium ? "text-amber-900" : "text-slate-900"
                }`}
              >
                Are you a {category.name.toLowerCase()} vendor?
              </h3>
              <p
                className={`mt-1 text-sm ${
                  isPremium ? "text-amber-700" : "text-slate-500"
                }`}
              >
                Join ShaadiSetu and reach thousands of couples looking for your services.
              </p>
              <Link
                href="/signup/vendor"
                className={`mt-4 inline-block px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90 shadow-sm ${
                  isPremium
                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                    : "bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink"
                }`}
              >
                Register as Vendor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
