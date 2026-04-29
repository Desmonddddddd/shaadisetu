import { DiscoverFlow } from "@/components/discover/DiscoverFlow";

export const metadata = {
  title: "Discover — AI vendor style-match | ShaadiSetu",
  description:
    "Describe your dream wedding vibe in plain English. We'll surface the 6 vendors from our catalogue who match your style.",
};

export default function DiscoverPage() {
  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative border-b border-ink/10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1606800052052-a08af7148866?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink/90" />
        <div className="relative max-w-4xl mx-auto px-6 py-14 md:py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-5 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Discover
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            Describe the vibe.{" "}
            <span className="italic text-champagne">We&apos;ll find the people.</span>
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/80 max-w-2xl mx-auto font-light text-sm md:text-base">
            Type a sentence about your dream wedding. Our AI reads our vendor
            catalogue and ranks the six who fit your style best.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <DiscoverFlow />
        </div>
      </section>
    </main>
  );
}
