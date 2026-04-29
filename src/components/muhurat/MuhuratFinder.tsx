"use client";

import { useMemo, useState } from "react";
import {
  CEREMONY_LABELS,
  GRADE_LABELS,
  MUHURAT_DATES,
  type Ceremony,
  type Grade,
  type Muhurat,
} from "@/lib/muhurat-data";

const MONTHS = [
  "All months",
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const YEARS_AVAILABLE = Array.from(
  new Set(MUHURAT_DATES.map((m) => new Date(m.date).getFullYear())),
).sort();

export function MuhuratFinder() {
  const [year, setYear] = useState<number>(YEARS_AVAILABLE[0] ?? 2026);
  const [monthIdx, setMonthIdx] = useState<number>(0); // 0 = all
  const [ceremony, setCeremony] = useState<Ceremony | "all">("all");
  const [grade, setGrade] = useState<Grade | "all">("all");

  const filtered = useMemo(() => {
    return MUHURAT_DATES.filter((m) => {
      const d = new Date(m.date);
      if (d.getFullYear() !== year) return false;
      if (monthIdx !== 0 && d.getMonth() + 1 !== monthIdx) return false;
      if (ceremony !== "all" && m.ceremony !== ceremony) return false;
      if (grade !== "all" && m.grade !== grade) return false;
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [year, monthIdx, ceremony, grade]);

  return (
    <div className="space-y-8">
      {/* CONTROLS */}
      <div className="bg-cream-soft border border-ink/10 p-5 md:p-6 fade-up">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Year">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="editorial-input w-full"
            >
              {YEARS_AVAILABLE.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </Field>

          <Field label="Month">
            <select
              value={monthIdx}
              onChange={(e) => setMonthIdx(Number(e.target.value))}
              className="editorial-input w-full"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </Field>

          <Field label="Ceremony">
            <select
              value={ceremony}
              onChange={(e) => setCeremony(e.target.value as Ceremony | "all")}
              className="editorial-input w-full"
            >
              <option value="all">All ceremonies</option>
              {(Object.keys(CEREMONY_LABELS) as Ceremony[]).map((c) => (
                <option key={c} value={c}>{CEREMONY_LABELS[c]}</option>
              ))}
            </select>
          </Field>

          <Field label="Grade">
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as Grade | "all")}
              className="editorial-input w-full"
            >
              <option value="all">All grades</option>
              {(Object.keys(GRADE_LABELS) as Grade[]).map((g) => (
                <option key={g} value={g}>{GRADE_LABELS[g]}</option>
              ))}
            </select>
          </Field>
        </div>

        <p className="mt-4 text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft">
          {filtered.length} {filtered.length === 1 ? "date" : "dates"} found
        </p>
      </div>

      {/* RESULTS */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-serif-display text-2xl text-ink mb-3">
            No dates match those filters.
          </p>
          <p className="text-sm text-ink-soft font-light">
            Try widening the month range or grade.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m, i) => (
            <MuhuratCard key={m.date + m.ceremony} muhurat={m} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function MuhuratCard({ muhurat, index }: { muhurat: Muhurat; index: number }) {
  const stagger = `stagger-${Math.min((index % 8) + 1, 8)}`;
  const d = new Date(muhurat.date);
  const dayName = d.toLocaleDateString("en-IN", { weekday: "long" });
  const dateLabel = d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const gradeColor =
    muhurat.grade === "best"
      ? "text-bordeaux"
      : muhurat.grade === "good"
      ? "text-champagne"
      : "text-ink-soft";

  return (
    <article
      className={`bg-cream border border-ink/10 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_10px_24px_-16px_rgba(0,0,0,0.25)] fade-up ${stagger}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft">
            {dayName}
          </p>
          <p className="font-serif-display text-2xl text-ink mt-1 leading-tight">
            {dateLabel}
          </p>
        </div>
        <span className={`text-[0.6rem] uppercase tracking-[0.22em] ${gradeColor} shrink-0 pt-1`}>
          {GRADE_LABELS[muhurat.grade]}
        </span>
      </div>

      <span className="block w-8 h-px bg-champagne my-3" />

      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-bordeaux">
        {CEREMONY_LABELS[muhurat.ceremony]}
      </p>

      <dl className="mt-3 space-y-1 text-xs text-ink-soft">
        <div className="flex justify-between">
          <dt>Tithi</dt>
          <dd className="text-ink">{muhurat.tithi}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Nakshatra</dt>
          <dd className="text-ink">{muhurat.nakshatra}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Paksha</dt>
          <dd className="text-ink capitalize">{muhurat.paksha}</dd>
        </div>
      </dl>

      {muhurat.note && (
        <p className="mt-3 text-xs text-ink-soft/80 italic font-light leading-relaxed border-t border-ink/8 pt-3">
          {muhurat.note}
        </p>
      )}

      <a
        href={`/astro/match`}
        className="mt-4 inline-block text-[0.62rem] uppercase tracking-[0.2em] text-bordeaux hover:text-ink transition-colors"
      >
        Match kundlis for this date →
      </a>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
