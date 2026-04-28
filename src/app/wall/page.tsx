import Link from "next/link";
import { WALL_SECTIONS } from "@/data/wall";
import { diaryStories } from "@/data/diaries";
import { getFeaturedReviews, getDiariesStats } from "@/lib/queries/diaries";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";
import { FadeOnScroll } from "@/components/editorial/FadeOnScroll";
import { CountUp } from "@/components/editorial/CountUp";
import { LiveCounter } from "@/components/editorial/LiveCounter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ShaadiWall — Inspiration, stories & real reviews | ShaadiSetu",
  description:
    "An editorial wall of wedding inspiration: maximalist decor, minimalist ceremonies, photography, real-couple diaries, unedited reviews, and the must-haves planners forget.",
};

// Filter-chip labels are derived from the section eyebrows; we add Stories
// and Voices manually so the chips advertise the merged sections too.
const EXTRA_CHIPS = [
  { slug: "stories", label: "Stories" },
  { slug: "voices", label: "Voices" },
];

const REVIEW_EMOJI: Record<string, string> = {
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

export default async function WallPage() {
  const [reviews, stats] = await Promise.all([
    getFeaturedReviews(18),
    getDiariesStats(),
  ]);

  // Existing four wall sections, but we slot Stories between Photography and
  // Must-haves so the rhythm reads: visual → visual → narrative → practical.
  const visualSections = WALL_SECTIONS.slice(0, 3);
  const practicalSections = WALL_SECTIONS.slice(3);

  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative border-b border-ink/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink/90" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-5 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              ShaadiWall
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl lg:text-7xl text-cream leading-[1.05]">
            A wall of weddings,{" "}
            <span className="italic text-champagne">curated by hand.</span>
          </h1>
          <p className="fade-up stagger-2 mt-6 text-cream/80 max-w-2xl mx-auto leading-relaxed font-light text-base md:text-lg">
            Decor we&rsquo;d steal, photography we keep on our desktop, real
            couples telling their own stories, and the unglamorous must-haves
            the rest of the internet forgets to mention.
          </p>

          {/* Filter chips */}
          <div className="fade-up stagger-3 mt-10 flex flex-wrap items-center justify-center gap-2">
            {WALL_SECTIONS.map((s) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className="px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] border border-cream/30 text-cream/85 hover:border-champagne hover:text-champagne transition-colors"
              >
                {s.eyebrow.split("·")[1]?.trim() ?? s.title}
              </a>
            ))}
            {EXTRA_CHIPS.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] border border-champagne/60 text-champagne hover:bg-champagne hover:text-ink transition-colors"
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTERS — moved here from the old /client-diaries page */}
      <section className="border-b border-ink/10 py-10 md:py-14 bg-cream">
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

      {/* VISUAL SECTIONS — Big-fat / Minimalist / Photography */}
      {visualSections.map((section, i) => (
        <WallSection key={section.slug} section={section} alt={i % 2 === 1} />
      ))}

      {/* STORIES — diaries woven in */}
      <StoriesSection />

      {/* PRACTICAL SECTIONS — Must-haves */}
      {practicalSections.map((section, i) => (
        // Continue the alt pattern: visualSections leave off at index 2
        // (alt=false), so practical starts on alt=true to keep the bg rhythm.
        <WallSection
          key={section.slug}
          section={section}
          alt={(visualSections.length + i) % 2 === 1}
        />
      ))}

      {/* FEATURED FROM VENDORS — dark interlude */}
      <FeaturedFromVendors />

      {/* VOICES — reviews wall */}
      <VoicesSection reviews={reviews} />

      {/* CTA — single combined CTA replaces the old wall + diaries CTAs */}
      <section className="border-t border-ink/10 bg-ink text-cream">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-champagne mb-4">
            Your turn
          </p>
          <h2 className="font-serif-display text-3xl md:text-5xl leading-tight">
            Save the shots. Find the people.{" "}
            <span className="italic text-champagne">Write the next entry.</span>
          </h2>
          <p className="mt-4 text-cream/70 max-w-xl mx-auto font-light">
            Sign in to keep your favourite frames, hand them to a vendor, and
            in a few months, send us your story.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/welcome"
              className="px-6 py-3 bg-champagne text-ink text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:bg-cream transition-colors"
            >
              Create an account
            </Link>
            <Link
              href="/vendors"
              className="px-6 py-3 border border-cream/30 text-cream text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:border-champagne hover:text-champagne transition-colors"
            >
              Browse vendors
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function WallSection({
  section,
  alt,
}: {
  section: (typeof WALL_SECTIONS)[number];
  alt: boolean;
}) {
  return (
    <section
      id={section.slug}
      className={`py-16 md:py-24 border-b border-ink/10 scroll-mt-24 ${
        alt ? "bg-cream-soft" : "bg-cream"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll>
          <div className="md:flex md:items-end md:justify-between md:gap-10 mb-12">
            <div className="md:max-w-2xl">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-bordeaux mb-3">
                {section.eyebrow}
              </p>
              <h2 className="font-serif-display text-3xl md:text-5xl text-ink leading-tight">
                {section.title}
              </h2>
            </div>
            <p className="mt-5 md:mt-0 md:max-w-sm text-sm md:text-base text-ink-soft font-light leading-relaxed">
              {section.blurb}
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4">
          {section.shots.map((shot, i) => (
            <RevealOnScroll
              key={shot.id}
              delay={i * 60}
              className={`${
                shot.span === "tall" ? "row-span-2" : ""
              } ${shot.span === "wide" ? "col-span-2" : ""}`}
            >
              <ShotCard shot={shot} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShotCard({ shot }: { shot: (typeof WALL_SECTIONS)[number]["shots"][number] }) {
  return (
    <article className="group relative w-full h-full overflow-hidden bg-ink/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shot.image}
        alt={shot.title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="font-serif-display text-base md:text-lg text-cream leading-tight">
          {shot.title}
        </h3>
        <p className="mt-1 text-[0.72rem] md:text-xs text-cream/75 font-light leading-relaxed line-clamp-2">
          {shot.caption}
        </p>
        {shot.vendor && (
          <Link
            href={shot.vendor.href}
            className="inline-block mt-2 text-[0.6rem] uppercase tracking-[0.22em] text-champagne hover:text-cream editorial-link"
          >
            {shot.vendor.name} →
          </Link>
        )}
      </div>
    </article>
  );
}

// ─── STORIES (diaries woven into the wall) ─────────────────────────────────

function StoriesSection() {
  return (
    <section
      id="stories"
      className="py-16 md:py-24 border-b border-ink/10 scroll-mt-24 bg-cream-soft"
    >
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll>
          <div className="md:flex md:items-end md:justify-between md:gap-10 mb-12">
            <div className="md:max-w-2xl">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-bordeaux mb-3">
                Stories · Long-form love letters
              </p>
              <h2 className="font-serif-display text-3xl md:text-5xl text-ink leading-tight">
                Real couples,{" "}
                <span className="italic text-bordeaux">in their own words.</span>
              </h2>
            </div>
            <p className="mt-5 md:mt-0 md:max-w-sm text-sm md:text-base text-ink-soft font-light leading-relaxed">
              Hand-edited diaries from couples who planned with us — the
              planning, the panic, the photographs.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {diaryStories.map((s, i) => (
            <FadeOnScroll key={s.id} delay={i * 80}>
              <article className="group h-full overflow-hidden flex flex-col bg-cream border border-ink/10 hover:border-bordeaux transition-colors">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    loading="lazy"
                    decoding="async"
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
                  <p className="text-sm text-ink-soft/85 leading-relaxed font-light">
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
  );
}

// ─── FEATURED FROM VENDORS (existing) ──────────────────────────────────────

function FeaturedFromVendors() {
  const featured = WALL_SECTIONS.flatMap((s) => s.shots).filter((s) => s.vendor);
  if (!featured.length) return null;

  return (
    <section className="py-16 md:py-24 bg-ink text-cream">
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll>
          <div className="md:flex md:items-end md:justify-between mb-10">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-champagne mb-3">
                Featured · From our vendors
              </p>
              <h2 className="font-serif-display text-3xl md:text-5xl leading-tight">
                Real frames from{" "}
                <span className="italic text-champagne">real shoots.</span>
              </h2>
            </div>
            <Link
              href="/vendors"
              className="hidden md:inline-block text-[0.7rem] uppercase tracking-[0.22em] text-champagne editorial-link"
            >
              See all vendors →
            </Link>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured.slice(0, 6).map((shot, i) => (
            <RevealOnScroll key={shot.id} delay={i * 80}>
              <article className="group">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shot.image}
                    alt={shot.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] text-champagne mb-1">
                    {shot.vendor?.name}
                  </p>
                  <h3 className="font-serif-display text-xl text-cream leading-tight">
                    {shot.title}
                  </h3>
                  <p className="mt-1 text-sm text-cream/70 font-light leading-relaxed">
                    {shot.caption}
                  </p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── VOICES (reviews wall) ────────────────────────────────────────────────

interface FeaturedReviewLite {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  eventType: string;
  vendor: { id: string; name: string; cityName: string; categoryId: string };
}

function VoicesSection({ reviews }: { reviews: FeaturedReviewLite[] }) {
  if (!reviews.length) return null;

  return (
    <section
      id="voices"
      className="py-16 md:py-24 border-b border-ink/10 scroll-mt-24 bg-cream"
    >
      <div className="max-w-6xl mx-auto px-6">
        <RevealOnScroll>
          <div className="md:flex md:items-end md:justify-between md:gap-10 mb-12">
            <div className="md:max-w-2xl">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-bordeaux mb-3">
                Voices · Verified reviews
              </p>
              <h2 className="font-serif-display text-3xl md:text-5xl text-ink leading-tight">
                Unedited words,{" "}
                <span className="italic text-bordeaux">straight from the day.</span>
              </h2>
            </div>
            <p className="mt-5 md:mt-0 md:max-w-sm text-sm md:text-base text-ink-soft font-light leading-relaxed">
              Every review here was written by a couple who booked through
              ShaadiSetu. We don&rsquo;t edit them. We don&rsquo;t gate them.
            </p>
          </div>
        </RevealOnScroll>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {reviews.map((r, i) => {
            const emoji = REVIEW_EMOJI[r.vendor.categoryId] ?? "✨";
            return (
              <FadeOnScroll key={r.id} delay={(i % 9) * 50}>
                <article className="mb-6 break-inside-avoid p-6 group bg-cream-soft border border-ink/10 hover:border-bordeaux transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <ReviewAvatar name={r.author} />
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
                        className={idx < r.rating ? "opacity-100" : "opacity-25"}
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
                  <p className="text-sm text-ink-soft leading-relaxed font-light">
                    {r.body}
                  </p>
                  <div className="mt-4 pt-3 border-t border-ink/8">
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
      </div>
    </section>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

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
        <p className="font-serif-display text-3xl md:text-4xl text-bordeaux">
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

function ReviewAvatar({ name }: { name: string }) {
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
