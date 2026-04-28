import Link from "next/link";
import { FINANCE_PRODUCTS, FINANCE_DISCLAIMER } from "@/data/finance";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";

export const metadata = {
  title: "Finance — Wedding insurance & loans | ShaadiSetu",
  description:
    "Plan with confidence. Compare wedding insurance and personal loan options from leading Indian partners — laid out in plain English, with no hard sell.",
};

export default function FinanceHubPage() {
  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative border-b border-ink/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1606800052052-a08af7148866?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink/90" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-5 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Finance
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl lg:text-7xl text-cream leading-[1.05]">
            Plan the day,{" "}
            <span className="italic text-champagne">protect the spend.</span>
          </h1>
          <p className="fade-up stagger-2 mt-6 text-cream/80 max-w-2xl mx-auto leading-relaxed font-light text-base md:text-lg">
            The average Indian wedding now costs ₹15-50 lakh. Whether you
            insure it against the unexpected or fund it on terms you control,
            the basics are not complicated — once someone explains them in
            English.
          </p>
        </div>
      </section>

      {/* TWO-PANEL */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {FINANCE_PRODUCTS.map((p, i) => (
              <RevealOnScroll key={p.slug} delay={i * 100}>
                <article className="editorial-card group flex flex-col overflow-hidden h-full">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.hero}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                    <p className="absolute top-4 left-5 text-[0.65rem] uppercase tracking-[0.28em] text-cream/90">
                      {p.eyebrow}
                    </p>
                  </div>

                  <div className="p-7 md:p-9 flex flex-col gap-5 flex-1">
                    <h2 className="font-serif-display text-3xl md:text-4xl text-ink leading-tight">
                      {p.title}{" "}
                      <span className="italic text-bordeaux">{p.italicWord}</span>
                    </h2>
                    <span className="block w-10 h-px bg-champagne transition-all duration-500 group-hover:w-20" />
                    <p className="text-sm text-ink-soft leading-relaxed font-light">
                      {p.blurb}
                    </p>

                    <ul className="mt-1 space-y-2.5 flex-1">
                      {p.whatItIs.slice(0, 3).map((b) => (
                        <li
                          key={b}
                          className="flex gap-3 text-sm text-ink/80 leading-relaxed font-light"
                        >
                          <span className="mt-2 block w-1.5 h-1.5 flex-shrink-0 bg-bordeaux" />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 pt-5 border-t border-ink/10 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft">
                          Featured partners
                        </p>
                        <p className="text-sm text-ink mt-1 font-medium">
                          {p.partners.length} options
                        </p>
                      </div>
                      <Link
                        href={`/finance/${p.slug}`}
                        className="px-5 py-3 bg-bordeaux text-cream text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors"
                      >
                        Explore →
                      </Link>
                    </div>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>

          {/* DISCLAIMER */}
          <p className="mt-12 text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft text-center max-w-3xl mx-auto leading-relaxed">
            {FINANCE_DISCLAIMER}
          </p>
        </div>
      </section>
    </main>
  );
}
