import Link from "next/link";
import { BUDGET_TIERS } from "@/data/budgetTiers";
import { WEDDING_EVENTS } from "@/data/weddingEvents";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";
import { SectionDivider } from "@/components/editorial/SectionDivider";
import { FadeOnScroll } from "@/components/editorial/FadeOnScroll";

export const metadata = {
  title: "By Event & Budget — ShaadiSetu",
  description:
    "Plan a wedding by total budget, or browse vendors by ceremony — haldi, mehendi, sangeet, pheras, reception. Curated lists, editorial layout.",
};

export default function FunctionsHubPage() {
  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1525772764200-be829a350797?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/85" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Two Ways In
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            Pick a budget. <span className="italic text-champagne">Or pick an event.</span>
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/80 max-w-xl mx-auto leading-relaxed font-light">
            Two curated paths into the directory. The first matches vendors to
            your wallet. The second matches them to the moment.
          </p>
        </div>
      </section>

      {/* SECTION 1 — BY BUDGET */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto">
              <p className="eyebrow"><span className="eyebrow-num">01</span>Plan by Budget</p>
              <h2 className="font-serif-display text-4xl md:text-5xl text-ink mt-4 leading-tight">
                What does your wedding cost <em className="italic text-bordeaux">should</em> be?
              </h2>
              <SectionDivider className="mt-6" />
              <p className="mt-6 text-ink-soft leading-relaxed font-light">
                Choose a budget bracket. We&apos;ll allocate it across thirteen
                categories — venues, catering, decor, photography, and the rest —
                and surface only the vendors whose price bands fit.
              </p>
            </div>
          </RevealOnScroll>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {BUDGET_TIERS.map((tier, i) => (
              <FadeOnScroll key={tier.id} delay={i * 80}>
                <Link href={`/functions/budget/${tier.id}`} className="group block h-full">
                  <article className="editorial-card h-full overflow-hidden flex flex-col">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img loading="lazy" decoding="async"
                        src={tier.cover}
                        alt={tier.label}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-transparent" />
                      <span className="absolute top-4 left-4 text-3xl drop-shadow">{tier.emoji}</span>
                      <span className="absolute top-4 right-4 text-[0.62rem] uppercase tracking-[0.22em] px-2 py-1 bg-cream/95 text-bordeaux">
                        {tier.label}
                      </span>
                      <p className="absolute bottom-4 left-5 right-5 font-serif-display text-2xl md:text-3xl text-cream leading-tight">
                        {tier.totalLabel}
                      </p>
                    </div>

                    <div className="p-7 flex flex-col gap-4 flex-1">
                      <p className="font-serif-display text-xl text-ink leading-snug group-hover:text-bordeaux transition-colors">
                        {tier.tagline}
                      </p>
                      <span className="block w-10 h-px bg-champagne transition-all duration-500 group-hover:w-20" />
                      <p className="text-sm text-ink-soft leading-relaxed font-light">
                        {tier.description}
                      </p>
                      <p className="mt-2 text-[0.7rem] uppercase tracking-[0.22em] text-bordeaux editorial-link self-start">
                        See curated vendors →
                      </p>
                    </div>
                  </article>
                </Link>
              </FadeOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — BY EVENT */}
      <section className="bg-cream-soft border-y border-ink/10 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto">
              <p className="eyebrow"><span className="eyebrow-num">02</span>Browse by Event</p>
              <h2 className="font-serif-display text-4xl md:text-5xl text-ink mt-4 leading-tight">
                Which ceremony are you planning <em className="italic text-bordeaux">today?</em>
              </h2>
              <SectionDivider className="mt-6" />
              <p className="mt-6 text-ink-soft leading-relaxed font-light">
                Each ceremony needs a different mix of vendors. Open one to see
                exactly which categories matter, in the order they matter.
              </p>
            </div>
          </RevealOnScroll>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEDDING_EVENTS.map((event, i) => (
              <FadeOnScroll key={event.id} delay={(i % 6) * 60}>
                <Link href={`/functions/event/${event.id}`} className="group block h-full">
                  <article className="editorial-card h-full overflow-hidden flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img loading="lazy" decoding="async"
                        src={event.cover}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/0 to-transparent" />
                      <span className="absolute top-3 left-3 text-2xl drop-shadow">{event.emoji}</span>
                      <p className="absolute bottom-3 left-4 right-4 font-serif-display text-xl text-cream leading-tight">
                        {event.name}
                      </p>
                    </div>
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-champagne">
                        {event.tagline}
                      </p>
                      <p className="text-sm text-ink-soft leading-relaxed font-light">
                        {event.description}
                      </p>
                      <p className="mt-auto pt-3 text-[0.62rem] uppercase tracking-[0.22em] text-bordeaux editorial-link self-start">
                        Open the event →
                      </p>
                    </div>
                  </article>
                </Link>
              </FadeOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <RevealOnScroll>
            <p className="eyebrow"><span className="eyebrow-num">03</span>Or browse the directory</p>
            <h3 className="font-serif-display text-3xl md:text-4xl text-ink mt-4 leading-tight">
              Already know what you&apos;re looking for?
            </h3>
            <SectionDivider className="mt-6" />
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Link href="/vendors" className="btn-editorial">
                All Vendors
              </Link>
              <Link href="/plan/budget" className="btn-editorial-ghost">
                Open Budget Planner
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
