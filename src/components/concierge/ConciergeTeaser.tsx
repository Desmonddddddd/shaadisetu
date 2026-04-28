"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function ConciergeTeaser() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden border-y border-ink/10"
    >
      {/* Backdrop image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1606800052052-a08af7148866?w=2400&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/65 to-ink/90" />

      {/* Floating gold ornaments */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-12 left-8 md:left-16 w-32 h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />
        <div className="absolute bottom-12 right-8 md:right-16 w-32 h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-champagne/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full border border-champagne/5" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="scroll-reveal flex items-center justify-center gap-3 mb-6">
          <span className="block w-12 h-px bg-champagne" />
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
            The Concierge
          </p>
          <span className="block w-12 h-px bg-champagne" />
        </div>

        <h2 className="scroll-reveal font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]" data-delay={120}>
          Plan it like you have <em className="italic text-champagne">a planner.</em>
        </h2>

        <p className="scroll-reveal mt-6 text-cream/85 max-w-2xl mx-auto leading-relaxed font-light text-base md:text-lg" data-delay={200}>
          Six honest questions. A real plan in return — vendor names, rupee
          allocations, ceremony-by-ceremony picks. Built the way a senior
          planner would brief you over coffee.
        </p>

        {/* Sample Q teaser */}
        <div className="scroll-reveal mt-10 max-w-md mx-auto" data-delay={280}>
          <div className="border border-champagne/30 bg-ink/40 backdrop-blur-sm p-5 text-left">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-champagne mb-2">
              The planner asks
            </p>
            <p className="font-serif-display italic text-lg text-cream/95 leading-snug">
              &ldquo;What matters most to you — photographs that age beautifully, or
              food people remember?&rdquo;
            </p>
          </div>
        </div>

        <div className="scroll-reveal mt-10" data-delay={360}>
          <Link
            href="/plan-with-me"
            className="inline-flex items-center gap-3 px-8 py-4 bg-champagne text-ink font-semibold uppercase tracking-[0.18em] text-sm hover:bg-cream transition-colors group"
          >
            Begin the journey
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <p className="mt-4 text-[0.65rem] uppercase tracking-[0.22em] text-cream/60">
            Free · 3 minutes · Saved privately to your browser
          </p>
        </div>
      </div>
    </section>
  );
}
