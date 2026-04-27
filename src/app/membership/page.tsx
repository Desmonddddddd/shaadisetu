import Link from "next/link";

const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface Feature {
  text: string;
  included: boolean;
  highlight?: string;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  elite?: boolean;
  features: Feature[];
  cta: string;
}

const plans: Plan[] = [
  {
    name: "Basic",
    price: "Free",
    period: "",
    description: "Get started with wedding planning essentials",
    features: [
      { text: "Browse all vendors", included: true },
      { text: "15 vendor enquiries / month", included: true },
      { text: "Shortlist up to 10 vendors", included: true },
      { text: "Read vendor reviews", included: true },
      { text: "Write vendor reviews", included: false },
      { text: "Priority support", included: false },
      { text: "Early access deals", included: false },
      { text: "Vendor analytics", included: false },
      { text: "Elite Couple badge", included: false },
    ],
    cta: "Get Started Free",
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/year",
    description: "For couples who want the best options",
    popular: true,
    features: [
      { text: "Browse all vendors", included: true },
      { text: "50 vendor enquiries / month", included: true },
      { text: "Shortlist up to 50 vendors", included: true },
      { text: "Read & write vendor reviews", included: true },
      { text: "Email support", included: true },
      { text: "Early access to deals & offers", included: true },
      { text: "Vendor analytics", included: true, highlight: "Ratings & pricing" },
      { text: "Elite Couple badge", included: false },
      { text: "Dedicated WhatsApp support", included: false },
    ],
    cta: "Upgrade to Pro",
  },
  {
    name: "Elite",
    price: "₹2,999",
    period: "/year",
    description: "The ultimate wedding planning experience",
    elite: true,
    features: [
      { text: "Browse all vendors", included: true },
      { text: "Unlimited vendor enquiries", included: true },
      { text: "Unlimited vendor shortlist", included: true },
      { text: "Read & write vendor reviews", included: true },
      { text: "Dedicated WhatsApp support", included: true },
      { text: "Early access to deals & offers", included: true },
      { text: "Full vendor analytics", included: true, highlight: "Availability, response time & more" },
      { text: "Elite Couple badge", included: true, highlight: "Stand out to vendors" },
      { text: "Priority vendor matching", included: true },
    ],
    cta: "Go Elite",
  },
];

const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you’ll only pay the difference for the remaining period.",
  },
  {
    q: "Is there a refund policy?",
    a: "We offer a full refund within 7 days of purchase if you’re not satisfied. No questions asked.",
  },
  {
    q: "How does billing work?",
    a: "Plans are billed annually. You’ll receive a reminder email before your subscription renews.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, credit/debit cards, net banking, and popular wallets like Paytm and PhonePe.",
  },
];

export default function PricingPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-shaadi-light via-white to-shaadi-warm-gray">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-shaadi-red via-shaadi-rose to-shaadi-pink" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Become a Pro Member
          </h1>
          <p className="mt-3 text-rose-100 text-base md:text-lg max-w-xl mx-auto">
            Unlock premium features to find the perfect vendors for your dream wedding. More enquiries, better insights, and priority support.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl border overflow-hidden flex flex-col ${
                plan.popular
                  ? "border-shaadi-rose shadow-xl ring-2 ring-shaadi-rose/20 scale-[1.02] md:scale-105"
                  : plan.elite
                  ? "border-amber-300 shadow-lg"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="bg-gradient-to-r from-shaadi-red to-shaadi-rose text-white text-xs font-bold text-center py-1.5 uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              {plan.elite && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold text-center py-1.5 uppercase tracking-wider">
                  Best Value
                </div>
              )}

              <div className="p-6 md:p-8 flex flex-col flex-1">
                {/* Plan header */}
                <div className="mb-6">
                  <h2 className={`text-xl font-bold ${plan.elite ? "text-amber-600" : plan.popular ? "text-shaadi-red" : "text-slate-900"}`}>
                    {plan.name}
                  </h2>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      {feature.included ? <CheckIcon /> : <CrossIcon />}
                      <span className={`text-sm ${feature.included ? "text-slate-700" : "text-slate-400"}`}>
                        {feature.text}
                        {feature.highlight && (
                          <span className="block text-xs text-slate-400 mt-0.5">{feature.highlight}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  <Link
                    href="/signup/user"
                    className={`block w-full py-3 text-sm font-semibold text-center rounded-lg transition-opacity hover:opacity-90 ${
                      plan.popular
                        ? "bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink text-white shadow-sm"
                        : plan.elite
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm"
                        : "bg-white text-slate-700 border-2 border-gray-200 hover:border-shaadi-rose hover:text-shaadi-red"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="max-w-3xl mx-auto px-4 mt-12">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Secure Payments
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            7-Day Refund
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            UPI, Cards & Wallets
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cancel Anytime
          </div>
        </div>
      </div>

      {/* Comparison table (desktop) */}
      <div className="max-w-4xl mx-auto px-4 mt-16 hidden md:block">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Compare Plans</h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-sm font-medium text-slate-500 py-4 px-6 w-1/3">Feature</th>
                <th className="text-center text-sm font-bold text-slate-700 py-4 px-4">Basic</th>
                <th className="text-center text-sm font-bold text-shaadi-red py-4 px-4 bg-shaadi-light/30">Pro</th>
                <th className="text-center text-sm font-bold text-amber-600 py-4 px-4">Elite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { feature: "Monthly enquiries", basic: "15", pro: "50", elite: "Unlimited" },
                { feature: "Vendor shortlist", basic: "10", pro: "50", elite: "Unlimited" },
                { feature: "Vendor reviews", basic: "Read only", pro: "Read & write", elite: "Read & write" },
                { feature: "Vendor analytics", basic: "—", pro: "Ratings & pricing", elite: "Full analytics" },
                { feature: "Support", basic: "—", pro: "Email", elite: "WhatsApp" },
                { feature: "Early access deals", basic: "—", pro: "✓", elite: "✓" },
                { feature: "Elite Couple badge", basic: "—", pro: "—", elite: "✓" },
                { feature: "Priority matching", basic: "—", pro: "—", elite: "✓" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="text-sm text-slate-700 py-3.5 px-6">{row.feature}</td>
                  <td className="text-center text-sm text-slate-600 py-3.5 px-4">{row.basic}</td>
                  <td className="text-center text-sm text-slate-600 py-3.5 px-4 bg-shaadi-light/10 font-medium">{row.pro}</td>
                  <td className="text-center text-sm text-slate-600 py-3.5 px-4">{row.elite}</td>
                </tr>
              ))}
              <tr>
                <td className="py-4 px-6" />
                <td className="text-center py-4 px-4">
                  <Link href="/signup/user" className="text-xs font-semibold text-slate-500 hover:text-shaadi-red transition-colors">Get Started</Link>
                </td>
                <td className="text-center py-4 px-4 bg-shaadi-light/10">
                  <Link href="/signup/user" className="text-xs font-semibold text-shaadi-red hover:text-shaadi-rose transition-colors">Choose Pro</Link>
                </td>
                <td className="text-center py-4 px-4">
                  <Link href="/signup/user" className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">Go Elite</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto px-4 py-16 md:py-20">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-slate-900">{faq.q}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
