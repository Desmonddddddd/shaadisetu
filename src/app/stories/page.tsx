import { STORIES } from "@/lib/stories-data";
import { StoryCard } from "@/components/stories/StoryCard";

export const metadata = {
  title: "Real Wedding Stories | ShaadiSetu",
  description:
    "Honest, long-form wedding stories from real couples — with full vendor credits, location, and the things that actually went well or sideways.",
};

export default function StoriesIndexPage() {
  const stories = [...STORIES].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative border-b border-ink/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink/90" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-5 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Real Weddings
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            Stories from couples.{" "}
            <span className="italic text-champagne">Vendors credited.</span>
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/80 max-w-2xl mx-auto font-light text-sm md:text-base">
            Long-form weddings, written like the couple lived them. Use the
            credits at the bottom of every story to find the photographers,
            venues and decorators who actually pulled it off.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stories.map((story, i) => (
              <StoryCard key={story.slug} story={story} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
