"use client";

import { useState, useMemo } from "react";
import { categories } from "@/data/categories";
import { cities } from "@/data/cities";
import { useCountUp } from "@/hooks/useCountUp";

export default function HeroSection() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [vendorRef, vendorCount] = useCountUp<HTMLDivElement>(50000, 2200, (n) => n.toLocaleString("en-IN") + "+");
  const [cityRef, cityCount] = useCountUp<HTMLDivElement>(500, 1800, (n) => n.toLocaleString("en-IN") + "+");
  const [coupleRef, coupleCount] = useCountUp<HTMLDivElement>(100000, 2500, (n) => n.toLocaleString("en-IN") + "+");

  const states = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    for (const city of cities) {
      if (!grouped[city.state]) grouped[city.state] = [];
      grouped[city.state].push(city.name);
    }
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=2400&q=80')",
        }}
      />
      {/* Editorial darkening */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/55 to-ink/85" />
      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-44">
        <div className="text-center">
          {/* Eyebrow */}
          <div className="hero-animate hero-delay-1 flex items-center justify-center gap-3 mb-8">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              India&apos;s Editorial Wedding Platform
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>

          {/* Heading — serif */}
          <h1 className="hero-animate hero-delay-2 font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-cream leading-[1.05]">
            Shaadi Ki Har Zaroorat,
            <br />
            <span className="italic text-champagne">Ek Hi Jagah.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-animate hero-delay-3 mt-8 text-base md:text-lg text-cream/80 max-w-xl mx-auto leading-relaxed font-light tracking-wide">
            A curated marketplace of India&apos;s finest wedding artisans, venues,
            and storytellers — assembled with intention.
          </p>

          {/* Search bar */}
          <div className="hero-animate hero-delay-4 mt-10 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2.5 flex flex-col sm:flex-row gap-2">
              {/* City */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="flex-1 px-4 py-3 text-sm text-slate-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shaadi-rose/50 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8"
              >
                <option value="">Select City</option>
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

              {/* Category — no emojis */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-4 py-3 text-sm text-slate-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shaadi-rose/50 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Search button */}
              <button className="btn-arrow px-8 py-3 text-[0.78rem] font-semibold tracking-[0.18em] uppercase text-cream rounded-xl bg-ink hover:bg-bordeaux transition-all whitespace-nowrap flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>

          {/* Stats with dividers — count-up animation */}
          <div className="hero-animate hero-delay-5 mt-16 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-cream/90">
            <div ref={vendorRef} className="text-center px-4">
              <p className="font-serif-display text-4xl md:text-5xl text-champagne tabular-nums">{vendorCount}</p>
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-cream/60 mt-2">Verified Vendors</p>
            </div>
            <span className="hidden md:block w-px h-10 bg-champagne/40" />
            <div ref={cityRef} className="text-center px-4">
              <p className="font-serif-display text-4xl md:text-5xl text-champagne tabular-nums">{cityCount}</p>
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-cream/60 mt-2">Cities Covered</p>
            </div>
            <span className="hidden md:block w-px h-10 bg-champagne/40" />
            <div ref={coupleRef} className="text-center px-4">
              <p className="font-serif-display text-4xl md:text-5xl text-champagne tabular-nums">{coupleCount}</p>
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-cream/60 mt-2">Happy Couples</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
