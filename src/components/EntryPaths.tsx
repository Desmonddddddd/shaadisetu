"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Path {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cover: string;
}

const paths: Path[] = [
  {
    number: "01",
    eyebrow: "By Category",
    title: "Browse all categories",
    description:
      "Eighteen categories of hand-vetted vendors. Filter by city, search by name, save the ones you love.",
    href: "/categories",
    cover:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
  },
  {
    number: "02",
    eyebrow: "Plan With Me",
    title: "Three minutes with a planner",
    description:
      "Six honest questions. A curated plan in return — vendor names, rupee allocations, ceremony-by-ceremony picks.",
    href: "/plan-with-me",
    cover:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&q=80",
  },
  {
    number: "03",
    eyebrow: "By Event & Budget",
    title: "Curated by ceremony",
    description:
      "Pick a budget bracket or a specific function — haldi, mehendi, sangeet — and see the right vendors for it.",
    href: "/functions",
    cover:
      "https://images.unsplash.com/photo-1525772764200-be829a350797?w=1600&q=80",
  },
  {
    number: "04",
    eyebrow: "Kundli & Muhurat",
    title: "Match the stars",
    description:
      "Vedic Guna Milan compatibility and curated auspicious dates from the Panchang — traditionally computed, explained in plain English.",
    href: "/muhurat",
    cover:
      "https://images.unsplash.com/photo-1532009877282-3340270e0529?w=1600&q=80",
  },
];

export default function EntryPaths() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-14 scroll-reveal">
          <p className="eyebrow">
            <span className="eyebrow-num">01</span>Four Doors In
          </p>
          <h2 className="font-serif-display text-4xl md:text-5xl text-ink mt-4 leading-tight">
            How would you like to <em className="italic text-bordeaux">begin?</em>
          </h2>
          <div className="gold-rule w-32 mx-auto mt-6" />
          <p className="mt-6 text-ink-soft text-sm md:text-base font-light max-w-md mx-auto leading-relaxed">
            Four paths into the same directory. Pick the one that fits your
            mood today. Switch any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {paths.map((path, i) => (
            <Link
              key={path.href}
              href={path.href}
              className="scroll-reveal group block"
              data-delay={i * 120}
            >
              <article className="editorial-card h-full overflow-hidden flex flex-col">
                {/* Cover */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img loading="lazy" decoding="async"
                    src={path.cover}
                    alt={path.title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
                  {/* Watermark numeral */}
                  <span className="absolute top-4 left-5 font-serif-display text-5xl md:text-6xl text-cream/95 leading-none drop-shadow-md">
                    {path.number}
                  </span>
                  <span className="absolute top-5 right-5 text-[0.6rem] uppercase tracking-[0.24em] px-2 py-1 bg-cream/95 text-bordeaux">
                    {path.eyebrow}
                  </span>
                </div>

                {/* Content */}
                <div className="p-7 flex flex-col gap-4 flex-1">
                  <h3 className="font-serif-display text-2xl text-ink leading-snug group-hover:text-bordeaux transition-colors">
                    {path.title}
                  </h3>
                  <span className="block w-10 h-px bg-champagne transition-all duration-500 group-hover:w-20" />
                  <p className="text-sm text-ink-soft leading-relaxed font-light flex-1">
                    {path.description}
                  </p>
                  <p className="mt-2 text-[0.7rem] uppercase tracking-[0.22em] text-bordeaux editorial-link self-start">
                    Begin →
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
