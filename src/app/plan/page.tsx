"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cities } from "@/data/cities";
import { getCategoryById } from "@/data/categories";

interface ChecklistItem {
  categoryId: string;
  task: string;
  priority: "high" | "medium" | "low";
}

interface TimelineBucket {
  label: string;
  timeframe: string;
  emoji: string;
  items: ChecklistItem[];
}

const checklist: TimelineBucket[] = [
  {
    label: "6+ Months Before",
    timeframe: "Start early for the best options",
    emoji: "\u{1F4C5}",
    items: [
      { categoryId: "venues", task: "Book your wedding venue", priority: "high" },
      { categoryId: "planning", task: "Hire a wedding planner", priority: "high" },
      { categoryId: "photography", task: "Book photographer & videographer", priority: "high" },
      { categoryId: "catering", task: "Finalize caterer", priority: "high" },
    ],
  },
  {
    label: "3-6 Months Before",
    timeframe: "Lock in the main vendors",
    emoji: "\u{1F3AF}",
    items: [
      { categoryId: "decor", task: "Book decorator & theme setup", priority: "high" },
      { categoryId: "entertainment", task: "Book entertainment (DJ, band, etc.)", priority: "medium" },
      { categoryId: "essentials", task: "Shop for bridal & groom outfits", priority: "high" },
      { categoryId: "digital", task: "Create wedding website & send e-invites", priority: "medium" },
      { categoryId: "planning", task: "Design and send invitations", priority: "medium" },
    ],
  },
  {
    label: "1-3 Months Before",
    timeframe: "Fine-tune every detail",
    emoji: "\u{2728}",
    items: [
      { categoryId: "beauty", task: "Book makeup artist & trials", priority: "high" },
      { categoryId: "essentials", task: "Finalize jewellery & accessories", priority: "medium" },
      { categoryId: "gifts", task: "Order wedding favours & return gifts", priority: "medium" },
      { categoryId: "logistics", task: "Arrange transport & logistics", priority: "medium" },
      { categoryId: "rituals", task: "Book pandit & arrange ritual items", priority: "high" },
      { categoryId: "rentals", task: "Book furniture, crockery & tent rentals", priority: "medium" },
    ],
  },
  {
    label: "2 Weeks Before",
    timeframe: "Final preparations",
    emoji: "\u{1F4CB}",
    items: [
      { categoryId: "guests", task: "Confirm guest list & hotel bookings", priority: "high" },
      { categoryId: "legal", task: "Prepare marriage registration documents", priority: "medium" },
      { categoryId: "beauty", task: "Begin pre-bridal beauty treatments", priority: "medium" },
      { categoryId: "guests", task: "Prepare welcome kits for guests", priority: "low" },
    ],
  },
  {
    label: "Wedding Week",
    timeframe: "You've got this!",
    emoji: "\u{1F389}",
    items: [
      { categoryId: "last-minute", task: "Keep backup vendors on standby", priority: "high" },
      { categoryId: "logistics", task: "Confirm all vendor arrivals & timings", priority: "high" },
      { categoryId: "beauty", task: "Final grooming & makeup appointments", priority: "high" },
      { categoryId: "honeymoon", task: "Confirm honeymoon bookings", priority: "low" },
    ],
  },
];

export default function PlanPage() {
  const [step, setStep] = useState(1);
  const [weddingDate, setWeddingDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // Group cities by state
  const states = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    for (const city of cities) {
      if (!grouped[city.state]) grouped[city.state] = [];
      grouped[city.state].push(city.name);
    }
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  // Filtered cities
  const filteredStates = useMemo(() => {
    if (!citySearch.trim()) return states;
    const q = citySearch.toLowerCase();
    return states
      .map(([state, cityNames]) => [
        state,
        cityNames.filter(
          (name) =>
            name.toLowerCase().includes(q) || state.toLowerCase().includes(q)
        ),
      ] as [string, string[]])
      .filter(([, cityNames]) => cityNames.length > 0);
  }, [states, citySearch]);

  // Days until wedding
  const daysUntil = useMemo(() => {
    if (!weddingDate) return null;
    const diff = new Date(weddingDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [weddingDate]);

  // Checklist progress
  const totalItems = checklist.reduce((sum, b) => sum + b.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <section className="min-h-screen bg-gradient-to-br from-shaadi-light via-white to-shaadi-warm-gray">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 py-14 md:py-18 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Plan My Wedding
          </h1>
          <p className="mt-3 text-violet-100 text-base md:text-lg max-w-xl mx-auto">
            Tell us your date and city, and we&apos;ll create a personalized
            wedding checklist with matched vendors.
          </p>

          {/* Progress */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step > s
                      ? "bg-white text-violet-600"
                      : step === s
                      ? "bg-white/20 text-white ring-2 ring-white"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {step > s ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-0.5 rounded ${
                      step > s ? "bg-white" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Step 1 — Wedding Date */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              When is your wedding?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Select your wedding date so we can create a timeline-based
              checklist.
            </p>

            <input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full max-w-xs px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            />

            {daysUntil !== null && daysUntil > 0 && (
              <p className="mt-4 text-sm text-violet-600 font-medium">
                {daysUntil} days to go!
              </p>
            )}

            <div className="mt-8 flex justify-end">
              <button
                disabled={!weddingDate}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — City */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Where is your wedding?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Select your city to find local vendors.
            </p>

            {/* Search */}
            <div className="relative mb-4">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search city..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50">
              {filteredStates.map(([state, cityNames]) => (
                <div key={state}>
                  <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase bg-gray-50 sticky top-0">
                    {state}
                  </p>
                  {cityNames.sort().map((name) => (
                    <button
                      key={`${name}-${state}`}
                      onClick={() => setSelectedCity(name)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        selectedCity === name
                          ? "bg-violet-50 text-violet-700 font-medium"
                          : "text-slate-700 hover:bg-gray-50"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {selectedCity && (
              <p className="mt-3 text-sm text-violet-600 font-medium">
                Selected: {selectedCity}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
              <button
                disabled={!selectedCity}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get My Checklist
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Checklist */}
        {step === 3 && (
          <div>
            {/* Summary header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Your Wedding Checklist
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedCity} &middot;{" "}
                    {new Date(weddingDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {daysUntil !== null && daysUntil > 0 && (
                      <span className="ml-2 text-violet-600 font-medium">
                        ({daysUntil} days to go!)
                      </span>
                    )}
                  </p>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all"
                      style={{
                        width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {checkedCount}/{totalItems}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-4 text-xs text-violet-600 hover:underline"
              >
                Change date or city
              </button>
            </div>

            {/* Timeline buckets */}
            <div className="space-y-5">
              {checklist.map((bucket) => (
                <div
                  key={bucket.label}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{bucket.emoji}</span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {bucket.label}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {bucket.timeframe}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {bucket.items.map((item) => {
                      const cat = getCategoryById(item.categoryId);
                      const key = `${bucket.label}-${item.categoryId}`;
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-4 px-6 py-3.5"
                        >
                          <input
                            type="checkbox"
                            checked={checked[key] || false}
                            onChange={(e) =>
                              setChecked((prev) => ({
                                ...prev,
                                [key]: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 text-violet-500 border-gray-300 rounded focus:ring-violet-400 accent-violet-500 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                checked[key]
                                  ? "text-slate-400 line-through"
                                  : "text-slate-800"
                              }`}
                            >
                              {item.task}
                            </p>
                            {cat && (
                              <p className="text-xs text-slate-400">
                                {cat.emoji} {cat.name}
                              </p>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              item.priority === "high"
                                ? "bg-red-50 text-red-500"
                                : item.priority === "medium"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-gray-50 text-slate-400"
                            }`}
                          >
                            {item.priority}
                          </span>
                          {cat && (
                            <Link
                              href={`/categories/${cat.id}`}
                              className="text-xs font-semibold text-violet-600 hover:underline whitespace-nowrap flex-shrink-0"
                            >
                              Find vendors
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 mb-3">
                Want to explore vendors by wedding event instead?
              </p>
              <Link
                href="/functions"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-shaadi-red border-2 border-shaadi-red/20 rounded-lg hover:bg-shaadi-light transition-colors"
              >
                Browse by Function
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
