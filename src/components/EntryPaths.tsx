"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const paths = [
  {
    number: "01",
    title: "Browse by Category",
    subtitle: "Explore 18 categories of wedding vendors",
    description: "Venues, decor, catering, photography, and everything in between.",
    href: "/categories",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    accent: "from-shaadi-red to-shaadi-rose",
    iconBg: "bg-rose-50",
    iconColor: "text-shaadi-red",
  },
  {
    number: "02",
    title: "Plan My Wedding",
    subtitle: "Get a personalized wedding checklist",
    description: "Select your date and city, get a step-by-step plan with matched vendors.",
    href: "/plan",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    accent: "from-violet-500 to-purple-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    number: "03",
    title: "Browse by Function",
    subtitle: "Find everything for each wedding event",
    description: "Haldi, Mehendi, Sangeet, Wedding Day — all vendors for each function.",
    href: "/functions",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    accent: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function EntryPaths() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-shaadi-rose mb-3">
            Get Started
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-cormorant)] text-slate-900">
            How Would You Like to{" "}
            <span className="bg-gradient-to-r from-shaadi-red to-shaadi-rose bg-clip-text text-transparent">
              Start?
            </span>
          </h2>
          <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto">
            Three ways to find the perfect wedding vendors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paths.map((path, i) => (
            <Link
              key={path.href}
              href={path.href}
              className="scroll-reveal group relative bg-white rounded-2xl border border-gray-100 p-7 card-hover overflow-hidden"
              data-delay={i * 120}
            >
              {/* Watermark number */}
              <span className="absolute top-4 right-5 text-7xl font-bold font-[family-name:var(--font-cormorant)] text-gray-50 select-none group-hover:text-gray-100 transition-colors">
                {path.number}
              </span>

              {/* Top accent line */}
              <div
                className={`absolute top-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${path.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Icon */}
              <div
                className={`relative w-12 h-12 rounded-xl ${path.iconBg} ${path.iconColor} flex items-center justify-center mb-5`}
              >
                {path.icon}
              </div>

              {/* Content */}
              <h3 className="relative text-lg font-bold text-slate-900 group-hover:text-shaadi-red transition-colors">
                {path.title}
              </h3>
              <p className="relative mt-1 text-xs font-medium text-slate-400 uppercase tracking-wide">
                {path.subtitle}
              </p>
              <p className="relative mt-3 text-sm text-slate-500 leading-relaxed">
                {path.description}
              </p>

              {/* Arrow */}
              <div className="relative mt-5 flex items-center gap-1.5 text-sm font-semibold text-shaadi-red opacity-0 group-hover:opacity-100 transition-all duration-300">
                Explore
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
