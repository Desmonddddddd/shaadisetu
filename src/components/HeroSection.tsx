"use client";

import { useState } from "react";
import { categories } from "@/data/categories";
import { useCity } from "@/context/CityContext";
import CitySearch from "./CitySearch";

export default function HeroSection() {
  const { selectedCity } = useCity();
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-shaadi-red via-shaadi-rose to-shaadi-pink" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Your Perfect Wedding,
            <br />
            <span className="text-yellow-100">One Click Away</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-rose-100 max-w-2xl mx-auto">
            Discover the best wedding vendors, venues, and services across India.
            {selectedCity && (
              <span className="block mt-1 font-semibold text-white">
                Showing results for {selectedCity.name}, {selectedCity.state}
              </span>
            )}
          </p>

          {/* Inline search bar */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 min-w-0">
                <CitySearch />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 text-sm text-slate-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
              <button className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red to-shaadi-rose hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap">
                Search Vendors
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/90">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">50,000+</p>
              <p className="text-sm text-rose-100">Verified Vendors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">500+</p>
              <p className="text-sm text-rose-100">Cities Covered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">1,00,000+</p>
              <p className="text-sm text-rose-100">Happy Couples</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
