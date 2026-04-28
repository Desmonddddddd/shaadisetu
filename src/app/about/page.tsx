import Link from "next/link";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";
import { SectionDivider } from "@/components/editorial/SectionDivider";

export const metadata = {
  title: "About Us — ShaadiSetu",
  description:
    "ShaadiSetu is India's editorial wedding marketplace — a curated bridge between couples and the country's finest artisans. Founded by Atishey Jain.",
};

export default function AboutPage() {
  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/85" />
        <div className="relative max-w-5xl mx-auto px-6 py-32 md:py-44 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              About the House
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="font-serif-display text-5xl md:text-7xl text-cream leading-[1.05]">
            A wedding deserves more
            <br />
            <span className="italic text-champagne">than a search bar.</span>
          </h1>
          <p className="mt-8 text-base md:text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed font-light">
            ShaadiSetu is India&apos;s editorial wedding marketplace — a curated
            bridge between two of life&apos;s most consequential strangers: a
            couple, and the artisans who will shape their most important day.
          </p>
        </div>
      </section>

      {/* INTRO PROSE */}
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <RevealOnScroll>
            <p className="eyebrow text-center block">
              <span className="eyebrow-num">01</span>The Premise
            </p>
            <h2 className="font-serif-display text-4xl md:text-5xl text-ink mt-4 text-center leading-tight">
              The Indian wedding industry is{" "}
              <span className="italic text-bordeaux">$130 billion</span> of
              chaos.
            </h2>
            <SectionDivider className="mt-8" />
            <div className="mt-12 space-y-6 text-ink-soft text-lg leading-relaxed font-light">
              <p>
                Every year, more than ten million Indian couples plan a wedding.
                And every year, almost all of them do it the same way their
                parents did: through a tangled web of WhatsApp forwards, cousin
                recommendations, and Instagram DMs at 2 a.m.
              </p>
              <p>
                The result is predictable. Couples overpay. Vendors over-promise.
                Trust is replaced by anxiety. The day that should be
                effortless ends up requiring a project manager, a small army of
                aunties, and a great deal of luck.
              </p>
              <p className="text-ink font-normal">
                ShaadiSetu was built to replace luck with a system — and a
                system with taste.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="bg-ink text-cream py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-12 md:gap-20 items-center">
          <RevealOnScroll>
            <div className="relative aspect-[4/5] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&q=80')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[0.7rem] tracking-[0.28em] uppercase text-champagne mb-2">
                  Founder & CEO
                </p>
                <p className="font-serif-display text-3xl text-cream">
                  Atishey Jain
                </p>
                <span className="block w-12 h-px bg-champagne mt-3" />
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={120}>
            <p className="eyebrow text-champagne">
              <span className="eyebrow-num text-champagne-soft">02</span>The Founder
            </p>
            <h2 className="font-serif-display text-4xl md:text-5xl mt-4 leading-tight">
              From an over-budget cousin&apos;s wedding to a{" "}
              <span className="italic text-champagne">national platform.</span>
            </h2>
            <span className="block w-16 h-px bg-champagne mt-6" />
            <div className="mt-8 space-y-5 text-cream/85 leading-relaxed font-light">
              <p>
                Atishey Jain grew up watching his mother run weddings the way a
                general runs a campaign — folder by folder, vendor by vendor,
                worry by worry. The problem wasn&apos;t that good people
                didn&apos;t exist. It was that finding them, vetting them, and
                trusting them was a job nobody wanted but everyone got.
              </p>
              <p>
                After years working in product and operations across consumer
                technology — and after watching one too many friends overpay
                for a photographer who ghosted on the morning of — he decided
                the Indian wedding deserved the same rigour any other ten-million
                household decision deserves: real reviews, fair prices, verified
                vendors, and a single place to bring it all together.
              </p>
              <p>
                He founded ShaadiSetu in <span className="text-champagne">2026</span> with one
                conviction: India&apos;s wedding industry doesn&apos;t need
                another marketplace. It needs an editor.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center">
              <p className="eyebrow"><span className="eyebrow-num">03</span>Why This, Why Now</p>
              <h2 className="font-serif-display text-4xl md:text-5xl text-ink mt-4 leading-tight">
                The problem with how India weds.
              </h2>
              <SectionDivider className="mt-8" />
            </div>
          </RevealOnScroll>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-champagne/30">
            {[
              {
                num: "₹38L",
                label: "Average urban Indian wedding spend",
                copy: "Most of it allocated under panic and pressure, not plan.",
              },
              {
                num: "47%",
                label: "Couples who report being overcharged",
                copy: "Pricing in this industry is a rumour, not a number.",
              },
              {
                num: "1 in 3",
                label: "Vendors that go quiet within 30 days of booking",
                copy: "Reliability is the silent crisis nobody publishes.",
              },
            ].map((s, i) => (
              <RevealOnScroll key={i} delay={i * 100} className="bg-cream">
                <div className="p-10 text-center">
                  <p className="font-serif-display text-5xl text-bordeaux">{s.num}</p>
                  <span className="block w-10 h-px bg-champagne mx-auto my-4" />
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft mb-3">
                    {s.label}
                  </p>
                  <p className="text-sm text-ink-soft/80 leading-relaxed font-light">
                    {s.copy}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll>
            <p className="text-center mt-12 max-w-2xl mx-auto text-ink-soft leading-relaxed font-light">
              We didn&apos;t build ShaadiSetu to make weddings cheaper. We
              built it to make them <span className="italic text-bordeaux">honest</span>.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* USP */}
      <section className="bg-cream-soft py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center">
              <p className="eyebrow"><span className="eyebrow-num">04</span>Why ShaadiSetu</p>
              <h2 className="font-serif-display text-4xl md:text-5xl text-ink mt-4 leading-tight">
                Five reasons couples choose us.
              </h2>
              <SectionDivider className="mt-8" />
            </div>
          </RevealOnScroll>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Curated, not crawled.",
                copy: "Every vendor on ShaadiSetu is hand-vetted. We turn down more applications than we accept.",
              },
              {
                title: "Editorial, not algorithmic.",
                copy: "Our recommendations come from taste and trust, not from who paid for the placement.",
              },
              {
                title: "Pricing without panic.",
                copy: "Real packages, real ranges. No more &lsquo;DM for price&rsquo; — couples deserve clarity.",
              },
              {
                title: "Verified availability.",
                copy: "Calendar sync means the vendor you fell in love with at 11 p.m. is still available at 9 a.m.",
              },
              {
                title: "Built for India, not bolted on.",
                copy: "Regional vendors, regional cuisines, regional rituals. Mumbai isn&apos;t Madurai isn&apos;t Manali.",
              },
              {
                title: "Founder&apos;s line.",
                copy: "Stuck on something? Atishey personally reads every couple&apos;s escalated message. That&apos;s rare. We mean it.",
              },
            ].map((u, i) => (
              <RevealOnScroll key={i} delay={i * 60}>
                <div className="editorial-card p-8 h-full">
                  <p className="font-serif-display text-2xl text-ink leading-tight">
                    {u.title}
                  </p>
                  <span className="block w-8 h-px bg-champagne my-4" />
                  <p
                    className="text-ink-soft leading-relaxed font-light"
                    dangerouslySetInnerHTML={{ __html: u.copy }}
                  />
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE CURATE */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center">
              <p className="eyebrow"><span className="eyebrow-num">05</span>The Process</p>
              <h2 className="font-serif-display text-4xl md:text-5xl text-ink mt-4 leading-tight">
                How we choose who appears on ShaadiSetu.
              </h2>
              <SectionDivider className="mt-8" />
            </div>
          </RevealOnScroll>

          <div className="mt-16 space-y-10">
            {[
              {
                step: "I",
                title: "Application",
                copy: "Vendors apply with portfolio, references, and at least three years of operating history. The bar is high on purpose.",
              },
              {
                step: "II",
                title: "Reference review",
                copy: "We speak to two recent clients per vendor. Word-of-mouth is the oldest review system in India — we still use it.",
              },
              {
                step: "III",
                title: "On-ground visit",
                copy: "For studios, venues, and ateliers — a city lead visits in person. No exceptions. A photo of a sample sari isn&apos;t a sari.",
              },
              {
                step: "IV",
                title: "Pricing audit",
                copy: "Vendors publish real packages with real numbers. No hidden tiers, no &lsquo;ask for festival pricing&rsquo;.",
              },
              {
                step: "V",
                title: "Continuous review",
                copy: "Every six months, every vendor is re-graded against incoming reviews and response times. Standards don&apos;t expire.",
              },
            ].map((s, i) => (
              <RevealOnScroll key={i} delay={i * 80}>
                <div className="flex gap-8">
                  <p className="font-serif-display text-3xl text-champagne shrink-0 w-10">
                    {s.step}
                  </p>
                  <div>
                    <p className="font-serif-display text-2xl text-ink leading-tight">
                      {s.title}
                    </p>
                    <span className="block w-8 h-px bg-champagne my-3" />
                    <p
                      className="text-ink-soft leading-relaxed font-light"
                      dangerouslySetInnerHTML={{ __html: s.copy }}
                    />
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-bordeaux text-cream py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center">
              <p className="eyebrow text-champagne"><span className="eyebrow-num text-champagne-soft">06</span>Our Values</p>
              <h2 className="font-serif-display text-4xl md:text-5xl mt-4 leading-tight">
                Six promises, in writing.
              </h2>
              <div className="flex items-center justify-center gap-3 mt-6">
                <span className="block w-16 h-px bg-champagne" />
                <span className="text-champagne text-sm">◆</span>
                <span className="block w-16 h-px bg-champagne" />
              </div>
            </div>
          </RevealOnScroll>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              ["Taste before traffic.", "We will turn down ad budgets before we&apos;ll turn down our judgment."],
              ["Couples first, always.", "If a vendor and a couple disagree, we side with the people getting married. Quietly. Firmly."],
              ["Transparent pricing.", "Every rupee a couple pays a vendor is a rupee they consciously chose to pay."],
              ["Vendor dignity.", "Our vendors are artisans, not inventory. They are paid on time, every time."],
              ["Privacy as default.", "Your guest list, your budget, your fights with the in-laws — none of it leaves our servers."],
              ["Local before scale.", "We grow city by city, not by press release. Lucknow gets the same care as Mumbai."],
            ].map(([title, copy], i) => (
              <RevealOnScroll key={title} delay={i * 60}>
                <div>
                  <p className="font-serif-display text-2xl text-champagne leading-tight">
                    {title}
                  </p>
                  <span className="block w-8 h-px bg-champagne my-3" />
                  <p
                    className="text-cream/80 leading-relaxed font-light"
                    dangerouslySetInnerHTML={{ __html: copy }}
                  />
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* MILESTONES */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center">
              <p className="eyebrow"><span className="eyebrow-num">07</span>The Story So Far</p>
              <h2 className="font-serif-display text-4xl md:text-5xl text-ink mt-4 leading-tight">
                Milestones.
              </h2>
              <SectionDivider className="mt-8" />
            </div>
          </RevealOnScroll>

          <div className="mt-16 relative">
            <span className="absolute left-[88px] top-2 bottom-2 w-px bg-champagne/40 hidden md:block" />
            {[
              { year: "2026 · Q1", title: "Founded in Mumbai", copy: "Atishey Jain incorporates ShaadiSetu Atelier Pvt. Ltd. with a team of three." },
              { year: "2026 · Q2", title: "First 100 vendors", copy: "Photography, decor, attire and venues across Mumbai, Delhi, and Bengaluru." },
              { year: "2026 · Q3", title: "Editorial launch", copy: "Public beta with the editorial visual identity, full-text search, and verified profiles." },
              { year: "Coming", title: "Pan-India by 2027", copy: "Twenty-five cities, two thousand vetted vendors, one platform." },
            ].map((m, i) => (
              <RevealOnScroll key={i} delay={i * 100}>
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12 py-8 border-b border-ink/10 last:border-b-0">
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-bordeaux font-semibold pt-1">
                    {m.year}
                  </p>
                  <div>
                    <p className="font-serif-display text-2xl text-ink leading-tight">
                      {m.title}
                    </p>
                    <p className="mt-2 text-ink-soft leading-relaxed font-light">
                      {m.copy}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER PULL QUOTE */}
      <section className="bg-cream-soft py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <RevealOnScroll>
            <p className="text-champagne text-3xl mb-6">&ldquo;</p>
            <p className="font-serif-display text-3xl md:text-4xl text-ink leading-snug italic">
              The Indian wedding is the most ambitious thing most families will
              ever attempt. It deserves a platform built with the same
              ambition.
            </p>
            <SectionDivider className="mt-10" />
            <p className="text-[0.7rem] tracking-[0.28em] uppercase text-ink-soft mt-6">
              — Atishey Jain, Founder
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <RevealOnScroll>
            <p className="eyebrow"><span className="eyebrow-num">08</span>Begin</p>
            <h2 className="font-serif-display text-4xl md:text-6xl text-ink mt-4 leading-tight">
              Plan your wedding with{" "}
              <span className="italic text-bordeaux">intention.</span>
            </h2>
            <SectionDivider className="mt-8" />
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/vendors" className="btn-editorial">
                Browse Vendors
              </Link>
              <Link href="/account/signup" className="btn-editorial-ghost">
                Create Your Account
              </Link>
            </div>
            <p className="mt-12 text-sm text-ink-soft font-light">
              Press, partnership, or simply hello —{" "}
              <a
                href="mailto:hello@shaadisetu.com"
                className="editorial-link text-bordeaux"
              >
                hello@shaadisetu.com
              </a>
            </p>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
