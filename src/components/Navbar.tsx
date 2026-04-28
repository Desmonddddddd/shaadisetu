"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 border-b border-ink/10 shadow-[0_1px_0_0_rgba(201,168,106,0.4)]"
          : "bg-cream/80 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mr-auto group">
            <span className="font-serif-display text-3xl tracking-tight text-ink">
              Shaadi<span className="text-bordeaux">Setu</span>
            </span>
            <span className="block h-px w-0 group-hover:w-full bg-champagne transition-all duration-500" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "About", href: "/about" },
              { label: "Vendors", href: "/vendors" },
              { label: "Planning", href: "/plan" },
              { label: "Functions", href: "/functions" },
              { label: "Diaries", href: "/client-diaries" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="editorial-link text-[0.78rem] font-medium tracking-[0.18em] uppercase text-ink-soft hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-4 ml-auto pl-8">
            <Link
              href="/membership"
              className="text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-bordeaux hover:text-ink transition-colors"
            >
              Pro
            </Link>
            <span className="block w-px h-5 bg-ink/15" />
            <Link
              href="/account/signup"
              aria-label="Sign in"
              className="w-9 h-9 flex items-center justify-center bg-ink text-cream hover:bg-bordeaux transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.93 17.93 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </Link>
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
