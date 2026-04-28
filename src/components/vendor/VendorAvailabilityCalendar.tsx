"use client";
import { useState } from "react";

interface Props {
  bookedDates: string[];
  onSelect?: (iso: string) => void;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function buildMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const last = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= last; d++) cells.push(d);
  return cells;
}

function iso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function VendorAvailabilityCalendar({ bookedDates, onSelect }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const cells = buildMonth(year, month);
  const monthLabel = new Date(year, month, 1).toLocaleString("en-US", { month: "long", year: "numeric" });
  const todayISO = iso(today.getFullYear(), today.getMonth(), today.getDate());

  const step = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Availability</h2>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => step(-1)} className="text-shaadi-deep px-2" aria-label="Previous month">‹</button>
          <span className="font-medium text-slate-900">{monthLabel}</span>
          <button onClick={() => step(1)} className="text-shaadi-deep px-2" aria-label="Next month">›</button>
        </div>
        <div className="grid grid-cols-7 text-center text-[10px] uppercase text-slate-400 mb-1">
          {DAY_LABELS.map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (d === null) return <div key={`b${i}`} />;
            const date = iso(year, month, d);
            const isBookedDay = bookedDates.includes(date);
            const isPast = date < todayISO;
            return (
              <button
                key={date}
                disabled={isPast || isBookedDay}
                onClick={() => onSelect?.(date)}
                aria-label={`${date}${isBookedDay ? " Booked" : isPast ? " Past" : " Available"}`}
                className={`aspect-square text-xs rounded transition-colors ${
                  isBookedDay
                    ? "bg-red-100 text-red-700 cursor-not-allowed"
                    : isPast
                    ? "text-gray-300 cursor-not-allowed"
                    : "bg-shaadi-light text-shaadi-deep hover:bg-shaadi-rose hover:text-white"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-[11px] text-slate-500">
          <span><span className="inline-block w-3 h-3 rounded-sm bg-shaadi-light align-middle mr-1" />Available</span>
          <span><span className="inline-block w-3 h-3 rounded-sm bg-red-100 align-middle mr-1" />Booked</span>
        </div>
      </div>
    </section>
  );
}
