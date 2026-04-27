"use client";

import { useState } from "react";
import Link from "next/link";

// Demo data
const DEMO_VENDOR = {
  name: "Royal Wedding Photography",
  status: "approved" as "pending" | "approved" | "rejected",
  category: "Photography",
  city: "Delhi",
  enquiries: 24,
  views: 1820,
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function VendorDashboard() {
  const [vendor] = useState(DEMO_VENDOR);
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set(["2026-05-10", "2026-05-11", "2026-05-24", "2026-05-25"]));
  const [activeTab, setActiveTab] = useState<"overview" | "dates" | "enquiries">("overview");

  const { firstDay, daysInMonth } = getMonthDays(calYear, calMonth);

  const toggleDate = (dateStr: string) => {
    const newSet = new Set(blockedDates);
    if (newSet.has(dateStr)) {
      newSet.delete(dateStr);
    } else {
      newSet.add(dateStr);
    }
    setBlockedDates(newSet);
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };

  // Status banner
  const StatusBanner = () => {
    if (vendor.status === "pending") {
      return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Verification Pending</p>
            <p className="text-xs text-amber-600 mt-0.5">Your KYC documents are being reviewed. You&apos;ll be notified once verified.</p>
          </div>
        </div>
      );
    }
    if (vendor.status === "rejected") {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-800">Verification Rejected</p>
            <p className="text-xs text-red-600 mt-0.5">Your KYC documents could not be verified. Please contact support or re-submit correct documents.</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="min-h-screen bg-shaadi-warm-gray">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{vendor.name}</h1>
            <p className="text-xs text-slate-500">{vendor.category} &middot; {vendor.city}</p>
          </div>
          <div className="flex items-center gap-2">
            {vendor.status === "approved" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Verified
              </span>
            )}
            <Link href="/" className="text-sm text-slate-500 hover:text-shaadi-red transition-colors">Home</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <StatusBanner />

        {/* Tab navigation */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 w-fit">
          {(["overview", "dates", "enquiries"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                activeTab === tab ? "bg-gradient-to-r from-shaadi-red to-shaadi-rose text-white" : "text-slate-600 hover:text-shaadi-red"
              }`}
            >
              {tab === "dates" ? "Block Dates" : tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-xs text-slate-500 uppercase font-semibold">Total Views</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{vendor.views.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+12% this month</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-xs text-slate-500 uppercase font-semibold">Enquiries</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{vendor.enquiries}</p>
              <p className="text-xs text-green-600 mt-1">+5 this week</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-xs text-slate-500 uppercase font-semibold">Blocked Dates</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{blockedDates.size}</p>
              <p className="text-xs text-slate-400 mt-1">Upcoming unavailable dates</p>
            </div>
          </div>
        )}

        {/* BLOCK DATES TAB */}
        {activeTab === "dates" && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-slate-900">Block Dates</h2>
            </div>
            <p className="text-sm text-slate-500 mb-5">Click on dates to mark yourself as unavailable. Couples won&apos;t be able to book you on blocked dates.</p>

            {/* Calendar */}
            <div className="max-w-md mx-auto">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 className="text-sm font-semibold text-slate-900">{MONTHS[calMonth]} {calYear}</h3>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
                ))}
              </div>

              {/* Date grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = formatDate(new Date(calYear, calMonth, day));
                  const isBlocked = blockedDates.has(dateStr);
                  const isToday = dateStr === formatDate(today);
                  const isPast = new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isPast}
                      onClick={() => toggleDate(dateStr)}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                        isPast
                          ? "text-slate-300 cursor-not-allowed"
                          : isBlocked
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : isToday
                          ? "bg-shaadi-light text-shaadi-red font-bold ring-2 ring-shaadi-rose hover:bg-shaadi-pink hover:text-white"
                          : "text-slate-700 hover:bg-shaadi-light hover:text-shaadi-red"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-500" />
                  Blocked
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-shaadi-light ring-1 ring-shaadi-rose" />
                  Today
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-white border border-gray-200" />
                  Available
                </div>
              </div>
            </div>

            {/* Blocked dates list */}
            {blockedDates.size > 0 && (
              <div className="mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Blocked Dates ({blockedDates.size})</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(blockedDates).sort().map((dateStr) => {
                    const d = new Date(dateStr + "T00:00:00");
                    return (
                      <span key={dateStr} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-full border border-red-200">
                        {d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        <button onClick={() => toggleDate(dateStr)} className="text-red-400 hover:text-red-600">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ENQUIRIES TAB */}
        {activeTab === "enquiries" && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Enquiries</h2>
            <div className="space-y-3">
              {[
                { name: "Priya & Rahul", date: "25 Apr 2026", event: "Wedding, 15 Nov 2026", status: "new" },
                { name: "Anjali & Vikram", date: "23 Apr 2026", event: "Pre-wedding Shoot, 10 Jun 2026", status: "replied" },
                { name: "Sneha & Amit", date: "20 Apr 2026", event: "Reception, 20 Dec 2026", status: "new" },
                { name: "Meera & Karan", date: "18 Apr 2026", event: "Wedding, 8 Feb 2027", status: "replied" },
              ].map((enq, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{enq.name}</p>
                    <p className="text-xs text-slate-500">{enq.event}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                      enq.status === "new" ? "bg-shaadi-light text-shaadi-red" : "bg-green-50 text-green-600"
                    }`}>
                      {enq.status === "new" ? "New" : "Replied"}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">{enq.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
