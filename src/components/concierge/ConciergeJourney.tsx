"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { CONCIERGE_QUESTIONS, type ChoiceOption } from "@/data/conciergeQuestions";
import { buildConciergePlan, type ConciergePlan, type ConciergeAnswers } from "@/lib/actions/concierge";
import { WEDDING_EVENTS } from "@/data/weddingEvents";
import { SectionDivider } from "@/components/editorial/SectionDivider";

interface City {
  id: string;
  name: string;
  state: string;
}

interface Props {
  cities: City[];
}

const INITIAL_ANSWERS: ConciergeAnswers = {
  guests: "",
  budget: "",
  cityId: "",
  events: [],
  priority: [],
  date: "",
};

const formatINRCompact = (n: number) => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${Math.round(n / 100_000)} L`;
  if (n >= 1_000) return `₹${Math.round(n / 1_000)}K`;
  return `₹${Math.round(n)}`;
};

export function ConciergeJourney({ cities }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ConciergeAnswers>(INITIAL_ANSWERS);
  const [plan, setPlan] = useState<ConciergePlan | null>(null);
  const [pending, startTransition] = useTransition();
  const [transitioning, setTransitioning] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const currentQ = CONCIERGE_QUESTIONS[step];
  const isLast = step === CONCIERGE_QUESTIONS.length - 1;
  const progress = Math.round(((step + (plan ? 1 : 0)) / CONCIERGE_QUESTIONS.length) * 100);

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cities.slice(0, 30);
    const q = citySearch.toLowerCase();
    return cities
      .filter((c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q))
      .slice(0, 30);
  }, [cities, citySearch]);

  function softTransitionTo(nextStep: number, runAfter?: () => void) {
    setTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      runAfter?.();
      setTransitioning(false);
    }, 240);
  }

  function pickChoice(value: string) {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value } as ConciergeAnswers));
    if (!isLast) {
      softTransitionTo(step + 1);
    } else {
      finalize({ ...answers, [currentQ.id]: value } as ConciergeAnswers);
    }
  }

  function toggleMulti(value: string) {
    setAnswers((prev) => {
      const existing = (prev[currentQ.id as keyof ConciergeAnswers] as string[]) ?? [];
      const has = existing.includes(value);
      let next: string[];
      if (has) {
        next = existing.filter((v) => v !== value);
      } else {
        if (currentQ.maxPicks && existing.length >= currentQ.maxPicks) {
          // Replace the oldest pick
          next = [...existing.slice(1), value];
        } else {
          next = [...existing, value];
        }
      }
      return { ...prev, [currentQ.id]: next } as ConciergeAnswers;
    });
  }

  function pickCity(cityId: string) {
    setAnswers((prev) => ({ ...prev, cityId }));
    softTransitionTo(step + 1);
  }

  function pickDate(date: string) {
    setAnswers((prev) => ({ ...prev, date }));
  }

  function continueFromMulti() {
    if (isLast) {
      finalize(answers);
    } else {
      softTransitionTo(step + 1);
    }
  }

  function finalize(finalAnswers: ConciergeAnswers) {
    startTransition(async () => {
      const result = await buildConciergePlan(finalAnswers);
      setPlan(result);
      // Persist to localStorage so /plan/budget can pre-seed
      try {
        window.localStorage.setItem(
          "shaadisetu.concierge.lastPlan",
          JSON.stringify({ answers: finalAnswers, plan: result, savedAt: Date.now() }),
        );
      } catch {
        // ignore
      }
    });
  }

  function startOver() {
    setPlan(null);
    setAnswers(INITIAL_ANSWERS);
    setStep(0);
    setCitySearch("");
  }

  function goBack() {
    if (plan) {
      setPlan(null);
      setStep(CONCIERGE_QUESTIONS.length - 1);
      return;
    }
    if (step > 0) softTransitionTo(step - 1);
  }

  useEffect(() => {
    setCitySearch("");
  }, [step]);

  // ─── RESULT VIEW ───────────────────────────────────────────
  if (plan) {
    return <PlanResults plan={plan} answers={answers} onRestart={startOver} />;
  }

  // ─── PENDING (server building plan) ────────────────────────
  if (pending) {
    return (
      <div className="text-center py-20 fade-in">
        <p className="font-serif-display text-3xl text-bordeaux mb-4">
          Drafting your plan…
        </p>
        <span className="block w-12 h-px bg-champagne mx-auto" />
        <p className="text-sm text-ink-soft mt-4 font-light italic">
          Matching vendors, balancing the budget, writing the brief.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft">
          <span className="block w-1.5 h-1.5 bg-champagne rounded-full animate-pulse" />
          One moment
        </div>
      </div>
    );
  }

  // ─── QUESTION VIEW ─────────────────────────────────────────
  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-3 mb-10">
        <span className="text-[0.65rem] uppercase tracking-[0.28em] text-ink-soft shrink-0">
          {String(step + 1).padStart(2, "0")} / {String(CONCIERGE_QUESTIONS.length).padStart(2, "0")}
        </span>
        <div className="flex-1 h-px bg-ink/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-bordeaux to-champagne transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        {step > 0 && (
          <button
            onClick={goBack}
            className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft hover:text-bordeaux shrink-0"
          >
            ← Back
          </button>
        )}
      </div>

      <div
        key={currentQ.id}
        className={`transition-all duration-300 ${transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0 fade-up"}`}
      >
        <p className="text-[0.7rem] uppercase tracking-[0.32em] text-champagne mb-3">
          The Planner
        </p>
        <p className="font-serif-display italic text-xl md:text-2xl text-bordeaux mb-5">
          &ldquo;{currentQ.plannerLine}&rdquo;
        </p>
        <h3 className="font-serif-display text-3xl md:text-4xl text-ink leading-tight">
          {currentQ.prompt}
        </h3>
        <SectionDivider className="mt-5" />
        <p className="mt-5 text-ink-soft text-sm leading-relaxed font-light max-w-xl">
          {currentQ.subtitle}
        </p>

        <div className="mt-10">
          {currentQ.type === "choice" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options!.map((opt) => (
                <ChoiceTile key={opt.value} option={opt} onClick={() => pickChoice(opt.value)} />
              ))}
            </div>
          )}

          {currentQ.type === "multi" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options!.map((opt) => {
                  const list = (answers[currentQ.id as keyof ConciergeAnswers] as string[]) ?? [];
                  const active = list.includes(opt.value);
                  return (
                    <ChoiceTile
                      key={opt.value}
                      option={opt}
                      active={active}
                      onClick={() => toggleMulti(opt.value)}
                    />
                  );
                })}
              </div>
              <div className="mt-8 flex items-center justify-between">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft">
                  {((answers[currentQ.id as keyof ConciergeAnswers] as string[]) ?? []).length} selected
                  {currentQ.maxPicks ? ` · max ${currentQ.maxPicks}` : ""}
                </p>
                <button
                  onClick={continueFromMulti}
                  disabled={((answers[currentQ.id as keyof ConciergeAnswers] as string[]) ?? []).length === 0}
                  className="btn-editorial disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isLast ? "Build my plan" : "Continue"}
                </button>
              </div>
            </>
          )}

          {currentQ.type === "city" && (
            <div>
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Search city or state…"
                className="editorial-input w-full mb-4"
                autoFocus
              />
              <div className="max-h-72 overflow-y-auto border border-ink/10 divide-y divide-ink/5">
                {filteredCities.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => pickCity(c.id)}
                    className="w-full text-left px-4 py-3 hover:bg-cream-soft transition-colors flex items-baseline justify-between gap-3"
                  >
                    <span className="font-serif-display text-base text-ink">{c.name}</span>
                    <span className="text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft">
                      {c.state}
                    </span>
                  </button>
                ))}
                {filteredCities.length === 0 && (
                  <p className="px-4 py-6 text-center text-ink-soft italic text-sm">
                    No matches. Try a different name.
                  </p>
                )}
              </div>
            </div>
          )}

          {currentQ.type === "date" && (
            <div>
              <input
                type="date"
                value={answers.date}
                onChange={(e) => pickDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="editorial-input w-full max-w-xs"
              />
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => finalize({ ...answers, date: "" })}
                  className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft hover:text-bordeaux"
                >
                  Skip — not sure yet
                </button>
                <button
                  onClick={() => finalize(answers)}
                  className="btn-editorial"
                >
                  Build my plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChoiceTile({
  option,
  active,
  onClick,
}: {
  option: ChoiceOption;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative text-left p-5 border transition-all duration-300 overflow-hidden ${
        active
          ? "border-bordeaux bg-bordeaux text-cream"
          : "border-ink/12 bg-cream hover:border-champagne hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(26,26,26,0.18)]"
      }`}
    >
      <div className="flex items-start gap-3">
        {option.emoji && <span className="text-xl shrink-0">{option.emoji}</span>}
        <div className="min-w-0 flex-1">
          <p className={`font-serif-display text-lg leading-tight ${active ? "text-cream" : "text-ink"}`}>
            {option.label}
          </p>
          {option.hint && (
            <p className={`mt-1 text-[0.65rem] uppercase tracking-[0.22em] ${active ? "text-champagne" : "text-ink-soft"}`}>
              {option.hint}
            </p>
          )}
        </div>
        {active && (
          <span className="text-champagne text-lg shrink-0">✓</span>
        )}
      </div>
    </button>
  );
}

function PlanResults({
  plan,
  answers,
  onRestart,
}: {
  plan: ConciergePlan;
  answers: ConciergeAnswers;
  onRestart: () => void;
}) {
  const eventNames = answers.events
    .map((id) => WEDDING_EVENTS.find((e) => e.id === id)?.name)
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="fade-up">
      <p className="text-[0.7rem] uppercase tracking-[0.32em] text-champagne mb-3">
        The Plan
      </p>
      <h3 className="font-serif-display text-3xl md:text-5xl text-ink leading-tight">
        Here&apos;s how I&apos;d <em className="italic text-bordeaux">build it</em>.
      </h3>
      <SectionDivider className="mt-5" />

      {/* SUMMARY GRID */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-champagne/30 border border-ink/8">
        <SummaryCell label="Guests" value={plan.guestRange} />
        <SummaryCell label="Budget tier" value={plan.budgetTotalLabel} />
        <SummaryCell label="City" value={plan.cityName ?? "—"} />
        <SummaryCell label="Events" value={`${answers.events.length}`} hint={eventNames || "—"} />
      </div>

      {/* PLANNER NOTES */}
      {plan.notes.length > 0 && (
        <div className="mt-10 border border-ink/10 bg-cream-soft p-6">
          <p className="text-[0.65rem] uppercase tracking-[0.28em] text-bordeaux mb-3">
            From the planner
          </p>
          <ul className="space-y-3">
            {plan.notes.map((n, i) => (
              <li key={i} className="text-sm text-ink-soft leading-relaxed font-light italic">
                &ldquo;{n}&rdquo;
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PRIORITY PICKS */}
      {plan.priorityPicks.length > 0 && (
        <div className="mt-12">
          <p className="eyebrow"><span className="eyebrow-num">★</span>Your priorities, vendor by vendor</p>
          <h4 className="font-serif-display text-2xl md:text-3xl text-ink mt-3 leading-tight">
            We&apos;d book these first.
          </h4>
          <SectionDivider className="mt-4" />

          <div className="mt-8 space-y-8">
            {plan.priorityPicks.map((p) => (
              <PriorityBlock key={p.category.id} pick={p} />
            ))}
          </div>
        </div>
      )}

      {/* OTHER PICKS */}
      {plan.fillerPicks.length > 0 && (
        <div className="mt-14">
          <p className="eyebrow"><span className="eyebrow-num">●</span>Everyone else you&apos;ll need</p>
          <h4 className="font-serif-display text-2xl md:text-3xl text-ink mt-3 leading-tight">
            The supporting cast.
          </h4>
          <SectionDivider className="mt-4" />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.fillerPicks.slice(0, 6).map((p) => (
              <CompactPick key={p.category.id} pick={p} />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 border-t border-ink/10 pt-10 text-center">
        <p className="eyebrow">Carry it forward</p>
        <h4 className="font-serif-display text-2xl md:text-3xl text-ink mt-3 leading-tight">
          Two tools are waiting.
        </h4>
        <SectionDivider className="mt-4" />
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link href="/plan/checklist" className="btn-editorial">
            Open the Checklist
          </Link>
          <Link href="/plan/budget" className="btn-editorial-ghost">
            Open the Budget Planner
          </Link>
          <button onClick={onRestart} className="text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft editorial-link">
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCell({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-cream px-5 py-6 text-center">
      <p className="text-[0.6rem] uppercase tracking-[0.24em] text-ink-soft mb-2">
        {label}
      </p>
      <p className="font-serif-display text-lg md:text-xl text-bordeaux leading-tight">
        {value}
      </p>
      {hint && (
        <p className="mt-2 text-[0.55rem] uppercase tracking-[0.2em] text-ink-soft truncate">
          {hint}
        </p>
      )}
    </div>
  );
}

function PriorityBlock({ pick }: { pick: import("@/lib/actions/concierge").PriorityPick }) {
  return (
    <div className="border border-ink/10 bg-cream overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-ink/8 bg-cream-soft">
        <div className="flex items-center gap-3">
          <span className="block w-3 h-3" style={{ background: pick.category.color }} />
          <p className="font-serif-display text-xl text-ink">{pick.category.label}</p>
        </div>
        <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft">
          Allowance · {formatINRCompact(pick.rupeeAllowance)}
        </p>
      </div>
      {pick.vendors.length === 0 ? (
        <p className="px-6 py-8 text-center text-ink-soft italic text-sm">
          We don&apos;t have a fit yet at this budget — try widening the bracket.
        </p>
      ) : (
        <ul className="divide-y divide-ink/8">
          {pick.vendors.map((v) => (
            <li key={v.id} className="px-6 py-4">
              <Link href={`/vendors/v/${v.id}`} className="group flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-serif-display text-lg text-ink group-hover:text-bordeaux transition-colors">
                    {v.name}
                  </p>
                  <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft mt-1">
                    {v.city.name} · {v.priceRange}
                  </p>
                  <p className="mt-2 text-sm text-ink-soft/85 leading-relaxed line-clamp-2">
                    {v.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-champagne text-sm">★ {v.rating.toFixed(1)}</p>
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft mt-1">
                    {v.reviewCount} reviews
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CompactPick({ pick }: { pick: import("@/lib/actions/concierge").PriorityPick }) {
  const top = pick.vendors[0];
  return (
    <div className="border border-ink/10 bg-cream p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="block w-2.5 h-2.5 shrink-0" style={{ background: pick.category.color }} />
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-ink truncate">
            {pick.category.label}
          </p>
        </div>
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft shrink-0">
          {formatINRCompact(pick.rupeeAllowance)}
        </p>
      </div>
      {top ? (
        <Link href={`/vendors/v/${top.id}`} className="block group">
          <p className="font-serif-display text-base text-ink group-hover:text-bordeaux transition-colors">
            {top.name}
          </p>
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft mt-0.5">
            {top.city.name} · {top.priceRange}
          </p>
          {pick.vendors.length > 1 && (
            <p className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-bordeaux editorial-link">
              + {pick.vendors.length - 1} more
            </p>
          )}
        </Link>
      ) : (
        <p className="text-sm text-ink-soft italic">No fit at this budget yet.</p>
      )}
    </div>
  );
}
