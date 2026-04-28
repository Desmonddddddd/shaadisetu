"use client";

import { useState } from "react";
import Link from "next/link";
import CitySearch from "./CitySearch";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-700 hover:text-shaadi-red transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-cream border-t border-ink/10 shadow-lg z-40 p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Select City</p>
            <CitySearch />
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-cream-soft rounded-lg transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/vendors"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-cream-soft rounded-lg transition-colors"
            >
              Vendors
            </Link>
            <Link
              href="/plan"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-cream-soft rounded-lg transition-colors"
            >
              Planning Tools
            </Link>
            <Link
              href="/functions"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-cream-soft rounded-lg transition-colors"
            >
              Functions
            </Link>
            <Link
              href="/wall"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-cream-soft rounded-lg transition-colors"
            >
              ShaadiWall
            </Link>
            <Link
              href="/finance"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-cream-soft rounded-lg transition-colors"
            >
              Finance
            </Link>
            <Link
              href="/client-diaries"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-cream-soft rounded-lg transition-colors"
            >
              Client Diaries
            </Link>
          </nav>
          <Link
            href="/membership"
            onClick={() => setIsOpen(false)}
            className="block w-full py-2.5 text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-bordeaux text-center border border-champagne hover:bg-champagne/15 transition-colors"
          >
            Become Pro
          </Link>
          <Link
            href="/account/signup"
            onClick={() => setIsOpen(false)}
            className="block w-full py-2.5 text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-cream text-center bg-ink hover:bg-bordeaux transition-colors"
          >
            Join
          </Link>
        </div>
      )}
    </div>
  );
}
