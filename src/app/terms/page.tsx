import LegalPage, { Section, Bullets, Highlight } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Terms of Service — ShaadiSetu",
  description:
    "The agreement between you and ShaadiSetu when you use the site or any of its services.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="The rules,"
      italicWord="kept human."
      intro="When you use ShaadiSetu, you agree to these terms. We've kept them
        as short and readable as we can without leaving anything important out."
      updatedOn="29 April 2026"
    >
      <Highlight>
        <strong className="font-medium text-ink">Short version:</strong> Use
        the site as intended, treat vendors well, don&rsquo;t scrape or abuse
        anything, understand that vendors are independent businesses we
        showcase but don&rsquo;t employ, and remember that finance pages are
        guidance only — we don&rsquo;t sell financial products.
      </Highlight>

      <Section title="1. Who this applies to">
        <p>
          These terms cover everyone who uses shaadisetu.com — visitors,
          registered couples, vendors, and partners. By using the site, you
          accept these terms. If you don&rsquo;t, please don&rsquo;t use it.
        </p>
        <p>
          We use &ldquo;ShaadiSetu&rdquo;, &ldquo;we&rdquo;, and &ldquo;us&rdquo;
          to mean ShaadiSetu Media Pvt. Ltd., the company that runs the site.
          &ldquo;You&rdquo; means the person reading this.
        </p>
      </Section>

      <Section title="2. What ShaadiSetu is (and isn't)">
        <p>
          ShaadiSetu is an editorial directory and planning tool for Indian
          weddings. We connect couples with vendors and provide guides,
          checklists, budget tools, and editorial inspiration.
        </p>
        <p>We are not:</p>
        <Bullets
          items={[
            "The vendor. Each vendor is an independent business. We screen them, but we don't deliver their service or hold their bookings.",
            "An insurance broker, lender, or financial advisor. The /finance section is plain-English guidance only.",
            "A guarantor of pricing, availability, or quality. We curate honestly, but the contract is between you and the vendor.",
          ]}
        />
      </Section>

      <Section title="3. Your account">
        <p>
          You can browse most of the site without an account. To save vendors,
          submit enquiries, or use planning tools, you may need to register.
        </p>
        <Bullets
          items={[
            "You must be 18 or older.",
            "Give accurate information and keep it up to date.",
            "Keep your password to yourself. You're responsible for activity on your account.",
            "Tell us if you suspect unauthorised access (hello@shaadisetu.com).",
          ]}
        />
        <p>
          You can close your account at any time. We can suspend or terminate
          accounts that breach these terms or harm other users.
        </p>
      </Section>

      <Section title="4. Vendors and bookings">
        <p>
          When you contact a vendor through ShaadiSetu, you&rsquo;re entering
          into a separate conversation with that vendor. Pricing, contracts,
          deposits, refunds, and delivery are between the two of you.
        </p>
        <p>
          We do our best to verify vendors and remove ones that misbehave, but
          we can&rsquo;t guarantee any particular vendor&rsquo;s conduct. If
          something goes wrong, write to{" "}
          <a
            href="mailto:hello@shaadisetu.com"
            className="text-bordeaux underline underline-offset-2 hover:text-ink"
          >
            hello@shaadisetu.com
          </a>{" "}
          and we&rsquo;ll do what we reasonably can — including reviewing the
          vendor&rsquo;s standing on the platform.
        </p>
      </Section>

      <Section title="5. Finance section — important">
        <Highlight>
          ShaadiSetu does <strong className="font-medium text-ink">not</strong>{" "}
          sell, distribute, or broker financial products. We are not licensed
          to do so under the Insurance Act, 1938 or applicable RBI guidelines.
          The /finance pages exist purely to explain wedding insurance and
          wedding loans in plain English, with sponsored placements clearly
          marked.
        </Highlight>
        <p>
          Before you sign anything with an insurer or lender:
        </p>
        <Bullets
          items={[
            "Verify rates, fees, terms, and exclusions directly with the partner.",
            "Read the policy or loan agreement in full.",
            "Consult an IRDAI-registered advisor if you want product advice.",
          ]}
        />
        <p>
          Sponsored partners pay for placement, not for ranking. We do not
          receive a commission tied to whether you actually buy the product.
        </p>
      </Section>

      <Section title="6. SAATHI (the chatbot)">
        <p>
          SAATHI is an AI-powered planning companion. It is grounded in our
          site knowledge, but like any AI it can be wrong or out of date.
        </p>
        <Bullets
          items={[
            "Don't rely on SAATHI for legal, financial, or medical advice.",
            "Verify any specific vendor name, price, or availability before acting on it.",
            "Don't paste sensitive personal information (passwords, payment details, ID numbers) into chat.",
          ]}
        />
      </Section>

      <Section title="7. Things you must not do">
        <Bullets
          items={[
            "Scrape, crawl, or republish the site without our written permission.",
            "Reverse-engineer the site, the API, or SAATHI.",
            "Submit spam, fake reviews, or false enquiries.",
            "Impersonate another person or vendor.",
            "Upload anything illegal, infringing, or harmful.",
            "Probe the site for security weaknesses without first writing to us — responsible disclosure is welcome.",
          ]}
        />
      </Section>

      <Section title="8. Vendor listings">
        <p>If you list your business on ShaadiSetu, you also agree:</p>
        <Bullets
          items={[
            "All photos, prices, and claims are accurate and current. Update them when they change.",
            "You own (or have rights to use) every image you upload.",
            "You will respond to enquiries in a reasonable timeframe.",
            "You will treat couples with professionalism. Repeated complaints can lead to delisting.",
          ]}
        />
      </Section>

      <Section title="9. Intellectual property">
        <p>
          The ShaadiSetu name, logo, editorial copy, layouts, and original
          imagery belong to us. You may share links and short quotes for
          personal use; you may not republish whole pages or use our brand for
          commercial purposes without permission.
        </p>
        <p>
          Vendor photography belongs to the respective vendor. We display it
          under permission granted at sign-up.
        </p>
      </Section>

      <Section title="10. Liability">
        <p>
          We work hard to keep the site accurate and online, but we provide it
          &ldquo;as is&rdquo; without warranty. To the fullest extent allowed
          by law, ShaadiSetu&rsquo;s total liability for any claim relating to
          the site is limited to ₹10,000 or the fees you paid us in the prior
          12 months, whichever is greater.
        </p>
        <p>
          We are not liable for: vendor non-performance, third-party financial
          products, AI-generated suggestions you act on, or events outside our
          reasonable control.
        </p>
      </Section>

      <Section title="11. Governing law">
        <p>
          These terms are governed by the laws of India. Any dispute will be
          handled by the courts of Mumbai, Maharashtra.
        </p>
      </Section>

      <Section title="12. Changes">
        <p>
          We may update these terms from time to time. The &ldquo;last
          updated&rdquo; date will change. For substantive changes,
          we&rsquo;ll flag it on the homepage and in the newsletter. Continued
          use after a change means you accept the new terms.
        </p>
      </Section>
    </LegalPage>
  );
}
