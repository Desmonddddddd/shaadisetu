"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Step {
  number: string;
  title: string;
  short: string;
}

const steps: Step[] = [
  {
    number: "I",
    title: "Tell us the moment",
    short: "Pick a function, a city, a date — or just one of the three.",
  },
  {
    number: "II",
    title: "Browse curated vendors",
    short: "Hand-vetted listings. No pay-to-rank. Real reviews from real couples.",
  },
  {
    number: "III",
    title: "Compare & shortlist",
    short: "Save favourites privately. Compare two vendors side-by-side.",
  },
  {
    number: "IV",
    title: "Send the enquiry",
    short: "One form, one inbox. Vendors reply directly to you.",
  },
  {
    number: "V",
    title: "Book with confidence",
    short: "Negotiate, sign, settle. Then leave a review for the next couple.",
  },
];

export default function ShaadiSetuWay() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-cream-soft border-y border-ink/10 relative overflow-hidden"
    >
      {/* Decorative paisley watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <svg viewBox="0 0 200 200" className="w-[600px] h-[600px]" fill="currentColor">
          <path d="M100 20c-30 0-50 20-50 45 0 22 16 38 36 38 18 0 34-12 34-30 0-14-10-24-22-24-10 0-18 6-18 16 0 8 6 14 14 14 6 0 10-3 12-7" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 scroll-reveal">
          <p className="eyebrow">
            <span className="eyebrow-num">02</span>The Method
          </p>
          <h2 className="font-serif-display text-4xl md:text-5xl text-ink mt-4 leading-tight">
            The <em className="italic text-bordeaux">ShaadiSetu</em> way
          </h2>
          <div className="gold-rule w-32 mx-auto mt-6" />
          <p className="mt-6 text-ink-soft text-sm md:text-base font-light max-w-md mx-auto leading-relaxed">
            Five steps from idea to wedding day. Quietly engineered to remove
            the parts you&apos;d rather not handle.
          </p>
        </div>

        {/* Desktop horizontal */}
        <div className="hidden md:block relative">
          {/* Connecting gold line */}
          <div className="absolute top-[34px] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-champagne to-transparent" />

          <div className="grid grid-cols-5 gap-3">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="scroll-reveal relative flex flex-col items-center text-center"
                data-delay={i * 120}
              >
                {/* Roman numeral medallion */}
                <div className="w-[68px] h-[68px] rounded-full bg-cream border border-champagne/60 flex items-center justify-center relative z-10 shadow-[0_2px_12px_-4px_rgba(201,168,106,0.4)] transition-transform duration-500 hover:scale-105">
                  <span className="font-serif-display text-2xl text-bordeaux">
                    {step.number}
                  </span>
                </div>

                {/* Card */}
                <div className="mt-6 px-3">
                  <h3 className="font-serif-display text-lg text-ink leading-snug">
                    {step.title}
                  </h3>
                  <span className="block w-8 h-px bg-champagne mx-auto my-3" />
                  <p className="text-xs text-ink-soft leading-relaxed font-light">
                    {step.short}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden relative">
          <div className="absolute left-[33px] top-3 bottom-3 w-px bg-champagne/40" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="scroll-reveal relative flex items-start gap-5"
                data-delay={i * 100}
              >
                <div className="w-[66px] h-[66px] rounded-full bg-cream border border-champagne/60 flex items-center justify-center relative z-10 flex-shrink-0">
                  <span className="font-serif-display text-2xl text-bordeaux">
                    {step.number}
                  </span>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-serif-display text-lg text-ink leading-snug">
                    {step.title}
                  </h3>
                  <span className="block w-8 h-px bg-champagne my-2" />
                  <p className="text-sm text-ink-soft leading-relaxed font-light">
                    {step.short}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
