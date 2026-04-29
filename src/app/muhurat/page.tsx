import Link from "next/link";
import { MuhuratFinder } from "@/components/muhurat/MuhuratFinder";

export const metadata = {
  title: "Muhurat — Auspicious Wedding Dates 2026-2027 | ShaadiSetu",
  description:
    "Find shubh muhurat dates for vivah, sagai, and griha pravesh across 2026-2027. Tithi, nakshatra, and paksha for each date — explained in plain English.",
};

export default function MuhuratPage() {
  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative border-b border-ink/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink/90" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-5 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Shubh Muhurat
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            Auspicious dates.{" "}
            <span className="italic text-champagne">Picked from the Panchang.</span>
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/80 max-w-2xl mx-auto font-light text-sm md:text-base">
            Curated shubh muhurat dates for vivah, sagai, and griha pravesh
            across 2026 and 2027. Every date listed with its tithi, nakshatra,
            and paksha — so you know <em>why</em> it&apos;s auspicious, not just that it is.
          </p>
          <div className="fade-up stagger-3 mt-7 flex items-center justify-center gap-3 text-[0.7rem] uppercase tracking-[0.22em]">
            <Link href="/astro/match" className="text-cream/90 hover:text-champagne transition-colors">
              Match Kundlis →
            </Link>
            <span className="text-cream/30">·</span>
            <Link href="/astro/reading" className="text-cream/90 hover:text-champagne transition-colors">
              Read your chart →
            </Link>
          </div>
        </div>
      </section>

      {/* FINDER */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <MuhuratFinder />
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft leading-relaxed">
            Dates curated from standard Hindu Panchang almanacs. For your specific
            chart, region, and family tradition, consult a registered jyotish before
            fixing the muhurat.
          </p>
        </div>
      </section>
    </main>
  );
}
