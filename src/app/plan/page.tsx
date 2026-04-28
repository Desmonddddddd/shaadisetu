import Link from "next/link";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";
import { SectionDivider } from "@/components/editorial/SectionDivider";
import { FadeOnScroll } from "@/components/editorial/FadeOnScroll";

export const metadata = {
  title: "Planning Tools — ShaadiSetu",
  description:
    "Two quiet tools for the loudest year of your life: a wedding checklist and a budget planner that work the way real couples plan.",
};

export default function PlanHubPage() {
  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1606800052052-a08af7148866?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/85" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              The Planning Desk
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            Two tools. <span className="italic text-champagne">One calmer year.</span>
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/80 max-w-xl mx-auto leading-relaxed font-light">
            A wedding checklist that respects your timeline. A budget planner
            that respects your money. Both saved privately to your browser —
            no account, no email, no ads.
          </p>
        </div>
      </section>

      {/* TOOLS */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto">
              <p className="eyebrow"><span className="eyebrow-num">01</span>The Tools</p>
              <h2 className="font-serif-display text-3xl md:text-4xl text-ink mt-4 leading-tight">
                Pick what you need today.
              </h2>
              <SectionDivider className="mt-6" />
            </div>
          </RevealOnScroll>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeOnScroll>
              <ToolCard
                href="/plan/checklist"
                eyebrow="Tool One"
                title="Wedding Checklist"
                excerpt="A timeline-aware checklist organised from twelve months out to the morning after. Add custom tasks, set due dates, jot notes. Everything stays in your browser."
                tags={["Custom tasks", "Due dates", "Notes", "Filter & sort"]}
                cover="https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=1600&q=80"
                emoji="📋"
              />
            </FadeOnScroll>
            <FadeOnScroll delay={120}>
              <ToolCard
                href="/plan/budget"
                eyebrow="Tool Two"
                title="Budget Planner"
                excerpt="Set a total budget. Allocate across thirteen wedding categories. Track every line item. Compare your numbers against real ShaadiSetu vendor benchmarks."
                tags={["Allocation sliders", "Line items", "Donut visual", "Vendor benchmarks"]}
                cover="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80"
                emoji="💰"
              />
            </FadeOnScroll>
          </div>
        </div>
      </section>

      {/* PRIVACY NOTE */}
      <section className="bg-cream-soft border-y border-ink/10 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <RevealOnScroll>
            <p className="eyebrow"><span className="eyebrow-num">02</span>How it works</p>
            <h3 className="font-serif-display text-3xl md:text-4xl text-ink mt-4 leading-tight">
              Saved here. Never sent.
            </h3>
            <SectionDivider className="mt-6" />
            <p className="mt-6 text-ink-soft font-light leading-relaxed">
              Both tools save to your browser&apos;s local storage. We never see
              your tasks, your budget, or your numbers. Clear your browser data
              and they&apos;re gone — that is the whole privacy model.
            </p>
            <p className="mt-3 text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft/70">
              Use the same browser to find your work later.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <RevealOnScroll>
            <h3 className="font-serif-display text-3xl md:text-4xl text-ink leading-tight">
              Ready when you are.
            </h3>
            <SectionDivider className="mt-6" />
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Link href="/plan/checklist" className="btn-editorial">
                Open Checklist
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

function ToolCard({
  href,
  eyebrow,
  title,
  excerpt,
  tags,
  cover,
  emoji,
}: {
  href: string;
  eyebrow: string;
  title: string;
  excerpt: string;
  tags: string[];
  cover: string;
  emoji: string;
}) {
  return (
    <Link href={href} className="group block h-full">
      <article className="editorial-card h-full overflow-hidden flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" decoding="async"
            src={cover}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-transparent" />
          <span className="absolute top-4 left-4 text-3xl drop-shadow">{emoji}</span>
          <span className="absolute top-4 right-4 text-[0.62rem] uppercase tracking-[0.22em] px-2 py-1 bg-cream/95 text-bordeaux">
            {eyebrow}
          </span>
        </div>

        <div className="p-7 flex flex-col gap-4 flex-1">
          <h3 className="font-serif-display text-2xl md:text-[1.7rem] text-ink leading-snug group-hover:text-bordeaux transition-colors">
            {title}
          </h3>
          <span className="block w-10 h-px bg-champagne transition-all duration-500 group-hover:w-20" />
          <p className="text-ink-soft leading-relaxed font-light text-sm">
            {excerpt}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-3 mt-auto border-t border-ink/8">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft/80 px-2 py-1 border border-ink/10"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[0.7rem] uppercase tracking-[0.22em] text-bordeaux editorial-link self-start">
            Open the tool →
          </p>
        </div>
      </article>
    </Link>
  );
}
