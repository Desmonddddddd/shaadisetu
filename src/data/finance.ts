// Finance partners — placeholder data for v1. Real partners and tracked
// referral links plug in here later. The route never reads from process
// state; flip these to env-driven later if/when we sign deals.
//
// LEGAL: ShaadiSetu does not sell or distribute financial products. The
// pages display partner information for guidance only. Show the
// disclaimer below in every consumer-facing finance page.

export const FINANCE_DISCLAIMER =
  "ShaadiSetu does not sell or distribute financial products. Partner information is shown for guidance only — verify all rates, terms, and coverage with the partner directly before deciding.";

export type FinanceProduct = "insurance" | "loan";

export interface FinancePartner {
  id: string;
  name: string;
  // Short tagline shown beneath the name in the partner card.
  pitch: string;
  // Headline number, e.g. "Up to ₹50L" or "10.49%".
  highlight: string;
  highlightLabel: string;
  // Small bullets shown in the card body.
  bullets: string[];
  // External URL the partner card links to. Real placements will use UTM.
  href: string;
  sponsored: boolean;
  // Additional comparison columns (premium, rate, tenure, etc.) keyed
  // by the same string used in `compareColumns`. Unrelated to the typed
  // fields above so they can vary per product.
  [comparisonKey: string]: unknown;
}

export interface FinanceProductSpec {
  slug: FinanceProduct;
  eyebrow: string;
  title: string;
  italicWord: string;
  blurb: string;
  hero: string;
  // What it is — first explainer block, plain English.
  whatItIs: string[];
  // Who it's for — second block.
  whoItIsFor: string[];
  // 3-step "how it works" timeline.
  howItWorks: { title: string; body: string }[];
  // Comparison row labels for the partner table.
  compareColumns: { key: string; label: string }[];
  partners: FinancePartner[];
  faqs: { q: string; a: string }[];
}

export const FINANCE_PRODUCTS: FinanceProductSpec[] = [
  {
    slug: "insurance",
    eyebrow: "Wedding Insurance",
    title: "Insure the day so you can",
    italicWord: "actually enjoy it.",
    blurb:
      "From a vendor no-show to a venue fire, wedding insurance covers the things you cannot replan in 24 hours. Premiums start at a fraction of a single decor invoice.",
    hero: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2400&q=80",
    whatItIs: [
      "A short-term insurance contract — typically 7 to 30 days — that reimburses you for losses tied to your wedding events.",
      "Standard cover includes venue/equipment damage, vendor non-performance, public liability, and personal accident for the couple and immediate family.",
      "Premiums in India usually run between 0.5% and 1.5% of the insured amount.",
    ],
    whoItIsFor: [
      "Couples spending ₹15L or more on the wedding — the financial loss from a cancellation is real.",
      "Destination weddings, where venue commitments, travel, and vendor logistics layer up risk.",
      "Anyone hosting between June and September (monsoon) or in regions prone to civic disruption.",
    ],
    howItWorks: [
      {
        title: "Pick a sum insured",
        body: "Total up vendor invoices, advance payments, and venue commitments. That is your sum insured.",
      },
      {
        title: "Compare partner quotes",
        body: "Coverage, premium, and exclusions vary widely. The cheapest premium often skips the most likely risks.",
      },
      {
        title: "Buy 30+ days ahead",
        body: "Most insurers require the policy be live 30 days before the first event. Last-minute purchases are often refused.",
      },
    ],
    compareColumns: [
      { key: "highlight", label: "Max cover" },
      { key: "premium", label: "Premium starts at" },
      { key: "claimWindow", label: "Claim window" },
      { key: "rating", label: "Customer rating" },
    ],
    partners: [
      {
        id: "hdfc-ergo",
        name: "HDFC ERGO",
        pitch: "Wedding Insurance · Marriage Cover",
        highlight: "₹50L",
        highlightLabel: "Sum insured",
        premium: "₹2,499",
        claimWindow: "30 days",
        rating: "4.4 / 5",
        bullets: [
          "Covers cancellation, postponement, public liability",
          "Pan-India network claim offices",
          "Optional rider for jewellery in transit",
        ],
        href: "https://www.hdfcergo.com",
        sponsored: true,
      },
      {
        id: "icici-lombard",
        name: "ICICI Lombard",
        pitch: "Wedding Insurance · Stand-alone",
        highlight: "₹25L",
        highlightLabel: "Sum insured",
        premium: "₹1,899",
        claimWindow: "60 days",
        rating: "4.3 / 5",
        bullets: [
          "Burglary cover for cash & gifts on premises",
          "Fast online claim filing",
          "Personal accident rider for couple",
        ],
        href: "https://www.icicilombard.com",
        sponsored: true,
      },
      {
        id: "bajaj-allianz",
        name: "Bajaj Allianz",
        pitch: "Wedding Cover · Premium",
        highlight: "₹1Cr",
        highlightLabel: "Sum insured",
        premium: "₹4,799",
        claimWindow: "30 days",
        rating: "4.2 / 5",
        bullets: [
          "Highest cover ceiling in market",
          "International venue rider available",
          "Vendor non-performance pay-out",
        ],
        href: "https://www.bajajallianz.com",
        sponsored: false,
      },
    ],
    faqs: [
      {
        q: "Will it cover a no-show by my decor team?",
        a: "Most policies cover vendor non-performance only when the vendor signed a written contract with you. Verbal commitments and informal advance payments are usually excluded.",
      },
      {
        q: "Is COVID-style cancellation covered?",
        a: "Pandemic and government-ordered cancellations are excluded by all major Indian insurers as of 2024. Read the policy wording line by line.",
      },
      {
        q: "How fast does a claim settle?",
        a: "30 to 90 days is normal. File within the claim window with itemised invoices and a written event-cancellation letter from the venue.",
      },
    ],
  },
  {
    slug: "loan",
    eyebrow: "Wedding Loan",
    title: "A loan you take",
    italicWord: "with eyes wide open.",
    blurb:
      "A wedding loan is just an unsecured personal loan with a friendlier name. The interest rate, tenure, and pre-payment penalty are what matter — not the marketing.",
    hero: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=2400&q=80",
    whatItIs: [
      "An unsecured personal loan typically marketed as a wedding loan. No collateral; approval is based on income and credit score.",
      "Tenures usually run 12 to 60 months. Interest rates in India range from 10.5% to 24% per annum depending on profile.",
      "Most lenders charge a 1–3% processing fee. Pre-payment penalties vary — read this clause carefully.",
    ],
    whoItIsFor: [
      "Couples with stable income who prefer to spread a one-time wedding spend over 2–4 years.",
      "Families bridging a short timing gap — e.g., a deposit refund or maturing investment due after the wedding.",
      "Not for: anyone whose total EMI burden after the loan would exceed 40% of monthly income.",
    ],
    howItWorks: [
      {
        title: "Check your CIBIL score",
        body: "750+ unlocks the best rates. Below 700, expect rejection or rates above 18%.",
      },
      {
        title: "Compare APR, not headline rate",
        body: "APR includes processing fee and charges — that is the real cost. A 'lower' rate with high fees is often worse.",
      },
      {
        title: "Negotiate pre-payment terms",
        body: "Aim for a loan with zero pre-payment penalty after 12 months, so a windfall (gift, bonus) can clear it early.",
      },
    ],
    compareColumns: [
      { key: "highlight", label: "Up to" },
      { key: "rate", label: "Starting rate" },
      { key: "tenure", label: "Tenure" },
      { key: "processing", label: "Processing fee" },
    ],
    partners: [
      {
        id: "hdfc-bank",
        name: "HDFC Bank",
        pitch: "Personal Loan for Wedding",
        highlight: "₹40L",
        highlightLabel: "Loan amount",
        rate: "10.50%",
        tenure: "12–60 mo",
        processing: "Up to 2.5%",
        bullets: [
          "10-second in-principle approval for select customers",
          "No collateral, doorstep documentation",
          "Pre-approved offers for salaried at top firms",
        ],
        href: "https://www.hdfcbank.com",
        sponsored: true,
      },
      {
        id: "bajaj-finserv",
        name: "Bajaj Finserv",
        pitch: "Marriage Loan",
        highlight: "₹40L",
        highlightLabel: "Loan amount",
        rate: "11.00%",
        tenure: "12–96 mo",
        processing: "Up to 4%",
        bullets: [
          "Flexi-loan: pay interest only, principal on demand",
          "24-hour disbursal claim",
          "Part-prepayment without penalty after 1 EMI",
        ],
        href: "https://www.bajajfinserv.in",
        sponsored: true,
      },
      {
        id: "tata-capital",
        name: "Tata Capital",
        pitch: "Wedding Personal Loan",
        highlight: "₹35L",
        highlightLabel: "Loan amount",
        rate: "10.99%",
        tenure: "12–72 mo",
        processing: "Up to 2.75%",
        bullets: [
          "Foreclosure allowed after 6 EMIs",
          "Online application, end-to-end paperless",
          "Insurance bundle available",
        ],
        href: "https://www.tatacapital.com",
        sponsored: false,
      },
      {
        id: "axis-bank",
        name: "Axis Bank",
        pitch: "Personal Loan",
        highlight: "₹40L",
        highlightLabel: "Loan amount",
        rate: "10.49%",
        tenure: "12–84 mo",
        processing: "Up to 2%",
        bullets: [
          "Lowest starting rate among top-3 banks",
          "Top-up loan eligibility after 12 EMIs",
          "Pre-payment after 12 months, no penalty",
        ],
        href: "https://www.axisbank.com",
        sponsored: false,
      },
    ],
    faqs: [
      {
        q: "Should I take a loan for a wedding I cannot afford?",
        a: "Frankly — no. A wedding loan makes sense to smooth timing or avoid liquidating long-term investments. It does not make sense to fund a wedding 30% larger than your savings allow.",
      },
      {
        q: "Will it hurt my CIBIL score?",
        a: "A new loan dings your score 5–15 points temporarily. Paid on time, the score recovers and improves within 6–9 months.",
      },
      {
        q: "Can both partners co-borrow?",
        a: "Most banks allow a joint personal loan with a co-applicant — typically the spouse or a parent. It usually unlocks a higher loan amount.",
      },
    ],
  },
];

export function getFinanceProduct(slug: FinanceProduct): FinanceProductSpec | undefined {
  return FINANCE_PRODUCTS.find((p) => p.slug === slug);
}
