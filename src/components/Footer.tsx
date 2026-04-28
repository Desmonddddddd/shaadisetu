import Link from "next/link";

const COLUMNS = [
  {
    heading: "Plan",
    links: [
      { label: "All Categories", href: "/categories" },
      { label: "Browse Vendors", href: "/vendors" },
      { label: "Plan With Me", href: "/plan-with-me" },
      { label: "Wedding Functions", href: "/functions" },
      { label: "Client Diaries", href: "/client-diaries" },
    ],
  },
  {
    heading: "Vendors",
    links: [
      { label: "List Your Business", href: "/vendor/signup" },
      { label: "Vendor Sign In", href: "/vendor/login" },
      { label: "Vendor Dashboard", href: "/vendor/dashboard" },
      { label: "Pro Membership", href: "/membership" },
      { label: "Pricing", href: "/membership" },
    ],
  },
  {
    heading: "Couples",
    links: [
      { label: "Create Account", href: "/account/signup" },
      { label: "Sign In", href: "/account/login" },
      { label: "Saved Vendors", href: "/account/saved" },
      { label: "Your Enquiries", href: "/account/enquiries" },
      { label: "Concierge", href: "/plan-with-me" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Manifesto", href: "/about" },
      { label: "Careers", href: "/about" },
      { label: "Press", href: "/about" },
      { label: "Contact", href: "/about" },
    ],
  },
];

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/85">
      {/* Champagne hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-champagne to-transparent" />

      {/* Stat banner */}
      <div className="border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat value="18" label="Categories" />
          <Stat value="500+" label="Verified Vendors" />
          <Stat value="12" label="Cities Covered" />
          <Stat value="4.9" label="Average Rating" />
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand block */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block group">
              <span className="font-serif-display text-4xl tracking-tight text-cream">
                Shaadi<span className="text-champagne">Setu</span>
              </span>
              <span className="block h-px w-0 group-hover:w-full bg-champagne transition-all duration-500" />
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-cream/65 font-light max-w-sm">
              An editorial wedding directory built for India. Hand-curated
              vendors, no inflated reviews, no pay-to-win listings — just the
              right pros for the day that actually matters.
            </p>

            {/* Contact details */}
            <div className="mt-8 space-y-3 text-sm font-light">
              <ContactRow
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-4 h-4">
                    <path d="M3 7l9 6 9-6M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7l2-2h14l2 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
                label="hello@shaadisetu.com"
                href="mailto:hello@shaadisetu.com"
              />
              <ContactRow
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-4 h-4">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
                label="+91 80000 12345"
                href="tel:+918000012345"
              />
              <ContactRow
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-4 h-4">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                }
                label="Mumbai · Delhi · Bengaluru"
              />
            </div>

            {/* Social */}
            <div className="mt-8 flex items-center gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center border border-cream/20 hover:border-champagne hover:bg-champagne hover:text-ink transition-colors"
                >
                  <SocialIcon name={s.label} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-champagne mb-5">
                  {col.heading}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-cream/70 hover:text-cream transition-colors editorial-link"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter strip */}
        <div className="mt-16 pt-10 border-t border-cream/10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-champagne mb-3">
              The Letter
            </p>
            <h4 className="font-serif-display text-2xl md:text-3xl text-cream leading-tight">
              Vendor finds and planning notes,{" "}
              <span className="italic text-champagne">once a month.</span>
            </h4>
            <p className="mt-2 text-sm text-cream/60 font-light">
              No spam. Unsubscribe in one click.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-3" action="#" method="post">
            <input
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              className="flex-1 bg-transparent border border-cream/25 px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-champagne transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 text-[0.72rem] uppercase tracking-[0.22em] font-medium bg-champagne text-ink hover:bg-cream transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Curated-request strip */}
        <div className="mt-14 pt-10 border-t border-cream/10">
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-champagne mb-3">
            Looking for something specific?
          </p>
          <p className="text-sm md:text-base text-cream/75 font-light leading-relaxed max-w-2xl">
            Need something specially curated for you that isn&rsquo;t mentioned
            here? Send us an email at{" "}
            <a
              href="mailto:hello@shaadisetu.com"
              className="text-champagne hover:text-cream editorial-link"
            >
              hello@shaadisetu.com
            </a>{" "}
            and we&rsquo;ll put together a shortlist by hand.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/50 font-light tracking-wide">
            &copy; {new Date().getFullYear()} ShaadiSetu Media Pvt. Ltd. — Made
            with care in India.
          </p>
          <div className="flex items-center gap-6 text-xs text-cream/50">
            <Link href="/about" className="hover:text-champagne transition-colors">
              Privacy
            </Link>
            <span className="block w-px h-3 bg-cream/15" />
            <Link href="/about" className="hover:text-champagne transition-colors">
              Terms
            </Link>
            <span className="block w-px h-3 bg-cream/15" />
            <Link href="/about" className="hover:text-champagne transition-colors">
              Refund Policy
            </Link>
            <span className="block w-px h-3 bg-cream/15" />
            <Link href="/about" className="hover:text-champagne transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-serif-display text-3xl md:text-4xl text-champagne">
        {value}
      </p>
      <span className="block w-6 h-px bg-cream/30 mx-auto my-2" />
      <p className="text-[0.62rem] uppercase tracking-[0.22em] text-cream/55">
        {label}
      </p>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
}) {
  const inner = (
    <span className="flex items-center gap-3 text-cream/70 hover:text-champagne transition-colors">
      <span className="text-champagne">{icon}</span>
      {label}
    </span>
  );
  return href ? <a href={href}>{inner}</a> : <div>{inner}</div>;
}

function SocialIcon({ name }: { name: string }) {
  const common = "w-4 h-4";
  if (name === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
      </svg>
    );
  }
  if (name === "Pinterest") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M11 8c2 0 4 1.5 4 4s-2 4-3.5 4c-1 0-1.5-.5-1.5-.5L9 21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={common}>
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <path d="M10 9l5 3-5 3V9Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  // LinkedIn
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={common}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 1 1 4 0v4M11 13v4" strokeLinecap="round" />
    </svg>
  );
}
