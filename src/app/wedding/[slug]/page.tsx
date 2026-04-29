import { notFound } from "next/navigation";
import { getPublicSiteBySlug } from "@/lib/queries/wedding-site";

interface Params { slug: string }

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const site = await getPublicSiteBySlug(slug);
  if (!site) return { title: "Not found | ShaadiSetu" };
  return {
    title: `${site.coupleNames} — ${site.headline} | ShaadiSetu`,
    description: `${site.coupleNames}'s wedding events and venues.`,
  };
}

export default async function PublicWeddingSite({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const site = await getPublicSiteBySlug(slug);
  if (!site) notFound();

  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-ink/10">
        {site.heroImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${site.heroImage}')` }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1606800052052-a08af7148866?w=2400&q=80')",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/45 to-ink/85" />
        <div className="relative max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
          <p className="fade-up text-[0.7rem] uppercase tracking-[0.32em] text-champagne mb-5">
            {site.headline}
          </p>
          <h1 className="fade-up stagger-1 font-serif-display text-5xl md:text-7xl text-cream leading-[1.05]">
            {site.coupleNames}
          </h1>
          <p className="fade-up stagger-2 mt-6 text-cream/70 text-[0.65rem] uppercase tracking-[0.22em]">
            With joy, we invite you to celebrate with us
          </p>
        </div>
      </section>

      {/* EVENTS */}
      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-center font-serif-display text-3xl md:text-4xl text-ink mb-2">
            The celebrations
          </h2>
          <span className="block w-12 h-px bg-champagne mx-auto mb-10" />

          <ul className="space-y-6">
            {site.events.map((ev, i) => (
              <li
                key={`${ev.name}-${i}`}
                className="bg-cream-soft border border-ink/10 p-6 md:p-8 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-5 md:gap-7 fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.22em] text-bordeaux">
                    {new Date(ev.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                    })}
                  </p>
                  <p className="font-serif-display text-2xl text-ink leading-tight mt-1">
                    {new Date(ev.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p className="text-xs text-ink-soft mt-1">
                    {new Date(ev.date).getFullYear()}
                  </p>
                </div>
                <div>
                  <h3 className="font-serif-display text-2xl text-ink leading-tight">
                    {ev.name}
                  </h3>
                  <p className="text-sm text-ink-soft font-light mt-2 leading-relaxed">
                    {ev.venue}
                  </p>
                  {ev.dressCode && (
                    <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft mt-3">
                      Dress code:{" "}
                      <span className="text-ink">{ev.dressCode}</span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-12 text-center text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft">
            With love · {site.coupleNames}
          </p>
        </div>
      </section>
    </main>
  );
}
