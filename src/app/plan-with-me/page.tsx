import { db } from "@/lib/db";
import { ConciergeJourney } from "@/components/concierge/ConciergeJourney";
import { SectionDivider } from "@/components/editorial/SectionDivider";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Plan With Me — ShaadiSetu",
  description:
    "Sit with a planner for three minutes. Six questions, one fully-built plan — vendor names, rupee allocations, ceremony picks.",
};

export default async function PlanWithMePage() {
  const cities = await db.city.findMany({
    select: { id: true, name: true, state: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="bg-cream text-ink min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink/85" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Plan With Me
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            A planner&apos;s ear. <span className="italic text-champagne">For three minutes.</span>
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/80 max-w-2xl mx-auto leading-relaxed font-light text-sm md:text-base">
            Six honest questions, one curated plan. Vendor names, rupee
            allocations, ceremony-by-ceremony picks. Saved to your browser only.
          </p>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <ConciergeJourney cities={cities} />
        </div>
      </section>

      {/* TRUST FOOTER */}
      <section className="border-t border-ink/10 bg-cream-soft py-14 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="eyebrow">A note about privacy</p>
          <SectionDivider className="mt-4" />
          <p className="mt-4 text-sm text-ink-soft font-light leading-relaxed">
            We don&apos;t collect your answers. Nothing leaves your browser
            except the request to fetch matching vendors — and even that doesn&apos;t
            include your guest count or budget on our servers. The plan you see
            is yours to keep.
          </p>
        </div>
      </section>
    </main>
  );
}
