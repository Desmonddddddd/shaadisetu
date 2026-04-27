"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { categories } from "@/data/categories";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.subcategories.some((sub) => sub.name.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-shaadi-light via-white to-shaadi-warm-gray">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-shaadi-red via-shaadi-rose to-shaadi-pink" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Browse Categories
          </h1>
          <p className="mt-3 text-rose-100 text-base md:text-lg max-w-xl mx-auto">
            18 master categories covering every aspect of your dream wedding.
            Find the perfect vendors for each need.
          </p>

          {/* Search bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm text-slate-700 bg-white/95 backdrop-blur-sm rounded-xl border-0 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-slate-500">
              No categories match &ldquo;{search}&rdquo;
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-sm text-shaadi-red hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className={`group relative bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                  cat.highlight
                    ? "border-amber-300 ring-1 ring-amber-200"
                    : "border-gray-100"
                }`}
              >
                {/* Premium badge */}
                {cat.highlight && (
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold text-center py-1 uppercase tracking-wider flex items-center justify-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M11.3 1.046A1 1 0 0 0 9.832.72l-1.9 3.585-3.95.575a1 1 0 0 0-.554 1.705l2.858 2.786-.675 3.932a1 1 0 0 0 1.45 1.054L10 12.766l3.54 1.86a1 1 0 0 0 1.45-1.054l-.676-3.932 2.859-2.786a1 1 0 0 0-.554-1.705l-3.95-.575-1.9-3.585a1 1 0 0 0-.17-.258z" />
                    </svg>
                    {cat.highlight}
                  </div>
                )}

                <div className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-shaadi-red transition-colors">
                        {cat.name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                        {cat.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded-full">
                          {cat.subcategories.length} subcategories
                        </span>
                        {cat.filters.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded-full">
                            {cat.filters.length} filters
                          </span>
                        )}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-300 group-hover:text-shaadi-red transition-colors flex-shrink-0 mt-1"
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
              </Link>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 md:gap-10 text-sm text-slate-500 bg-white rounded-xl border border-gray-100 px-6 py-4 shadow-sm">
            <div>
              <span className="block text-2xl font-bold text-slate-900">18</span>
              Categories
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <span className="block text-2xl font-bold text-slate-900">
                {categories.reduce((sum, c) => sum + c.subcategories.length, 0)}
              </span>
              Subcategories
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <span className="block text-2xl font-bold text-shaadi-red">50,000+</span>
              Vendors
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
