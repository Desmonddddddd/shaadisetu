"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { DonutChart } from "@/components/editorial/DonutChart";
import { RangeSlider } from "@/components/editorial/RangeSlider";
import { BUDGET_CATEGORIES } from "@/data/budgetCategories";
import type { CategoryBenchmark } from "@/lib/queries/benchmarks";

const STORAGE_KEY = "shaadisetu.budget.v1";

interface BudgetLine {
  id: string;
  vendor: string;
  amount: number;
  paid: boolean;
  notes: string;
}

interface BudgetState {
  total: number;
  allocations: Record<string, number>;
  lines: Record<string, BudgetLine[]>;
}

function defaultAllocations(): Record<string, number> {
  return Object.fromEntries(BUDGET_CATEGORIES.map((c) => [c.id, c.defaultPercent]));
}

const INITIAL: BudgetState = {
  total: 2_500_000,
  allocations: defaultAllocations(),
  lines: {},
};

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const formatINRCompact = (n: number) => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${n}`;
};

export function BudgetApp({ benchmarks }: { benchmarks: CategoryBenchmark[] }) {
  const [state, setState, hydrated] = usePersistentState<BudgetState>(STORAGE_KEY, INITIAL);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const benchmarkByCategory = useMemo(() => {
    const map = new Map<string, CategoryBenchmark>();
    for (const b of benchmarks) map.set(b.categoryId, b);
    return map;
  }, [benchmarks]);

  const allocPercentSum = useMemo(
    () => BUDGET_CATEGORIES.reduce((s, c) => s + (state.allocations[c.id] ?? 0), 0),
    [state.allocations],
  );

  const totalSpent = useMemo(() => {
    return Object.values(state.lines)
      .flat()
      .reduce((s, l) => s + (Number(l.amount) || 0), 0);
  }, [state.lines]);

  const totalPaid = useMemo(() => {
    return Object.values(state.lines)
      .flat()
      .reduce((s, l) => s + (l.paid ? (Number(l.amount) || 0) : 0), 0);
  }, [state.lines]);

  function setAllocation(id: string, percent: number) {
    setState((prev) => ({
      ...prev,
      allocations: { ...prev.allocations, [id]: percent },
    }));
  }

  function setTotal(total: number) {
    setState((prev) => ({ ...prev, total }));
  }

  function rebalanceTo100() {
    const sum = allocPercentSum || 1;
    setState((prev) => ({
      ...prev,
      allocations: Object.fromEntries(
        BUDGET_CATEGORIES.map((c) => [
          c.id,
          Math.round(((prev.allocations[c.id] ?? 0) / sum) * 100),
        ]),
      ),
    }));
  }

  function addLine(categoryId: string) {
    setState((prev) => ({
      ...prev,
      lines: {
        ...prev.lines,
        [categoryId]: [
          ...(prev.lines[categoryId] ?? []),
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            vendor: "",
            amount: 0,
            paid: false,
            notes: "",
          },
        ],
      },
    }));
  }

  function patchLine(categoryId: string, lineId: string, patch: Partial<BudgetLine>) {
    setState((prev) => ({
      ...prev,
      lines: {
        ...prev.lines,
        [categoryId]: (prev.lines[categoryId] ?? []).map((l) =>
          l.id === lineId ? { ...l, ...patch } : l,
        ),
      },
    }));
  }

  function removeLine(categoryId: string, lineId: string) {
    setState((prev) => ({
      ...prev,
      lines: {
        ...prev.lines,
        [categoryId]: (prev.lines[categoryId] ?? []).filter((l) => l.id !== lineId),
      },
    }));
  }

  function resetAll() {
    if (!confirm("Reset budget — total, allocations, and every line item?")) return;
    setState(INITIAL);
  }

  if (!hydrated) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-4">
          <div className="h-12 skeleton-shimmer w-1/2" />
          <div className="h-64 skeleton-shimmer" />
        </div>
      </section>
    );
  }

  const slices = BUDGET_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    value: state.allocations[c.id] ?? 0,
    color: c.color,
  }));

  return (
    <>
      {/* TOTAL */}
      <section className="border-b border-ink/10 bg-cream-soft">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div>
              <label className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft block mb-3">
                Total wedding budget
              </label>
              <div className="flex items-baseline gap-3">
                <span className="font-serif-display text-3xl text-bordeaux">₹</span>
                <input
                  type="number"
                  value={state.total}
                  min={0}
                  step={50_000}
                  onChange={(e) => setTotal(Math.max(0, Number(e.target.value) || 0))}
                  className="editorial-input font-serif-display text-3xl md:text-4xl text-ink py-1 w-full"
                />
              </div>
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft mt-2">
                {formatINRCompact(state.total)}
              </p>
            </div>

            <Stat label="Allocated" value={`${allocPercentSum}%`} hint={allocPercentSum === 100 ? "Balanced." : `${allocPercentSum > 100 ? "Over by" : "Under by"} ${Math.abs(100 - allocPercentSum)}%`} />
            <Stat label="Spent so far" value={formatINRCompact(totalSpent)} hint={`${formatINRCompact(totalPaid)} paid`} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={rebalanceTo100}
              disabled={allocPercentSum === 100}
              className="text-[0.65rem] uppercase tracking-[0.22em] text-bordeaux editorial-link disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Auto-rebalance to 100%
            </button>
            <button
              onClick={resetAll}
              className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft hover:text-bordeaux"
            >
              Reset all
            </button>
          </div>
        </div>
      </section>

      {/* DONUT + LEGEND */}
      <section className="py-12 md:py-16 border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-12 items-start">
            <div className="flex justify-center">
              <DonutChart
                slices={slices}
                size={280}
                thickness={32}
                centerValue={`${allocPercentSum}%`}
                centerLabel="Allocated"
              />
            </div>

            <div>
              <p className="eyebrow"><span className="eyebrow-num">01</span>Allocations</p>
              <h2 className="font-serif-display text-3xl md:text-4xl text-ink mt-3 leading-tight">
                Drag the sliders. Watch the donut shift.
              </h2>
              <p className="mt-3 text-ink-soft text-sm leading-relaxed">
                Your numbers, your wedding. The defaults are a sane starting point —
                roughly what well-planned Indian weddings actually spend.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                {BUDGET_CATEGORIES.map((c) => {
                  const pct = state.allocations[c.id] ?? 0;
                  const rupees = Math.round((pct / 100) * state.total);
                  return (
                    <div key={c.id}>
                      <div className="flex items-baseline justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="block w-2.5 h-2.5 shrink-0" style={{ background: c.color }} />
                          <span className="text-[0.7rem] uppercase tracking-[0.18em] text-ink truncate">{c.label}</span>
                        </div>
                        <span className="font-serif-display text-base text-bordeaux shrink-0">
                          {pct}%
                        </span>
                      </div>
                      <RangeSlider
                        value={pct}
                        max={50}
                        onChange={(v) => setAllocation(c.id, v)}
                        ariaLabel={`Allocate ${c.label}`}
                      />
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft mt-1">
                        {formatINRCompact(rupees)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LINE ITEMS */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="eyebrow"><span className="eyebrow-num">02</span>Line items</p>
            <h2 className="font-serif-display text-3xl md:text-4xl text-ink mt-3 leading-tight">
              Track every payment.
            </h2>
            <p className="mt-3 text-ink-soft text-sm leading-relaxed max-w-xl mx-auto">
              Click a category to expand. Add the vendor, the amount, mark it paid.
              The donut shows allocations; this is where reality lives.
            </p>
          </div>

          <div className="space-y-3">
            {BUDGET_CATEGORIES.map((c) => {
              const lines = state.lines[c.id] ?? [];
              const spent = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);
              const allocRupees = Math.round(((state.allocations[c.id] ?? 0) / 100) * state.total);
              const overspent = spent > allocRupees && allocRupees > 0;
              const isOpen = activeCategory === c.id;
              const benchmark = benchmarkByCategory.get(c.vendorCategoryId ?? "");

              return (
                <div key={c.id} className="editorial-card">
                  <button
                    onClick={() => setActiveCategory(isOpen ? null : c.id)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="block w-3 h-3 shrink-0" style={{ background: c.color }} />
                      <div className="min-w-0">
                        <h3 className="font-serif-display text-lg md:text-xl text-ink group-hover:text-bordeaux transition-colors">
                          {c.label}
                        </h3>
                        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft mt-0.5 truncate">
                          {c.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <p className={`font-serif-display text-lg ${overspent ? "text-bordeaux" : "text-ink"}`}>
                          {formatINRCompact(spent)}
                        </p>
                        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft">
                          of {formatINRCompact(allocRupees)}
                        </p>
                      </div>
                      <span className="text-champagne text-2xl transition-transform" style={{ transform: isOpen ? "rotate(45deg)" : "none" }}>
                        +
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-ink/8">
                      {benchmark && benchmark.modePriceRange && (
                        <div className="px-6 py-4 bg-cream-soft border-b border-ink/8">
                          <p className="text-[0.6rem] uppercase tracking-[0.22em] text-bordeaux mb-1">
                            Vendor benchmark
                          </p>
                          <p className="text-sm text-ink-soft leading-relaxed">
                            On ShaadiSetu, most {c.label.toLowerCase()} vendors sit in the{" "}
                            <span className="font-medium text-ink">{benchmark.modePriceRange}</span>{" "}
                            band, across {benchmark.vendorCount} listed vendors.
                          </p>
                          <Link
                            href={`/vendors?category=${encodeURIComponent(c.vendorCategoryId ?? "")}`}
                            className="text-[0.6rem] uppercase tracking-[0.2em] text-bordeaux editorial-link mt-2 inline-block"
                          >
                            Browse {c.label.toLowerCase()} →
                          </Link>
                        </div>
                      )}

                      <div className="divide-y divide-ink/8">
                        {lines.length === 0 && (
                          <p className="px-6 py-6 text-center text-ink-soft italic text-sm">
                            No line items yet.
                          </p>
                        )}
                        {lines.map((l) => (
                          <div key={l.id} className="px-6 py-4 grid grid-cols-1 md:grid-cols-[2fr,1fr,auto,auto] gap-3 items-start">
                            <input
                              type="text"
                              value={l.vendor}
                              onChange={(e) => patchLine(c.id, l.id, { vendor: e.target.value })}
                              placeholder="Vendor or item"
                              className="editorial-input"
                            />
                            <input
                              type="number"
                              value={l.amount || ""}
                              onChange={(e) => patchLine(c.id, l.id, { amount: Number(e.target.value) || 0 })}
                              placeholder="Amount"
                              min={0}
                              className="editorial-input"
                            />
                            <label className="flex items-center gap-2 px-3 py-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={l.paid}
                                onChange={(e) => patchLine(c.id, l.id, { paid: e.target.checked })}
                                className="accent-bordeaux w-4 h-4"
                              />
                              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
                                Paid
                              </span>
                            </label>
                            <button
                              onClick={() => removeLine(c.id, l.id)}
                              className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft hover:text-bordeaux px-3 py-2"
                            >
                              Remove
                            </button>
                            <textarea
                              value={l.notes}
                              onChange={(e) => patchLine(c.id, l.id, { notes: e.target.value })}
                              placeholder="Notes — booking ref, payment date, anything…"
                              rows={1}
                              className="editorial-input md:col-span-4 resize-y text-sm"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="px-6 py-4 border-t border-ink/8">
                        <button
                          onClick={() => addLine(c.id)}
                          className="text-[0.7rem] uppercase tracking-[0.22em] text-bordeaux editorial-link"
                        >
                          + Add line item
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="border-t border-ink/10 py-12 text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft mb-4">
          Working on the timeline too?
        </p>
        <Link href="/plan/checklist" className="btn-editorial-ghost">
          Open Wedding Checklist
        </Link>
      </section>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft">
        {label}
      </p>
      <p className="font-serif-display text-3xl md:text-4xl text-ink mt-1">{value}</p>
      {hint && (
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft/70 mt-1">{hint}</p>
      )}
    </div>
  );
}
