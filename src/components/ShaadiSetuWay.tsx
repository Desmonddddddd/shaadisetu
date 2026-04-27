"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    number: "01",
    title: "Choose Your Function",
    short: "Haldi, Mehendi, Sangeet, Wedding Day, or Reception.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Select Your City",
    short: "500+ cities across India.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Browse Vendors",
    short: "Portfolios, pricing & reviews.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Compare & Shortlist",
    short: "Shortlist favourites & compare.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Book with Confidence",
    short: "Connect, negotiate & book.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

export default function ShaadiSetuWay() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-shaadi-warm-gray overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14 scroll-reveal">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-shaadi-rose mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-cormorant)] text-slate-900">
            The{" "}
            <span className="bg-gradient-to-r from-shaadi-red to-shaadi-rose bg-clip-text text-transparent">
              ShaadiSetu
            </span>{" "}
            Way
          </h2>
          <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto">
            Your dream wedding in 5 simple steps
          </p>
        </div>

        {/* Horizontal flowchart — desktop */}
        <div className="hidden md:block relative">
          {/* Connecting line */}
          <div className="absolute top-7 left-[10%] right-[10%] h-px bg-gradient-to-r from-shaadi-red/30 via-shaadi-rose/30 to-shaadi-pink/30" />

          <div className="grid grid-cols-5 gap-4">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="scroll-reveal relative flex flex-col items-center"
                data-delay={i * 100}
              >
                {/* Numbered circle */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-shaadi-red to-shaadi-pink flex items-center justify-center text-white text-xs font-bold tracking-wider shadow-lg ring-4 ring-shaadi-warm-gray relative z-10">
                  {step.number}
                </div>

                {/* Arrow */}
                {i < steps.length - 1 && (
                  <div className="absolute top-6 -right-1 z-20 text-shaadi-rose/30">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}

                {/* Card */}
                <div className="mt-5 bg-white rounded-xl border border-gray-100 p-5 card-hover text-center w-full">
                  <div className="flex items-center justify-center gap-1.5 mb-2.5 text-shaadi-rose">
                    {step.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    {step.short}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical flowchart — mobile */}
        <div className="md:hidden relative">
          <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-shaadi-red/30 via-shaadi-rose/30 to-shaadi-pink/30" />

          <div className="space-y-6">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="scroll-reveal relative flex items-start gap-5"
                data-delay={i * 80}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-shaadi-red to-shaadi-pink flex items-center justify-center text-white text-xs font-bold tracking-wider shadow-lg ring-4 ring-shaadi-warm-gray relative z-10 flex-shrink-0">
                  {step.number}
                </div>

                <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 card-hover">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-shaadi-rose">{step.icon}</span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.short}
                  </p>
                </div>

                {i < steps.length - 1 && (
                  <div className="absolute left-[22px] -bottom-4 z-20 text-shaadi-rose/30">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
