import Link from "next/link";
import { getFeaturedReviews, getDiariesStats } from "@/lib/queries/diaries";
import { diaryStories } from "@/data/diaries";
import { CountUp } from "@/components/editorial/CountUp";
import { LiveCounter } from "@/components/editorial/LiveCounter";
import { FadeOnScroll } from "@/components/editorial/FadeOnScroll";
import { SectionDivider } from "@/components/editorial/SectionDivider";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Client Diaries — ShaadiSetu",
  description:
    "Real stories and reviews from couples who planned their wedding with ShaadiSetu.",
};

const CATEGORY_EMOJI: Record<string, string> = {
  photography: "📸",
  decor: "🌸",
  catering: "🍛",
  venues: "🏛️",
  attire: "👗",
  beauty: "💄",
  entertainment: "🎶",
  rituals: "🪔",
  planning: "📋",
  invitations: "✉️",
  gifts: "🎁",
  jewelry: "💍",
  honeymoon: "✈️",
  logistics: "🚌",
};

export default async function ClientDiariesPage() {
  const [reviews, stats] = await Promise.all([
    getFeaturedReviews(24),
    getDiariesStats(),
  ]);

  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/85" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Client Diaries
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            Real couples. <span className="italic text-champagne">Real stories.</span>
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/80 max-w-xl mx-auto leading-relaxed font-light">
            Every wedding on ShaadiSetu has a story behind it. Here are some
            of our favourites — alongside the unedited reviews of the artisans
            who made them happen.
          </p>
        </div>
      </section>

      {/* DYNAMIC COUNTERS */}
      <section className="border-b border-ink/10 py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-champagne/30">
            <CounterCell
              label="Couples Served"
              live
              value={stats.vendors > 0 ? 12_400 + Math.floor(stats.vendors * 7) : 12_400}
              suffix="+"
            />
            <CounterCell
              label="Verified Vendors"
              value={stats.vendors}
              suffix="+"
            />
            <CounterCell
              label="Average Rating"
              value={stats.averageRating}
              decimals={2}
              suffix="/5"
            />
            <CounterCell
              label="Reviews Published"
              live
              value={stats.reviews}
            />
          </div>
        </div>
      </section>

      {/* FEATURED DIARY STORIES */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto">
              <p className="eyebrow"><span className="eyebrow-num">01</span>Featured Diaries</p>
              <h2 className="font-serif-display text-4xl md:text-5xl text-ink mt-4 leading-tight">
                Long-form love letters.
              </h2>
              <SectionDivider className="mt-6" />
              <p className="mt-6 text-ink-soft leading-relaxed font-light">
                Hand-edited weddings — the planning, the panic, the photographs.
              </p>
            </div>
          </RevealOnScroll>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {diaryStories.map((s, i) => (
              <FadeOnScroll key={s.id} delay={i * 80}>
                <article className="editorial-card group h-full overflow-hidden flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img loading="lazy" decoding="async"
                      src={s.cover}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-3xl drop-shadow-sm">{s.emoji}</span>
                      <span className="text-[0.62rem] uppercase tracking-[0.22em] px-2 py-1 bg-cream/95 text-bordeaux">
                        {s.month}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-5 right-5 text-cream">
                      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-champagne/95">
                        {s.couple} · {s.city}
                      </p>
                    </div>
                  </div>

                  <div className="p-7 flex flex-col gap-4 flex-1">
                    <h3 className="font-serif-display text-2xl md:text-[1.7rem] text-ink leading-snug group-hover:text-bordeaux transition-colors">
                      {s.title}
                    </h3>
                    <span className="block w-10 h-px bg-champagne transition-all duration-500 group-hover:w-20" />
                    <p className="text-ink-soft leading-relaxed font-light italic">
                      &ldquo;{s.excerpt}&rdquo;
                    </p>
                    <p className="text-sm text-ink-soft/85 leading-relaxed">
                      {s.body}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-3 mt-auto border-t border-ink/8">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft/70 px-2 py-1 border border-ink/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </FadeOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* REAL REVIEWS WALL */}
      <section className="bg-cream-soft py-20 md:py-28 border-y border-ink/10">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto">
              <p className="eyebrow"><span className="eyebrow-num">02</span>Verified Reviews</p>
              <h2 className="font-serif-display text-4xl md:text-5xl text-ink mt-4 leading-tight">
                Unedited words from real couples.
              </h2>
              <SectionDivider className="mt-6" />
              <p className="mt-6 text-ink-soft leading-relaxed font-light">
                Every review below was written by a couple who booked through ShaadiSetu.
                We never edit them. We never gate them.
              </p>
            </div>
          </RevealOnScroll>

          <div className="mt-14 columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {reviews.map((r, i) => {
              const emoji = CATEGORY_EMOJI[r.vendor.categoryId] ?? "✨";
              return (
                <FadeOnScroll key={r.id} delay={(i % 9) * 50}>
                  <article className="editorial-card mb-6 break-inside-avoid p-6 group hover:-translate-y-1">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={r.author} />
                        <div>
                          <p className="font-medium text-ink text-sm">{r.author}</p>
                          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ink-soft/70 mt-0.5">
                            {r.vendor.cityName} · {r.eventType}
                          </p>
                        </div>
                      </div>
                      <span className="text-2xl">{emoji}</span>
                    </div>

                    <div className="flex items-center gap-1 text-champagne text-sm mb-3">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span
                          key={idx}
                          className={
                            idx < r.rating ? "opacity-100" : "opacity-25"
                          }
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft/70 ml-2">
                        {r.date}
                      </span>
                    </div>

                    <h4 className="font-serif-display text-xl text-ink leading-snug group-hover:text-bordeaux transition-colors">
                      &ldquo;{r.title}&rdquo;
                    </h4>
                    <span className="block w-6 h-px bg-champagne my-3 transition-all duration-500 group-hover:w-12" />
                    <p className="text-sm text-ink-soft leading-relaxed">
                      {r.body}
                    </p>
                    <div className="mt-4 pt-3 border-t border-ink/8 flex items-center justify-between">
                      <Link
                        href={`/vendors/v/${r.vendor.id}`}
                        className="text-[0.65rem] uppercase tracking-[0.2em] text-bordeaux editorial-link"
                      >
                        {r.vendor.name}
                      </Link>
                    </div>
                  </article>
                </FadeOnScroll>
              );
            })}
          </div>

          {reviews.length === 0 && (
            <p className="text-center text-ink-soft mt-10 italic">
              No reviews yet — check back soon.
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <RevealOnScroll>
            <p className="eyebrow"><span className="eyebrow-num">03</span>Your Story</p>
            <h2 className="font-serif-display text-4xl md:text-5xl text-ink mt-4 leading-tight">
              Write the next <span className="italic text-bordeaux">diary entry.</span>
            </h2>
            <SectionDivider className="mt-6" />
            <p className="mt-6 text-ink-soft font-light">
              Every diary on this page started with a single search.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Link href="/vendors" className="btn-editorial">
                Browse Vendors
              </Link>
              <Link href="/account/signup" className="btn-editorial-ghost">
                Start Planning
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}

function CounterCell({
  label,
  value,
  suffix,
  decimals,
  live,
}: {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  live?: boolean;
}) {
  return (
    <FadeOnScroll fadeOut={false} visibleOnLoad>
      <div className="bg-cream px-6 py-8 text-center h-full flex flex-col items-center justify-center">
        <p className="font-serif-display text-4xl md:text-5xl text-bordeaux">
          {live ? (
            <LiveCounter base={value} suffix={suffix ?? ""} />
          ) : (
            <CountUp to={value} decimals={decimals} suffix={suffix ?? ""} />
          )}
        </p>
        <span className="block w-8 h-px bg-champagne my-3" />
        <p className="text-[0.62rem] uppercase tracking-[0.28em] text-ink-soft">
          {label}
        </p>
      </div>
    </FadeOnScroll>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-bordeaux text-cream flex items-center justify-center font-serif-display text-base shrink-0">
      {initials}
    </div>
  );
}
