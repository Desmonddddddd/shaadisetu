import { ChecklistApp } from "./ChecklistApp";

export const metadata = {
  title: "Wedding Checklist — ShaadiSetu",
  description:
    "A timeline-aware wedding checklist with custom tasks, due dates, and notes. Saved privately to your browser.",
};

export default function ChecklistPage() {
  return (
    <main className="bg-cream text-ink min-h-screen">
      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/85" />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-5 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Wedding Checklist
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-5xl text-cream leading-[1.05]">
            The whole list. <span className="italic text-champagne">In your hands.</span>
          </h1>
          <p className="fade-up stagger-2 mt-4 text-cream/80 max-w-xl mx-auto leading-relaxed font-light text-sm md:text-base">
            Everything a real Indian wedding needs, organised by timeline.
            Add your own tasks. Set due dates. Make notes. We never see any of it.
          </p>
        </div>
      </section>

      <ChecklistApp />
    </main>
  );
}
