import Link from "next/link";
import { notFound } from "next/navigation";
import { STORIES, getStoryBySlug } from "@/lib/stories-data";
import { VendorCredits } from "@/components/stories/VendorCredits";

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return { title: "Story not found | ShaadiSetu" };
  return {
    title: `${story.coupleNames} — ${story.location} | ShaadiSetu Stories`,
    description: story.summary,
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const date = new Date(story.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const paragraphs = story.body.split(/\n\n+/);

  return (
    <main className="bg-cream text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${story.coverImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/40 to-ink/85" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-32 text-center">
          <p className="fade-up text-[0.65rem] uppercase tracking-[0.32em] text-champagne mb-4">
            {story.location}
          </p>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl lg:text-7xl text-cream leading-[1.05]">
            {story.coupleNames}
          </h1>
          <p className="fade-up stagger-2 mt-5 text-cream/85 font-light max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            {story.summary}
          </p>
          <div className="fade-up stagger-3 mt-7 flex items-center justify-center gap-3 text-[0.62rem] uppercase tracking-[0.22em] text-cream/70">
            <span>{date}</span>
            <span className="text-cream/30">·</span>
            <span>{story.ceremonyTypes.join(" · ")}</span>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`text-base md:text-lg text-ink-soft leading-relaxed font-light ${
                i === 0 ? "first-letter:font-serif-display first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85] first-letter:text-bordeaux" : ""
              }`}
            >
              {p}
            </p>
          ))}
        </div>

        {/* GALLERY */}
        {story.gallery.length > 0 && (
          <div className="max-w-5xl mx-auto px-6 mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-3">
            {story.gallery.map((src, i) => (
              <div
                key={src + i}
                className={`relative overflow-hidden ${
                  i === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* CREDITS */}
        <div className="max-w-4xl mx-auto px-6 mt-14 md:mt-20">
          <VendorCredits credits={story.vendorCredits} />
        </div>

        {/* BACK */}
        <div className="max-w-3xl mx-auto px-6 mt-12 text-center">
          <Link
            href="/stories"
            className="text-[0.7rem] uppercase tracking-[0.22em] text-bordeaux hover:text-ink transition-colors"
          >
            ← All wedding stories
          </Link>
        </div>
      </section>
    </main>
  );
}
