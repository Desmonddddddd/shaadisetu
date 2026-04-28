import Link from "next/link";
import { notFound } from "next/navigation";
import { BUDGET_TIERS, getBudgetTierById } from "@/data/budgetTiers";
import { getVendorsForBudgetTier } from "@/lib/queries/curation";
import { VendorEditorialGrid } from "@/components/vendor/VendorEditorialGrid";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";
import { SectionDivider } from "@/components/editorial/SectionDivider";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return BUDGET_TIERS.map((t) => ({ tier: t.id }));
}

const formatINRCompact = (n: number) => {
  if (!Number.isFinite(n)) return "—";
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${Math.round(n / 100_000)} L`;
  if (n >= 1_000) return `₹${Math.round(n / 1_000)}K`;
  return `₹${Math.round(n)}`;
};

interface PageProps {
  params: Promise<{ tier: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { tier: tierId } = await params;
  const tier = getBudgetTierById(tierId);
  if (!tier) return { title: "Budget Tier — ShaadiSetu" };
  return {
    title: `${tier.label} Wedding (${tier.totalLabel}) — ShaadiSetu`,
    description: `${tier.tagline} ${tier.description}`,
  };
}

export default async function BudgetTierPage({ params }: PageProps) {
  const { tier: tierId } = await params;
  const tier = getBudgetTierById(tierId);
  if (!tier) notFound();

  const buckets = await getVendorsForBudgetTier(tier);
  const totalVendors = buckets.reduce((s, b) => s + b.vendors.length, 0);

  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url('${tier.cover}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/85" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <Link
            href="/functions"
            className="inline-block fade-up text-[0.65rem] uppercase tracking-[0.28em] text-champagne hover:text-cream mb-6"
          >
            ← Back to all paths
          </Link>
          <div className="flex items-center justify-center gap-3 mb-6 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              {tier.label} · {tier.totalLabel}
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            {tier.tagline}
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/80 max-w-2xl mx-auto leading-relaxed font-light">
            {tier.description}
          </p>
          <p className="fade-up stagger-3 mt-6 text-[0.7rem] uppercase tracking-[0.22em] text-champagne/90">
            {totalVendors} vendors curated · {buckets.length} categories
          </p>
        </div>
      </section>

      {/* ALLOCATION NOTE */}
      <section className="bg-cream-soft border-b border-ink/10 py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="eyebrow">How we curated</p>
          <p className="mt-3 text-ink-soft text-sm leading-relaxed max-w-2xl mx-auto">
            We split <span className="font-medium text-ink">{formatINRCompact(tier.allocationTotal)}</span> across the
            standard 13-category wedding budget split, then matched each
            category to vendors whose price bands fit the per-category allowance.
          </p>
        </div>
      </section>

      {/* BUCKETS */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6 space-y-20">
          {buckets.length === 0 && (
            <div className="text-center py-20">
              <p className="font-serif-display text-3xl text-ink">
                No matches yet.
              </p>
              <span className="block w-12 h-px bg-champagne mx-auto mt-4" />
              <p className="text-ink-soft mt-4 font-light text-sm">
                The directory is still growing — check back soon.
              </p>
            </div>
          )}

          {buckets.map((b, i) => (
            <div key={b.category.id}>
              <RevealOnScroll>
                <div className="text-center max-w-3xl mx-auto mb-10">
                  <p className="eyebrow">
                    <span className="eyebrow-num">{String(i + 1).padStart(2, "0")}</span>
                    {b.category.label}
                  </p>
                  <h3 className="font-serif-display text-3xl md:text-4xl text-ink mt-3 leading-tight">
                    {b.category.description}
                  </h3>
                  <SectionDivider className="mt-5" />
                  <p className="mt-4 text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft">
                    Per-category allowance · {formatINRCompact(b.perCategoryBudget)} ·
                    {" "}{b.category.defaultPercent}% of total
                  </p>
                </div>
              </RevealOnScroll>

              <VendorEditorialGrid vendors={b.vendors} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink/10 py-16 text-center bg-cream-soft">
        <p className="eyebrow">Want a different price band?</p>
        <h3 className="font-serif-display text-3xl md:text-4xl text-ink mt-3 leading-tight">
          Try another tier.
        </h3>
        <SectionDivider className="mt-5" />
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap px-6">
          {BUDGET_TIERS.filter((t) => t.id !== tier.id).map((t) => (
            <Link
              key={t.id}
              href={`/functions/budget/${t.id}`}
              className="filter-pill"
              data-active="false"
            >
              {t.label} · {t.totalLabel}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
