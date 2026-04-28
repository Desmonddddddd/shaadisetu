import Link from "next/link";

export const metadata = {
  title: "Sign in or join — ShaadiSetu",
  description:
    "Two doors. One for couples planning a wedding, one for vendors building their book of business. Pick the one that fits.",
};

export default function WelcomePage() {
  return (
    <main className="bg-cream text-ink min-h-screen">
      {/* HERO */}
      <section className="relative border-b border-ink/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink/85" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-5 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Welcome
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            Two doors.{" "}
            <span className="italic text-champagne">Pick yours.</span>
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/80 max-w-xl mx-auto leading-relaxed font-light text-sm md:text-base">
            One for couples planning a wedding. One for vendors building their
            book of business. The rest is the same beautiful platform.
          </p>
        </div>
      </section>

      {/* TWO PANELS */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <PanelCard
              eyebrow="01 · For Couples"
              title="Plan your wedding"
              tagline="Save vendors. Track enquiries. Build your shortlist."
              points={[
                "Browse 18 categories of curated vendors",
                "Save favourites and message them directly",
                "Track every enquiry and reply in one inbox",
                "Use the Concierge to plan end-to-end",
              ]}
              primaryHref="/account/signup"
              primaryLabel="Create couple account"
              secondaryHref="/account/login"
              secondaryLabel="Sign in"
              cover="https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1200&q=80"
              accent="bordeaux"
            />

            <PanelCard
              eyebrow="02 · For Vendors"
              title="Grow your business"
              tagline="A profile that earns its keep. Real enquiries, no clutter."
              points={[
                "Editorial profile with portfolio + packages",
                "Verified enquiries from serious couples",
                "Featured placement in your category",
                "Dashboard with reply tracking + saved leads",
              ]}
              primaryHref="/vendor/signup"
              primaryLabel="List your business"
              secondaryHref="/vendor/login"
              secondaryLabel="Vendor sign in"
              cover="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80"
              accent="ink"
            />
          </div>

          <p className="mt-12 text-center text-[0.7rem] uppercase tracking-[0.24em] text-ink-soft">
            Not sure?{" "}
            <Link href="/about" className="editorial-link text-bordeaux">
              Read the manifesto
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function PanelCard({
  eyebrow,
  title,
  tagline,
  points,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  cover,
  accent,
}: {
  eyebrow: string;
  title: string;
  tagline: string;
  points: string[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  cover: string;
  accent: "bordeaux" | "ink";
}) {
  return (
    <article className="editorial-card group flex flex-col overflow-hidden h-full">
      <div className="relative aspect-[16/9] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
        <p className="absolute top-4 left-5 text-[0.65rem] uppercase tracking-[0.28em] text-cream/90">
          {eyebrow}
        </p>
      </div>

      <div className="p-7 md:p-9 flex flex-col gap-5 flex-1">
        <h2 className="font-serif-display text-3xl md:text-4xl text-ink leading-tight">
          {title}
        </h2>
        <span className="block w-10 h-px bg-champagne transition-all duration-500 group-hover:w-20" />
        <p className="text-sm text-ink-soft leading-relaxed font-light">
          {tagline}
        </p>

        <ul className="mt-1 space-y-2.5 flex-1">
          {points.map((p) => (
            <li
              key={p}
              className="flex gap-3 text-sm text-ink/80 leading-relaxed font-light"
            >
              <span
                className={`mt-2 block w-1.5 h-1.5 flex-shrink-0 ${
                  accent === "bordeaux" ? "bg-bordeaux" : "bg-ink"
                }`}
              />
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-5 border-t border-ink/10 flex flex-col sm:flex-row gap-3">
          <Link
            href={primaryHref}
            className={`flex-1 text-center px-5 py-3 text-[0.72rem] uppercase tracking-[0.22em] font-medium transition-colors ${
              accent === "bordeaux"
                ? "bg-bordeaux text-cream hover:bg-ink"
                : "bg-ink text-cream hover:bg-bordeaux"
            }`}
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="flex-1 text-center px-5 py-3 text-[0.72rem] uppercase tracking-[0.22em] font-medium text-ink border border-ink/20 hover:border-ink hover:bg-ink hover:text-cream transition-colors"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
