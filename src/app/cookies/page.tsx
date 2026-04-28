import LegalPage, { Section, Bullets, Highlight } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Cookie Policy — ShaadiSetu",
  description:
    "What ShaadiSetu stores in your browser, why, and how to manage it.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="Cookies"
      title="What we store"
      italicWord="in your browser."
      intro="We use a small number of cookies and local-storage items to keep
        the site working and to understand how it's used. No ad-tracking, no
        cross-site profiling."
      updatedOn="29 April 2026"
    >
      <Highlight>
        <strong className="font-medium text-ink">Short version:</strong>{" "}
        Essential cookies for sign-in and security. Privacy-friendly analytics
        for traffic counts. Local storage for the SAATHI chat history (stays
        on your device). That&rsquo;s it.
      </Highlight>

      <Section title="What is a cookie?">
        <p>
          A cookie is a small text file a website asks your browser to store.
          It lets the site remember things between page loads — that
          you&rsquo;re signed in, what you put in your shortlist, which city
          you&rsquo;re browsing from. Local storage is a similar idea, just
          with more space.
        </p>
      </Section>

      <Section title="What we set and why">
        <p>The cookies and storage items in active use:</p>
        <Bullets
          items={[
            <>
              <strong className="font-medium text-ink">Authentication.</strong>{" "}
              When you sign in, we set a session cookie issued by NextAuth.
              Without it, signed-in pages can&rsquo;t tell who you are.
              Essential — cannot be disabled while you&rsquo;re logged in.
            </>,
            <>
              <strong className="font-medium text-ink">Security.</strong>{" "}
              CSRF tokens to stop other sites from acting on your behalf, and
              a rate-limit fingerprint to deter abuse. Essential.
            </>,
            <>
              <strong className="font-medium text-ink">
                City preference.
              </strong>{" "}
              We remember the city you selected so vendor listings stay
              filtered. Functional — clear it and you go back to the default.
            </>,
            <>
              <strong className="font-medium text-ink">
                Compare tray.
              </strong>{" "}
              We store the vendor IDs you&rsquo;ve added to compare so they
              survive page navigation. Functional.
            </>,
            <>
              <strong className="font-medium text-ink">
                SAATHI chat history.
              </strong>{" "}
              The chatbot transcript is kept in your browser&rsquo;s local
              storage so reopening the panel shows what you&rsquo;ve already
              talked about. It is <em>not</em> sent to our servers except as
              part of an active chat request. Click &ldquo;Reset&rdquo; in the
              chat panel to wipe it.
            </>,
            <>
              <strong className="font-medium text-ink">
                Vercel Analytics.
              </strong>{" "}
              Privacy-friendly traffic measurement. It does not set cookies
              that identify you personally and does not track you across
              sites. See{" "}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bordeaux underline underline-offset-2 hover:text-ink"
              >
                vercel.com/docs/analytics/privacy-policy
              </a>
              .
            </>,
          ]}
        />
      </Section>

      <Section title="What we do not use">
        <Bullets
          items={[
            "Advertising or retargeting cookies. We don't run ads.",
            "Cross-site tracking pixels (Facebook Pixel, etc.).",
            "Third-party social-media tracking. Embedded widgets only load when you click on them.",
            "Session-replay tools that record your screen.",
          ]}
        />
      </Section>

      <Section title="How to manage cookies">
        <p>
          Every modern browser lets you view, block, or delete cookies in
          Settings &rsaquo; Privacy. You can also use private/incognito mode
          if you don&rsquo;t want anything stored.
        </p>
        <p>If you block essential cookies:</p>
        <Bullets
          items={[
            "Sign-in won't persist — you'll be logged out on every page load.",
            "Form submissions may be rejected by our anti-abuse checks.",
            "Some interactive features (compare tray, SAATHI history) won't work.",
          ]}
        />
        <p>
          The rest are optional. The site stays functional without them; you
          just won&rsquo;t get the personalisation.
        </p>
      </Section>

      <Section title="Do Not Track">
        <p>
          We honour the deprecated DNT header where it&rsquo;s sent: if your
          browser asks us not to track, we skip non-essential analytics for
          your session. We also respect the newer Global Privacy Control
          (GPC) signal in the same way.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          When we add or remove a cookie, we&rsquo;ll update the list above
          and bump the &ldquo;last updated&rdquo; date. For privacy-impacting
          changes we&rsquo;ll also note it in the newsletter.
        </p>
      </Section>
    </LegalPage>
  );
}
