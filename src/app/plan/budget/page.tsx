import { getVendorBenchmarks } from "@/lib/queries/benchmarks";
import { BudgetApp } from "./BudgetApp";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Budget Planner — ShaadiSetu",
  description:
    "Allocate your wedding budget across thirteen categories. Track every line item. Compare against real ShaadiSetu vendor benchmarks.",
};

export default async function BudgetPage() {
  const benchmarks = await getVendorBenchmarks();

  return (
    <main className="bg-cream text-ink min-h-screen">
      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/85" />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-5 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Budget Planner
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-5xl text-cream leading-[1.05]">
            Where the money goes. <span className="italic text-champagne">Down to the line item.</span>
          </h1>
          <p className="fade-up stagger-2 mt-4 text-cream/80 max-w-xl mx-auto leading-relaxed font-light text-sm md:text-base">
            Set a total. Allocate across thirteen categories. Track every payment.
            See how your numbers compare against real ShaadiSetu vendors.
          </p>
        </div>
      </section>

      <BudgetApp benchmarks={benchmarks} />
    </main>
  );
}
