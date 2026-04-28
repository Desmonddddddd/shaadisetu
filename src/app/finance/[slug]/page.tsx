import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FINANCE_PRODUCTS,
  FINANCE_DISCLAIMER,
  getFinanceProduct,
  type FinanceProduct,
} from "@/data/finance";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";
import FinanceLeadButton from "@/components/FinanceLeadButton";

export function generateStaticParams() {
  return FINANCE_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getFinanceProduct(slug as FinanceProduct);
  if (!product) return { title: "Finance — ShaadiSetu" };
  return {
    title: `${product.eyebrow} — ${product.title} ${product.italicWord} | ShaadiSetu`,
    description: product.blurb,
  };
}

export default async function FinanceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getFinanceProduct(slug as FinanceProduct);
  if (!product) notFound();

  const enquiryTopic = `${product.eyebrow} enquiry`;

  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative border-b border-ink/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 animate-[hero-pan_30s_ease-in-out_infinite_alternate]"
          style={{ backgroundImage: `url('${product.hero}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink/95" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5 fade-up">
              <span className="block w-12 h-px bg-champagne" />
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
                {product.eyebrow}
              </p>
            </div>
            <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl lg:text-7xl text-cream leading-[1.05]">
              {product.title}{" "}
              <span className="italic text-champagne">
                {product.italicWord}
              </span>
            </h1>
            <p className="fade-up stagger-2 mt-6 text-cream/85 max-w-xl leading-relaxed font-light text-base md:text-lg">
              {product.blurb}
            </p>

            <div className="fade-up stagger-3 mt-10 flex flex-col sm:flex-row gap-3">
              <FinanceLeadButton
                topic={enquiryTopic}
                cta="Talk to a planner"
              />
              <a
                href="#partners"
                className="inline-flex items-center justify-center px-6 py-3 border border-cream/30 text-cream text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:border-champagne hover:text-champagne transition-colors"
              >
                Compare partners ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT IS / WHO IT IS FOR */}
      <section className="py-16 md:py-24 border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <RevealOnScroll>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-bordeaux mb-3">
              What it is
            </p>
            <h2 className="font-serif-display text-2xl md:text-3xl text-ink leading-tight">
              In plain English.
            </h2>
            <span className="block w-10 h-px bg-champagne mt-4 mb-6" />
            <ul className="space-y-4">
              {product.whatItIs.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 text-sm md:text-base text-ink/80 font-light leading-relaxed"
                >
                  <span className="mt-2 block w-1.5 h-1.5 flex-shrink-0 bg-bordeaux" />
                  {line}
                </li>
              ))}
            </ul>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-bordeaux mb-3">
              Who it&rsquo;s for
            </p>
            <h2 className="font-serif-display text-2xl md:text-3xl text-ink leading-tight">
              When it makes sense.
            </h2>
            <span className="block w-10 h-px bg-champagne mt-4 mb-6" />
            <ul className="space-y-4">
              {product.whoItIsFor.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 text-sm md:text-base text-ink/80 font-light leading-relaxed"
                >
                  <span className="mt-2 block w-1.5 h-1.5 flex-shrink-0 bg-champagne" />
                  {line}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners" className="py-16 md:py-24 bg-cream-soft border-b border-ink/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <RevealOnScroll>
            <div className="md:flex md:items-end md:justify-between mb-10 md:mb-14">
              <div className="md:max-w-xl">
                <p className="text-[0.7rem] uppercase tracking-[0.28em] text-bordeaux mb-3">
                  Featured partners
                </p>
                <h2 className="font-serif-display text-3xl md:text-5xl text-ink leading-tight">
                  Side by side,{" "}
                  <span className="italic text-bordeaux">no fine print.</span>
                </h2>
              </div>
              <p className="mt-5 md:mt-0 md:max-w-sm text-sm text-ink-soft font-light leading-relaxed">
                Sponsored placements are clearly marked. We don&rsquo;t hide
                fees, and we don&rsquo;t rank by who paid most.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {product.partners.map((partner, i) => (
              <RevealOnScroll key={partner.id} delay={i * 80}>
                <article className="relative h-full border border-ink/10 bg-cream p-7 flex flex-col group hover:border-bordeaux transition-colors">
                  {partner.sponsored && (
                    <span className="absolute top-4 right-4 text-[0.55rem] uppercase tracking-[0.22em] bg-champagne/90 text-ink px-2 py-1">
                      Sponsored
                    </span>
                  )}
                  <p className="text-[0.62rem] uppercase tracking-[0.24em] text-bordeaux">
                    {partner.pitch}
                  </p>
                  <h3 className="font-serif-display text-2xl text-ink mt-2 leading-tight">
                    {partner.name}
                  </h3>
                  <span className="block w-8 h-px bg-champagne mt-3 mb-5 transition-all duration-500 group-hover:w-16" />

                  <div className="mb-5">
                    <p className="font-serif-display text-3xl text-bordeaux">
                      {partner.highlight}
                    </p>
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft mt-1">
                      {partner.highlightLabel}
                    </p>
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-6">
                    {partner.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-3 text-sm text-ink/75 font-light leading-relaxed"
                      >
                        <span className="mt-2 block w-1 h-1 flex-shrink-0 bg-ink" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noopener sponsored noreferrer"
                    className="block text-center px-4 py-3 border border-ink/20 text-[0.7rem] uppercase tracking-[0.22em] font-medium text-ink hover:bg-ink hover:text-cream hover:border-ink transition-colors"
                  >
                    Visit {partner.name} →
                  </a>
                </article>
              </RevealOnScroll>
            ))}
          </div>

          {/* COMPARISON TABLE */}
          <RevealOnScroll>
            <div className="mt-14 md:mt-20 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-ink/15">
                    <th className="py-4 pr-4 text-[0.62rem] uppercase tracking-[0.24em] text-ink-soft">
                      Partner
                    </th>
                    {product.compareColumns.map((c) => (
                      <th
                        key={c.key}
                        className="py-4 px-4 text-[0.62rem] uppercase tracking-[0.24em] text-ink-soft"
                      >
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {product.partners.map((partner) => (
                    <tr
                      key={partner.id}
                      className="border-b border-ink/8 hover:bg-cream transition-colors"
                    >
                      <td className="py-5 pr-4">
                        <p className="font-serif-display text-lg text-ink leading-tight">
                          {partner.name}
                          {partner.sponsored && (
                            <span className="ml-2 text-[0.55rem] uppercase tracking-[0.2em] bg-champagne/90 text-ink px-1.5 py-0.5 align-middle">
                              Sponsored
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-ink-soft mt-1 font-light">
                          {partner.pitch}
                        </p>
                      </td>
                      {product.compareColumns.map((c) => (
                        <td
                          key={c.key}
                          className="py-5 px-4 text-sm text-ink/80 font-light"
                        >
                          {String(partner[c.key] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24 border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-bordeaux mb-3">
                How it works
              </p>
              <h2 className="font-serif-display text-3xl md:text-5xl text-ink leading-tight">
                Three steps,{" "}
                <span className="italic text-bordeaux">in this order.</span>
              </h2>
            </div>
          </RevealOnScroll>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {product.howItWorks.map((step, i) => (
              <RevealOnScroll key={step.title} delay={i * 120}>
                <li className="relative">
                  <span className="font-serif-display text-7xl md:text-8xl text-champagne/70 leading-none block mb-3">
                    0{i + 1}
                  </span>
                  <span className="block w-10 h-px bg-bordeaux mb-4" />
                  <h3 className="font-serif-display text-xl md:text-2xl text-ink leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-ink-soft font-light leading-relaxed">
                    {step.body}
                  </p>
                </li>
              </RevealOnScroll>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-cream-soft border-b border-ink/10">
        <div className="max-w-3xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center mb-10">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-bordeaux mb-3">
                Common questions
              </p>
              <h2 className="font-serif-display text-3xl md:text-4xl text-ink leading-tight">
                Things people ask us.
              </h2>
            </div>
          </RevealOnScroll>

          <div className="divide-y divide-ink/10 border-t border-b border-ink/10">
            {product.faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                  <h3 className="font-serif-display text-lg md:text-xl text-ink leading-tight pr-4">
                    {faq.q}
                  </h3>
                  <span className="mt-1 text-bordeaux transition-transform duration-300 group-open:rotate-45 text-2xl leading-none flex-shrink-0">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm md:text-base text-ink-soft font-light leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-cream">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.28em] text-champagne mb-4">
            Still unsure?
          </p>
          <h2 className="font-serif-display text-3xl md:text-5xl leading-tight">
            Talk to a planner.{" "}
            <span className="italic text-champagne">No commitment.</span>
          </h2>
          <p className="mt-4 text-cream/70 max-w-xl mx-auto font-light">
            We&rsquo;ll listen to what you&rsquo;re planning, your budget, and
            timeline — then come back with options that actually fit.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <FinanceLeadButton
              topic={enquiryTopic}
              cta="Send an enquiry"
            />
            <Link
              href="/finance"
              className="inline-flex items-center justify-center px-6 py-3 border border-cream/30 text-cream text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:border-champagne hover:text-champagne transition-colors"
            >
              ← Back to finance
            </Link>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <div className="py-8 px-6 text-center bg-cream">
        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-ink-soft max-w-3xl mx-auto leading-relaxed">
          {FINANCE_DISCLAIMER}
        </p>
      </div>
    </main>
  );
}
