import Link from "next/link";
import type { Story } from "@/lib/stories-data";

export function StoryCard({ story, index }: { story: Story; index: number }) {
  const stagger = `stagger-${Math.min((index % 8) + 1, 8)}`;
  const date = new Date(story.publishedAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/stories/${story.slug}`}
      className={`group block fade-up ${stagger}`}
    >
      <article className="bg-cream border border-ink/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_14px_30px_-18px_rgba(0,0,0,0.25)] flex flex-col h-full overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.coverImage}
            alt={`${story.coupleNames} — ${story.location}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
          <p className="absolute top-3 left-4 text-[0.6rem] uppercase tracking-[0.24em] text-cream/90">
            {story.location}
          </p>
        </div>
        <div className="p-5 flex flex-col gap-3 flex-1">
          <h3 className="font-serif-display text-2xl text-ink leading-tight transition-colors group-hover:text-bordeaux">
            {story.coupleNames}
          </h3>
          <span className="block w-8 h-px bg-champagne transition-all duration-500 group-hover:w-16" />
          <p className="text-sm text-ink-soft font-light leading-relaxed line-clamp-3">
            {story.summary}
          </p>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-ink/8 text-[0.62rem] uppercase tracking-[0.18em]">
            <span className="text-ink-soft/70">{date}</span>
            <span className="text-bordeaux">Read story →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
