import Link from "next/link";

interface Testimonial {
  id: number;
  couple: string;
  city: string;
  date: string;
  rating: number;
  quote: string;
  highlight: string;
  vendorsUsed: string[];
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    couple: "Priya & Rahul",
    city: "Jaipur",
    date: "March 2026",
    rating: 5,
    quote: "ShaadiSetu made our destination wedding in Jaipur absolutely magical. We found every vendor — from the venue to the mehendi artist — all in one place. The checklist feature saved us months of stress!",
    highlight: "Destination Wedding",
    vendorsUsed: ["Venue", "Decor", "Catering", "Photography"],
    avatar: "PR",
  },
  {
    id: 2,
    couple: "Ananya & Vikram",
    city: "Mumbai",
    date: "February 2026",
    rating: 5,
    quote: "We were planning from the US and ShaadiSetu was a lifesaver. Being able to browse vendors by function — sangeet, mehendi, wedding day — helped us organize everything remotely. Our coordinator was amazing!",
    highlight: "NRI Wedding",
    vendorsUsed: ["Planner", "Entertainment", "Beauty", "Photography"],
    avatar: "AV",
  },
  {
    id: 3,
    couple: "Meera & Arjun",
    city: "Delhi",
    date: "January 2026",
    rating: 5,
    quote: "The vendor reviews on ShaadiSetu are genuine and so helpful. We found our dream photographer through the platform. The whole experience was smooth from browsing to booking.",
    highlight: "Dream Photography",
    vendorsUsed: ["Photography", "Decor", "Catering"],
    avatar: "MA",
  },
  {
    id: 4,
    couple: "Sanya & Karan",
    city: "Udaipur",
    date: "December 2025",
    rating: 5,
    quote: "Our royal wedding in Udaipur needed premium vendors and ShaadiSetu delivered. The Elite membership gave us priority access and our dedicated WhatsApp support helped us coordinate across 8 vendors effortlessly.",
    highlight: "Royal Wedding",
    vendorsUsed: ["Venue", "Decor", "Entertainment", "Logistics", "Catering"],
    avatar: "SK",
  },
  {
    id: 5,
    couple: "Nisha & Amit",
    city: "Bangalore",
    date: "November 2025",
    rating: 4,
    quote: "As a couple who wanted an eco-friendly wedding, we used ShaadiSetu to find vendors who aligned with our values. The filter system made it easy to compare options. Highly recommend the Plan My Wedding feature!",
    highlight: "Eco-Friendly Wedding",
    vendorsUsed: ["Planner", "Decor", "Catering", "Gifts"],
    avatar: "NA",
  },
  {
    id: 6,
    couple: "Ritu & Deepak",
    city: "Lucknow",
    date: "October 2025",
    rating: 5,
    quote: "We had a last-minute pandit cancellation and the Last-Minute Services category literally saved our wedding. Found a verified pandit within 3 hours. ShaadiSetu is truly Shaadi ki har zaroorat, ek hi jagah!",
    highlight: "Last-Minute Save",
    vendorsUsed: ["Rituals", "Last-Minute Services"],
    avatar: "RD",
  },
  {
    id: 7,
    couple: "Pooja & Rohan",
    city: "Pune",
    date: "September 2025",
    rating: 5,
    quote: "From roka to reception, we used ShaadiSetu for every function. The Browse by Function feature is genius — it shows exactly which vendors you need for each event. Made our 5-day wedding seamless!",
    highlight: "5-Day Celebration",
    vendorsUsed: ["Venue", "Decor", "Catering", "Photography", "Entertainment", "Beauty"],
    avatar: "PR",
  },
  {
    id: 8,
    couple: "Kavya & Nikhil",
    city: "Chennai",
    date: "August 2025",
    rating: 5,
    quote: "Being from a South Indian family, we needed vendors who understood our traditions. ShaadiSetu had an amazing selection of pandits and ritual kits. The wedding was exactly how we imagined it.",
    highlight: "South Indian Wedding",
    vendorsUsed: ["Rituals", "Venue", "Catering", "Photography", "Decor"],
    avatar: "KN",
  },
];

const stats = [
  { value: "1,00,000+", label: "Happy Couples" },
  { value: "4.8", label: "Average Rating" },
  { value: "50,000+", label: "Verified Vendors" },
  { value: "500+", label: "Cities" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ClientDiariesPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-shaadi-light via-white to-shaadi-warm-gray">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-shaadi-red via-shaadi-rose to-shaadi-pink" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Client Diaries
          </h1>
          <p className="mt-3 text-rose-100 text-base md:text-lg max-w-xl mx-auto">
            Real stories from real couples who planned their dream wedding with ShaadiSetu.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-shaadi-red to-shaadi-rose bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials grid */}
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-shaadi-red to-shaadi-pink flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                      {t.couple}
                    </h3>
                    <span className="text-[10px] font-bold text-shaadi-red bg-shaadi-light px-2 py-0.5 rounded-full uppercase">
                      {t.highlight}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t.city} &middot; {t.date}
                  </p>
                  <div className="mt-1">
                    <StarRating rating={t.rating} />
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="relative">
                <svg
                  className="absolute -top-1 -left-1 w-6 h-6 text-shaadi-light"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                </svg>
                <p className="text-sm text-slate-600 leading-relaxed pl-5">
                  {t.quote}
                </p>
              </div>

              {/* Vendors used */}
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Vendors booked via ShaadiSetu
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {t.vendorsUsed.map((vendor) => (
                    <span
                      key={vendor}
                      className="text-xs text-slate-500 bg-gray-50 px-2 py-0.5 rounded-md"
                    >
                      {vendor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-shaadi-light to-rose-50 border border-rose-100 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900">
              Ready to write your own diary?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Join 1,00,000+ couples who planned their dream wedding with ShaadiSetu.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/plan"
                className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink hover:opacity-90 transition-opacity shadow-sm"
              >
                Plan My Wedding
              </Link>
              <Link
                href="/categories"
                className="px-6 py-2.5 text-sm font-semibold text-shaadi-red border-2 border-shaadi-red/20 rounded-lg hover:bg-shaadi-light transition-colors"
              >
                Browse Vendors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
