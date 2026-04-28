import Link from "next/link";

// Shared chrome for /privacy, /terms, /cookies, /refund. The body content
// lives in each page so the prose can be edited without touching layout.

interface Props {
  eyebrow: string;
  title: string;
  italicWord: string;
  intro: string;
  updatedOn: string;
  children: React.ReactNode;
}

const SIBLINGS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
  { label: "Refunds", href: "/refund" },
];

export default function LegalPage({
  eyebrow,
  title,
  italicWord,
  intro,
  updatedOn,
  children,
}: Props) {
  return (
    <main className="bg-cream text-ink">
      {/* Header */}
      <section className="border-b border-ink/10 bg-cream-soft">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-bordeaux">
              {eyebrow}
            </p>
          </div>
          <h1 className="font-serif-display text-4xl md:text-6xl text-ink leading-[1.05]">
            {title}{" "}
            <span className="italic text-bordeaux">{italicWord}</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-ink-soft font-light leading-relaxed max-w-xl">
            {intro}
          </p>
          <p className="mt-8 text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft/70">
            Last updated: {updatedOn}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <article className="prose-legal">{children}</article>

          {/* Sibling links */}
          <div className="mt-20 pt-10 border-t border-ink/10">
            <p className="text-[0.7rem] uppercase tracking-[0.28em] text-ink-soft mb-5">
              Related
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {SIBLINGS.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-sm text-ink hover:text-bordeaux transition-colors editorial-link"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/about"
                  className="text-sm text-ink hover:text-bordeaux transition-colors editorial-link"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact footer */}
          <div className="mt-10 p-6 bg-cream-soft border-l-2 border-champagne">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-bordeaux mb-2">
              Questions?
            </p>
            <p className="text-sm text-ink-soft font-light leading-relaxed">
              Write to{" "}
              <a
                href="mailto:hello@shaadisetu.com"
                className="text-bordeaux hover:text-ink transition-colors underline underline-offset-2"
              >
                hello@shaadisetu.com
              </a>{" "}
              and a real person will reply within 48 hours.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

// Helpers for body content. These set typography that matches the editorial
// system without pulling in @tailwindcss/typography.

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="font-serif-display text-2xl md:text-3xl text-ink leading-tight">
        {title}
      </h2>
      <span className="block w-10 h-px bg-champagne mt-3 mb-5" />
      <div className="space-y-4 text-base text-ink/85 font-light leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-3 text-base text-ink/85 font-light leading-relaxed"
        >
          <span className="mt-2.5 block w-1.5 h-1.5 flex-shrink-0 bg-bordeaux" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 p-5 bg-cream-soft border-l-2 border-bordeaux">
      <p className="text-sm text-ink/80 font-light leading-relaxed">
        {children}
      </p>
    </div>
  );
}
