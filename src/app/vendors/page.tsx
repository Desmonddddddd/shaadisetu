"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { categories, getCategoryById } from "@/data/categories";
import { cities } from "@/data/cities";
import { sampleVendors } from "@/data/vendors";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating);
        const half = !filled && star - 0.5 <= rating;
        return (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${filled || half ? "text-amber-400" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

// Group cities by state
function useGroupedCities() {
  return useMemo(() => {
    const grouped: Record<string, string[]> = {};
    for (const city of cities) {
      if (!grouped[city.state]) grouped[city.state] = [];
      if (!grouped[city.state].includes(city.name)) {
        grouped[city.state].push(city.name);
      }
    }
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, []);
}

export default function VendorsPage() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "experience">("rating");
  const states = useGroupedCities();

  const filtered = useMemo(() => {
    let results = [...sampleVendors];

    if (selectedCity) {
      results = results.filter((v) => v.city === selectedCity);
    }
    if (selectedCategory) {
      results = results.filter((v) => v.categoryId === selectedCategory);
    }

    // Sort
    if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "reviews") {
      results.sort((a, b) => b.reviewCount - a.reviewCount);
    } else {
      results.sort((a, b) => b.yearsExperience - a.yearsExperience);
    }

    return results;
  }, [selectedCity, selectedCategory, sortBy]);

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
        <div className="relative max-w-4xl mx-auto px-4 py-14 md:py-18 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Find Wedding Vendors
          </h1>
          <p className="mt-3 text-rose-100 text-base md:text-lg max-w-xl mx-auto">
            Browse verified vendors across 18 categories and 500+ cities.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Filters bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* City dropdown */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-slate-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8"
              >
                <option value="">All Cities</option>
                {states.map(([state, cityNames]) => (
                  <optgroup key={state} label={state}>
                    {cityNames.sort().map((name) => (
                      <option key={`${name}-${state}`} value={name}>
                        {name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Category dropdown */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-slate-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="sm:w-48">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "reviews" | "experience")}
                className="w-full px-4 py-2.5 text-sm text-slate-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>
          </div>

          {/* Active filters */}
          {(selectedCity || selectedCategory) && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400">Showing:</span>
              {selectedCity && (
                <span className="inline-flex items-center gap-1 text-xs bg-shaadi-light text-shaadi-red px-2.5 py-1 rounded-full font-medium">
                  {selectedCity}
                  <button onClick={() => setSelectedCity("")} className="hover:text-shaadi-rose">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 text-xs bg-shaadi-light text-shaadi-red px-2.5 py-1 rounded-full font-medium">
                  {getCategoryById(selectedCategory)?.emoji}{" "}
                  {getCategoryById(selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory("")} className="hover:text-shaadi-rose">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              <button
                onClick={() => { setSelectedCity(""); setSelectedCategory(""); }}
                className="text-xs text-slate-400 hover:text-shaadi-red ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{filtered.length}</span> vendors found
          </p>
        </div>

        {/* Vendor cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <svg className="w-12 h-12 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg font-semibold text-slate-700">No vendors found</p>
            <p className="text-sm text-slate-400 mt-1">Try changing your city or category filters</p>
            <button
              onClick={() => { setSelectedCity(""); setSelectedCategory(""); }}
              className="mt-4 text-sm text-shaadi-red font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((vendor) => {
              const cat = getCategoryById(vendor.categoryId);
              return (
                <div
                  key={vendor.id}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                    vendor.categoryId === "last-minute"
                      ? "border-amber-200"
                      : "border-gray-100"
                  }`}
                >
                  {/* Premium badge */}
                  {vendor.categoryId === "last-minute" && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold text-center py-1 uppercase tracking-wider">
                      Premium Vendor
                    </div>
                  )}

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 truncate">
                            {vendor.name}
                          </h3>
                          {vendor.verified && (
                            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        {cat && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            {cat.emoji} {cat.name}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-shaadi-red bg-shaadi-light px-2.5 py-1 rounded-lg flex-shrink-0">
                        {vendor.priceRange}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <StarRating rating={vendor.rating} />
                      <span className="text-sm font-bold text-slate-800">
                        {vendor.rating}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({vendor.reviewCount} reviews)
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">
                      {vendor.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {vendor.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {vendor.yearsExperience} yrs exp
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {vendor.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] text-slate-500 bg-gray-50 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                      <button className="flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red to-shaadi-rose hover:opacity-90 transition-opacity">
                        Send Enquiry
                      </button>
                      <button className="px-3 py-2 text-sm font-medium text-slate-500 border border-gray-200 rounded-lg hover:border-shaadi-rose hover:text-shaadi-red transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Register CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-shaadi-light to-rose-50 border border-rose-100 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900">
              Are you a wedding vendor?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Join ShaadiSetu and reach thousands of couples looking for your services.
            </p>
            <Link
              href="/signup/vendor"
              className="mt-5 inline-block px-6 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink hover:opacity-90 transition-opacity shadow-sm"
            >
              Register as Vendor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
