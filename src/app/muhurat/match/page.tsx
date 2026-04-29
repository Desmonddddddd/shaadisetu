import { KundliMatchForm } from "@/components/astro/KundliMatchForm";

export const metadata = {
  title: "Kundli Matching — Guna Milan | ShaadiSetu Muhurat",
  description:
    "Vedic 36-point Guna Milan compatibility between two birth charts, with plain-English interpretation.",
};

export default function KundliMatchPage() {
  return (
    <main className="bg-cream text-ink">
      <section className="relative border-b border-ink/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518624568264-fda71b8ed8e3?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink/90" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-5 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Guna Milan
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            Match the Kundlis.{" "}
            <span className="italic text-champagne">36 points, the traditional way.</span>
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/80 max-w-2xl mx-auto font-light text-sm md:text-base">
            Enter both birth details. We compute the full Ashtakoota score and,
            after a quick email check, hand you the breakdown plus a written
            interpretation.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <KundliMatchForm />
        </div>
      </section>
    </main>
  );
}
