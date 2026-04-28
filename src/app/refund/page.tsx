import LegalPage, { Section, Bullets, Highlight } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Refund Policy — ShaadiSetu",
  description:
    "When you can get a refund from ShaadiSetu and what to do about money paid to vendors.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Refunds"
      title="Money back,"
      italicWord="when it's fair."
      intro="Most of ShaadiSetu is free. The only money you pay us is for
        memberships and vendor subscriptions. Here's exactly when those are
        refundable — and what to do about money you've paid a vendor."
      updatedOn="29 April 2026"
    >
      <Highlight>
        <strong className="font-medium text-ink">Short version:</strong>{" "}
        Memberships and vendor subscriptions are refundable within 7 days if
        unused. Money you&rsquo;ve paid a vendor (deposits, full bookings) is
        between you and the vendor — we don&rsquo;t hold it and can&rsquo;t
        refund it, but we will help mediate.
      </Highlight>

      <Section title="What this policy covers">
        <p>
          This page covers refunds of money paid <em>to ShaadiSetu</em>. There
          are exactly two kinds of payments that fall in that bucket:
        </p>
        <Bullets
          items={[
            "Couple memberships (planning tools, premium concierge access).",
            "Vendor subscriptions (Pro listings, featured placements, lead packages).",
          ]}
        />
        <p>
          For deposits or fees you have paid directly to a vendor, see the
          &ldquo;Money paid to a vendor&rdquo; section near the bottom.
        </p>
      </Section>

      <Section title="Couple memberships">
        <p>
          If you bought a paid membership and want to cancel:
        </p>
        <Bullets
          items={[
            <>
              <strong className="font-medium text-ink">Within 7 days</strong>{" "}
              of payment and you have not used a paid feature (concierge
              session, premium download, etc.) — full refund, no questions
              asked.
            </>,
            <>
              <strong className="font-medium text-ink">
                Within 7 days but you have used a paid feature
              </strong>{" "}
              — pro-rated refund. We deduct the value of what you used.
            </>,
            <>
              <strong className="font-medium text-ink">After 7 days</strong>{" "}
              — generally non-refundable, but we&rsquo;ll review case by case
              if circumstances changed materially (e.g., wedding cancelled).
            </>,
            <>
              <strong className="font-medium text-ink">
                Annual plans paid up-front
              </strong>{" "}
              — if you cancel mid-cycle, we refund the unused months
              pro-rata, minus a 10% admin fee.
            </>,
          ]}
        />
      </Section>

      <Section title="Vendor subscriptions">
        <p>
          For listed vendors paying for Pro features:
        </p>
        <Bullets
          items={[
            "Refundable in full within 7 days of first payment if no leads have been delivered.",
            "After leads start flowing, the subscription is non-refundable for the remainder of the billing cycle. You can cancel renewal at any time.",
            "Featured placements purchased for a fixed window (e.g., a 30-day homepage feature) are non-refundable once they go live.",
            "If we suspend or terminate your listing for breach of our terms, no refund is due.",
          ]}
        />
      </Section>

      <Section title="Money paid to a vendor">
        <Highlight>
          ShaadiSetu does not collect, hold, or disburse the money you pay a
          vendor. Deposits and fees go directly between you and the vendor.
          That means we cannot refund them — only the vendor can.
        </Highlight>
        <p>If you&rsquo;re in a dispute with a vendor:</p>
        <Bullets
          items={[
            "First, contact the vendor in writing and document what you paid for and what was (or wasn't) delivered.",
            "Check the vendor's own cancellation and refund terms — they should be in your contract.",
            <>
              If you can&rsquo;t resolve it, write to{" "}
              <a
                href="mailto:hello@shaadisetu.com"
                className="text-bordeaux underline underline-offset-2 hover:text-ink"
              >
                hello@shaadisetu.com
              </a>{" "}
              with both sides of the conversation. We&rsquo;ll review the
              vendor&rsquo;s standing on the platform and, where appropriate,
              help mediate. Persistent or serious complaints can lead to
              delisting.
            </>,
            "Wedding insurance (see /finance/insurance) covers some vendor non-performance scenarios. If you bought a policy, this is when it earns its keep.",
          ]}
        />
      </Section>

      <Section title="Finance partners">
        <p>
          ShaadiSetu does not sell or distribute insurance policies or loans.
          If you bought a product from a partner listed on /finance, the
          refund and cooling-off period are governed by{" "}
          <strong className="font-medium text-ink">that partner&rsquo;s</strong>{" "}
          terms — typically:
        </p>
        <Bullets
          items={[
            "Wedding insurance: 15-day free-look period under IRDAI rules. Premium minus admin fee is refunded if you cancel inside that window.",
            "Wedding loans: foreclosure terms vary by lender. Read the loan agreement carefully before signing.",
          ]}
        />
        <p>
          Pursue any refund directly with the partner. We can re-share their
          contact details if you&rsquo;ve lost them, but cannot process the
          refund ourselves.
        </p>
      </Section>

      <Section title="How to request a refund">
        <p>Email{" "}
          <a
            href="mailto:hello@shaadisetu.com"
            className="text-bordeaux underline underline-offset-2 hover:text-ink"
          >
            hello@shaadisetu.com
          </a>{" "}
          with the subject &ldquo;Refund request&rdquo; and include:
        </p>
        <Bullets
          items={[
            "The email or phone number on the account.",
            "What you bought and when.",
            "The reason for the refund.",
            "The original payment method (we'll refund there).",
          ]}
        />
      </Section>

      <Section title="How long it takes">
        <p>
          Approved refunds are initiated within 5 business days. The actual
          credit to your account depends on your bank or card network —
          typically:
        </p>
        <Bullets
          items={[
            "UPI / net banking — 1–3 business days",
            "Credit / debit cards — 5–10 business days",
            "Wallet payments — same day to 48 hours",
          ]}
        />
      </Section>

      <Section title="Chargebacks">
        <p>
          Please write to us before raising a card chargeback. Chargebacks
          freeze the account, complicate the resolution, and we usually settle
          legitimate refunds faster than the bank does. If you&rsquo;ve
          already raised one and want to withdraw it, let us know.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          We&rsquo;ll update this policy when our pricing or product mix
          changes. Anything you bought before a change is governed by the
          policy that was live on the day of purchase.
        </p>
      </Section>
    </LegalPage>
  );
}
