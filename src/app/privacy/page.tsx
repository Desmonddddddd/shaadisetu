import LegalPage, { Section, Bullets, Highlight } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Privacy Policy — ShaadiSetu",
  description:
    "How ShaadiSetu collects, uses, and protects your data. Plain English, no fine print.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Your data,"
      italicWord="handled with care."
      intro="We collect the smallest amount of data we can get away with, hold it
        securely, and never sell it. Here's the full picture in plain English."
      updatedOn="29 April 2026"
    >
      <Highlight>
        <strong className="font-medium text-ink">Short version:</strong> We
        collect what you give us (name, email, phone when you write in or sign
        up) plus basic analytics about how the site is used. We use it to reply
        to you and to make ShaadiSetu better. We do not sell your data, ever.
      </Highlight>

      <Section title="Who we are">
        <p>
          ShaadiSetu is operated by ShaadiSetu Media Pvt. Ltd., based in India.
          When this policy says &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;ShaadiSetu&rdquo;, that&rsquo;s who we mean. When it says
          &ldquo;you&rdquo;, that&rsquo;s any visitor or registered user of
          the site at shaadisetu.com.
        </p>
        <p>
          For privacy questions, write to{" "}
          <a
            href="mailto:hello@shaadisetu.com"
            className="text-bordeaux underline underline-offset-2 hover:text-ink"
          >
            hello@shaadisetu.com
          </a>
          .
        </p>
      </Section>

      <Section title="What we collect">
        <p>Three buckets:</p>
        <Bullets
          items={[
            <>
              <strong className="font-medium text-ink">
                Information you give us.
              </strong>{" "}
              When you fill out the curated-request form, the
              &ldquo;Talk to a planner&rdquo; finance enquiry, or the SAATHI
              chatbot, we receive what you typed: name, email, optional phone,
              and the message itself. Account sign-up adds a hashed password.
            </>,
            <>
              <strong className="font-medium text-ink">
                Information we collect automatically.
              </strong>{" "}
              Server logs (IP address, user agent, page URL, timestamp) and
              privacy-friendly analytics that count page views without
              identifying you personally. We do not use ad-tracking pixels.
            </>,
            <>
              <strong className="font-medium text-ink">
                Information from third parties.
              </strong>{" "}
              If you sign in with a social provider (where supported), we
              receive your name and email from them — nothing else.
            </>,
          ]}
        />
      </Section>

      <Section title="What we do with it">
        <Bullets
          items={[
            "Reply to enquiries you sent us — vendor questions, finance enquiries, curated requests, support.",
            "Run your account, save your shortlists, and remember which vendors you've contacted.",
            "Improve the site by understanding which pages get used and which don't.",
            "Detect and prevent abuse — spam, scraping, fraud.",
            "Send the monthly newsletter, only if you signed up for it. One click unsubscribes.",
          ]}
        />
        <p>
          We do not use your data to train AI models, and we do not sell it.
        </p>
      </Section>

      <Section title="Who we share it with">
        <p>
          We use a small number of vetted third parties to run the site. They
          process data on our behalf and only for the purposes listed:
        </p>
        <Bullets
          items={[
            <>
              <strong className="font-medium text-ink">Resend</strong> —
              transactional email (your enquiries are delivered to our inbox
              via Resend; their privacy policy is at{" "}
              <a
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bordeaux underline underline-offset-2 hover:text-ink"
              >
                resend.com/legal/privacy-policy
              </a>
              ).
            </>,
            <>
              <strong className="font-medium text-ink">Vercel</strong> —
              hosting and infrastructure analytics. No personally identifying
              cookies are set by their analytics product.
            </>,
            <>
              <strong className="font-medium text-ink">Anthropic</strong> —
              SAATHI, our chatbot, runs on Claude. Your chat messages are sent
              to Anthropic to generate replies. They do not train on this data
              under our API agreement.
            </>,
            <>
              <strong className="font-medium text-ink">Cloudinary</strong> —
              image storage and delivery for vendor portfolios.
            </>,
            <>
              <strong className="font-medium text-ink">Vendors</strong> —
              when you submit an enquiry to a specific vendor, we share the
              relevant fields (name, contact, message) with that vendor so
              they can reply.
            </>,
          ]}
        />
        <p>
          Beyond the partners above, we share data only when required by Indian
          law (court order, valid government request) or to protect the safety
          of our users.
        </p>
      </Section>

      <Section title="How long we keep it">
        <Bullets
          items={[
            "Account data — for as long as your account is active. Delete your account and we delete the personal fields within 30 days (we keep anonymised aggregates).",
            "Enquiries — kept for 24 months so vendors and our team can respond and follow up. Older entries are archived.",
            "Server logs — 30 days.",
            "Newsletter list — until you unsubscribe.",
          ]}
        />
      </Section>

      <Section title="Your rights">
        <p>Under Indian data-protection law, you can ask us to:</p>
        <Bullets
          items={[
            "See a copy of the data we hold about you.",
            "Correct anything that's wrong.",
            "Delete your account and the personal data tied to it.",
            "Withdraw consent for marketing emails (you can also just hit unsubscribe).",
            "Export your data in a portable format.",
          ]}
        />
        <p>
          Email{" "}
          <a
            href="mailto:hello@shaadisetu.com"
            className="text-bordeaux underline underline-offset-2 hover:text-ink"
          >
            hello@shaadisetu.com
          </a>{" "}
          with the subject &ldquo;Privacy request&rdquo; and we&rsquo;ll
          respond within 30 days.
        </p>
      </Section>

      <Section title="Security">
        <p>
          We use TLS for all data in transit, hash passwords with bcrypt, and
          run on managed infrastructure with regular security patches. No
          system is bulletproof — if we detect a breach that affects your data,
          we&rsquo;ll notify you and the relevant authority within the
          timelines required by law.
        </p>
      </Section>

      <Section title="Children">
        <p>
          ShaadiSetu is not intended for users under 18. We do not knowingly
          collect data from minors. If you believe a minor has signed up, write
          to us and we&rsquo;ll delete the account.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          We&rsquo;ll update this page when we change how we handle data. The
          &ldquo;last updated&rdquo; date at the top will reflect the latest
          revision. For significant changes (new third-party processors, new
          categories of data), we&rsquo;ll also flag it in the next newsletter
          and on the site.
        </p>
      </Section>
    </LegalPage>
  );
}
