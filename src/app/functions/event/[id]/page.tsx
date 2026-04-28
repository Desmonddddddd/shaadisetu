import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { WEDDING_EVENTS, getWeddingEventById } from "@/data/weddingEvents";
import { getVendorsForEvent } from "@/lib/queries/curation";
import { VendorEditorialGrid } from "@/components/vendor/VendorEditorialGrid";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";
import { SectionDivider } from "@/components/editorial/SectionDivider";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return WEDDING_EVENTS.map((e) => ({ id: e.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const event = getWeddingEventById(id);
  if (!event) return { title: "Event — ShaadiSetu" };
  return {
    title: `${event.name} Vendors — ShaadiSetu`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = getWeddingEventById(id);
  if (!event) notFound();

  const [buckets, categories] = await Promise.all([
    getVendorsForEvent(event),
    db.category.findMany({ select: { id: true, name: true } }),
  ]);
  const categoryName = (catId: string) =>
    categories.find((c) => c.id === catId)?.name ?? catId;

  const totalVendors = buckets.reduce((s, b) => s + b.vendors.length, 0);
  const primarySet = new Set(event.primaryCategoryIds);

  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url('${event.cover}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/85" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <Link
            href="/functions"
            className="inline-block fade-up text-[0.65rem] uppercase tracking-[0.28em] text-champagne hover:text-cream mb-6"
          >
            ← Back to all events
          </Link>
          <div className="flex items-center justify-center gap-3 mb-6 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              {event.emoji} {event.name}
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            {event.tagline}
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/85 max-w-2xl mx-auto leading-relaxed font-light">
            {event.longDescription}
          </p>
          <p className="fade-up stagger-3 mt-6 text-[0.7rem] uppercase tracking-[0.22em] text-champagne/90">
            {totalVendors} vendors curated · {buckets.length} categories
          </p>
        </div>
      </section>

      {/* QUICK NAV */}
      {buckets.length > 0 && (
        <section className="bg-cream-soft border-b border-ink/10 py-6 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap gap-2 items-center justify-center">
            <span className="text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft mr-2">
              Jump to:
            </span>
            {buckets.map((b) => (
              <a
                key={b.categoryId}
                href={`#cat-${b.categoryId}`}
                className="filter-pill"
                data-active={primarySet.has(b.categoryId) ? "true" : "false"}
              >
                {categoryName(b.categoryId)}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* BUCKETS */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6 space-y-20">
          {buckets.length === 0 && (
            <div className="text-center py-20">
              <p className="font-serif-display text-3xl text-ink">
                No vendors yet for this event.
              </p>
              <span className="block w-12 h-px bg-champagne mx-auto mt-4" />
              <p className="text-ink-soft mt-4 font-light text-sm">
                The directory is still growing.
              </p>
            </div>
          )}

          {buckets.map((b, i) => {
            const isPrimary = primarySet.has(b.categoryId);
            return (
              <div key={b.categoryId} id={`cat-${b.categoryId}`} className="scroll-mt-24">
                <RevealOnScroll>
                  <div className="text-center max-w-3xl mx-auto mb-10">
                    {isPrimary && (
                      <p className="text-[0.62rem] uppercase tracking-[0.28em] text-bordeaux mb-3">
                        ★ Anchor category
                      </p>
                    )}
                    <p className="eyebrow">
                      <span className="eyebrow-num">{String(i + 1).padStart(2, "0")}</span>
                      {categoryName(b.categoryId)}
                    </p>
                    <h3 className="font-serif-display text-3xl md:text-4xl text-ink mt-3 leading-tight">
                      Top {categoryName(b.categoryId).toLowerCase()} for {event.name.toLowerCase()}.
                    </h3>
                    <SectionDivider className="mt-5" />
                  </div>
                </RevealOnScroll>

                <VendorEditorialGrid vendors={b.vendors} />

                <div className="mt-8 text-center">
                  <Link
                    href={`/vendors?category=${encodeURIComponent(b.categoryId)}`}
                    className="text-[0.7rem] uppercase tracking-[0.22em] text-bordeaux editorial-link"
                  >
                    Browse all {categoryName(b.categoryId).toLowerCase()} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* OTHER EVENTS */}
      <section className="border-t border-ink/10 bg-cream-soft py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="eyebrow">Continue planning</p>
          <h3 className="font-serif-display text-3xl md:text-4xl text-ink mt-3 leading-tight">
            Every wedding has more than one moment.
          </h3>
          <SectionDivider className="mt-5" />
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            {WEDDING_EVENTS.filter((e) => e.id !== event.id).slice(0, 6).map((e) => (
              <Link
                key={e.id}
                href={`/functions/event/${e.id}`}
                className="filter-pill"
                data-active="false"
              >
                {e.emoji} {e.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
