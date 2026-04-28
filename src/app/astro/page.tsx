import Link from "next/link";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";

export const metadata = {
  title: "Astro — Kundli matching & astrology readings | ShaadiSetu",
  description:
    "Vedic kundli matching and personal astrology readings, computed traditionally and explained in plain English.",
};

const features = [
  {
    href: "/astro/match",
    eyebrow: "Guna Milan",
    title: "Kundli Matching.",
    italic: "36-point compatibility.",
    blurb:
      "The traditional Vedic Ashtakoota method — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi — laid out in plain English with practical guidance.",
    cover:
      "https://images.unsplash.com/photo-1518624568264-fda71b8ed8e3?w=1600&q=80",
  },
  {
    href: "/astro/reading",
    eyebrow: "Janam Patri",
    title: "Astrology Reading.",
    italic: "Your stars, decoded.",
    blurb:
      "Birth chart insights for one person — Sun, Moon, Lagna, current Dasha — read in modern English with focus areas like career or relationships.",
    cover:
      "https://images.unsplash.com/photo-1532009877282-3340270e0529?w=1600&q=80",
  },
];

export default function AstroLandingPage() {
  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative border-b border-ink/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1532009877282-3340270e0529?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/60 to-ink/90" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-5 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Astro
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl lg:text-7xl text-cream leading-[1.05]">
            Kundli aur Sitaare.{" "}
            <span className="italic text-champagne">Your stars, decoded.</span>
          </h1>
          <p className="fade-up stagger-2 mt-6 text-cream/80 max-w-2xl mx-auto leading-relaxed font-light text-base md:text-lg">
            Two traditional Vedic services, modernised. Compute compatibility
            between two birth charts, or read a single chart for what it says
            about you. Honest interpretation, no fearmongering.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {features.map((f, i) => (
              <RevealOnScroll key={f.href} delay={i * 100}>
                <Link href={f.href} className="block group h-full">
                  <article className="editorial-card flex flex-col overflow-hidden h-full">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.cover}
                        alt={f.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                      <p className="absolute top-4 left-5 text-[0.65rem] uppercase tracking-[0.28em] text-cream/90">
                        {f.eyebrow}
                      </p>
                    </div>
                    <div className="p-7 md:p-9 flex flex-col gap-5 flex-1">
                      <h2 className="font-serif-display text-3xl md:text-4xl text-ink leading-tight">
                        {f.title}{" "}
                        <span className="italic text-bordeaux">{f.italic}</span>
                      </h2>
                      <span className="block w-10 h-px bg-champagne transition-all duration-500 group-hover:w-20" />
                      <p className="text-sm text-ink-soft leading-relaxed font-light flex-1">
                        {f.blurb}
                      </p>
                      <div className="mt-2">
                        <span className="px-5 py-3 inline-block bg-bordeaux text-cream text-[0.72rem] uppercase tracking-[0.22em] font-medium group-hover:bg-ink transition-colors">
                          Begin →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </RevealOnScroll>
            ))}
          </div>

          <p className="mt-12 text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft text-center max-w-3xl mx-auto leading-relaxed">
            For guidance, not prediction. Astrological readings are
            interpretive — pair them with your own judgement.
          </p>
        </div>
      </section>
    </main>
  );
}
