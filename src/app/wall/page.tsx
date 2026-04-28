import Link from "next/link";
import { WALL_SECTIONS } from "@/data/wall";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";

export const metadata = {
  title: "ShaadiWall — Decor, photography & must-haves | ShaadiSetu",
  description:
    "An editorial wall of wedding inspiration: maximalist decor, minimalist ceremonies, photography we can't stop looking at, and the boring must-haves planners keep forgetting.",
};

export default function WallPage() {
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
            Decor we&rsquo;d steal, photography we keep on our desktop, and the
            unglamorous must-haves the rest of the internet forgets to mention.
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
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      {WALL_SECTIONS.map((section, i) => (
        <Section key={section.slug} section={section} alt={i % 2 === 1} />
      ))}

      {/* FEATURED FROM VENDORS — pulls vendor-credited shots across all sections */}
      <FeaturedFromVendors />

      {/* CTA strip */}
      <section className="border-t border-ink/10 bg-ink text-cream">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-champagne mb-4">
            Build your own wall
          </p>
          <h2 className="font-serif-display text-3xl md:text-5xl leading-tight">
            Save the shots you love.{" "}
            <span className="italic text-champagne">Hand them to a vendor.</span>
          </h2>
          <p className="mt-4 text-cream/70 max-w-xl mx-auto font-light">
            Sign in and we&rsquo;ll keep your favourite frames in one place — so
            you can show your decorator exactly what you mean.
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

function Section({
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
        {/* Section header */}
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

        {/* Asymmetric masonry */}
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
