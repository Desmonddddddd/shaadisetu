# Planning Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single `/plan` wizard with a Planning hub that houses two deep tools — Wedding Checklist and Budget Planner — both styled in the editorial design system, both persisted to localStorage.

**Architecture:** `/plan` becomes a hub page listing the tools. Two new full pages live at `/plan/checklist` and `/plan/budget`. State persists per-tool in `localStorage` via a small typed hook (`usePersistentState`). All UI uses existing editorial primitives (`SectionDivider`, `RevealOnScroll`, `FadeOnScroll`, `CountUp`, `EyebrowLabel`) plus three new ones (`PrimitiveCheckbox`, `DonutChart`, `RangeSlider`). Vendor benchmarks pull from existing Prisma `priceRange` data via a new server query.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Prisma 6, existing editorial CSS tokens (`bg-cream`, `text-ink`, `text-bordeaux`, `text-champagne`, `font-serif-display`).

---

## File Structure

**Created:**
- `src/app/plan/page.tsx` — hub page (replaces existing wizard)
- `src/app/plan/checklist/page.tsx` — checklist server shell (loads default tasks data)
- `src/app/plan/checklist/ChecklistApp.tsx` — client app with persistence + interactions
- `src/app/plan/budget/page.tsx` — budget server shell (loads benchmark data)
- `src/app/plan/budget/BudgetApp.tsx` — client app with persistence + interactions
- `src/data/checklistDefaults.ts` — default task templates (replaces inline data in old wizard)
- `src/data/budgetCategories.ts` — default category allocations and emojis
- `src/lib/queries/benchmarks.ts` — `getVendorBenchmarks()` server query
- `src/lib/hooks/usePersistentState.ts` — typed localStorage hook with SSR safety
- `src/components/editorial/PrimitiveCheckbox.tsx` — editorial checkbox
- `src/components/editorial/DonutChart.tsx` — animated SVG donut for budget split
- `src/components/editorial/RangeSlider.tsx` — bordeaux/champagne styled slider

**Modified:**
- `src/components/Navbar.tsx` (only the desktop nav array) — keep "Planning" → `/plan` (no change to URL but underlying page changes)
- `src/components/MobileMenu.tsx` (only "Planning Tools" link target) — same target, mention the hub
- `src/app/globals.css` — add `.editorial-checkbox`, `.range-slider` style helpers and a `donut-segment-draw` keyframe

**Deleted:** None — old `/plan/page.tsx` is overwritten in place.

---

## Task 1: Persistent state hook

**Files:**
- Create: `src/lib/hooks/usePersistentState.ts`

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hydration-safe persistent state. On first render returns `initial` so SSR
 * markup matches the client; after mount it reads localStorage and replaces
 * state if a stored value is found. Writes are JSON-serialized.
 *
 * Use a stable, namespaced key (e.g. "shaadisetu.checklist.v1") so future
 * schema changes can bump the version without colliding with old data.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const initialRef = useRef(initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // Corrupt JSON or no localStorage; fall through to initial.
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or private mode; ignore.
    }
  }, [key, value, hydrated]);

  // Expose `hydrated` so callers can avoid showing stale defaults during the
  // brief moment before localStorage is read.
  return [value, setValue, hydrated];
}

/** Reset both in-memory state and localStorage for a key. */
export function clearPersistentState(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore.
  }
}
```

- [ ] **Step 2: Manual smoke**

Open the dev console while the app is running and run:

```js
const k = "smoketest.v1";
localStorage.setItem(k, JSON.stringify({ a: 1 }));
JSON.parse(localStorage.getItem(k))
```

Expected: `{ a: 1 }`. This just verifies the storage layer is available; the hook is exercised in later tasks.

- [ ] **Step 3: Commit**

```bash
git add src/lib/hooks/usePersistentState.ts
git commit -m "feat(plan): persistent state hook with hydration safety"
```

---

## Task 2: Editorial Checkbox primitive

**Files:**
- Create: `src/components/editorial/PrimitiveCheckbox.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}

/**
 * Square ink-on-cream checkbox with a champagne tick. Used by the checklist
 * for task completion. Keeping it presentational; consumers control state.
 */
export function PrimitiveCheckbox({
  checked,
  onChange,
  label,
  ariaLabel,
  className = "",
}: Props) {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
        aria-label={ariaLabel}
      />
      <span
        aria-hidden
        className={`w-[18px] h-[18px] flex items-center justify-center border transition-all ${
          checked
            ? "bg-ink border-ink"
            : "bg-cream border-ink/25 peer-focus:border-champagne"
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-champagne" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
          </svg>
        )}
      </span>
      {label !== undefined && <span className="flex-1 min-w-0">{label}</span>}
    </label>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/editorial/PrimitiveCheckbox.tsx
git commit -m "feat(editorial): PrimitiveCheckbox component"
```

---

## Task 3: Donut chart primitive

**Files:**
- Create: `src/components/editorial/DonutChart.tsx`
- Modify: `src/app/globals.css` (append a keyframe)

- [ ] **Step 1: Append CSS keyframe**

Append to the bottom of `src/app/globals.css`:

```css
@keyframes donut-stroke {
  from { stroke-dashoffset: var(--dash-len); }
  to   { stroke-dashoffset: var(--dash-end); }
}

.donut-segment {
  animation: donut-stroke 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

- [ ] **Step 2: Write the component**

```tsx
"use client";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  segments: Segment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

/**
 * Animated SVG donut. Each segment draws in via a stroke-dashoffset
 * animation; we compute cumulative offsets so segments lay out around
 * a single circle instead of stacking.
 */
export function DonutChart({
  segments,
  size = 220,
  thickness = 22,
  centerLabel,
  centerValue,
}: Props) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, x) => s + Math.max(0, x.value), 0);

  let offsetSoFar = 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(26,26,26,0.08)"
          strokeWidth={thickness}
        />
        {total > 0 &&
          segments.map((s, i) => {
            const fraction = Math.max(0, s.value) / total;
            const dashLen = circumference * fraction;
            const dashGap = circumference - dashLen;
            const startOffset = -offsetSoFar;
            offsetSoFar += dashLen;
            return (
              <circle
                key={`${s.label}-${i}`}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${dashLen} ${dashGap}`}
                strokeDashoffset={startOffset}
                strokeLinecap="butt"
                style={
                  {
                    "--dash-len": `${circumference}`,
                    "--dash-end": `${startOffset}`,
                    animationDelay: `${i * 90}ms`,
                  } as React.CSSProperties
                }
                className="donut-segment"
              />
            );
          })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerValue && (
            <span className="font-serif-display text-3xl text-ink">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft mt-1">
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/editorial/DonutChart.tsx src/app/globals.css
git commit -m "feat(editorial): animated DonutChart component"
```

---

## Task 4: Range slider primitive

**Files:**
- Create: `src/components/editorial/RangeSlider.tsx`
- Modify: `src/app/globals.css` (append slider styles)

- [ ] **Step 1: Append CSS**

Append to the bottom of `src/app/globals.css`:

```css
.range-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 2px;
  background: rgba(26, 26, 26, 0.15);
  outline: none;
  cursor: pointer;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #6b1f2a;
  border: 2px solid #c9a86a;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.range-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.range-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #6b1f2a;
  border: 2px solid #c9a86a;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.range-slider::-moz-range-thumb:hover {
  transform: scale(1.15);
}
```

- [ ] **Step 2: Write the component**

```tsx
"use client";

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  ariaLabel?: string;
}

export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  ariaLabel,
}: Props) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={ariaLabel}
      className="range-slider"
    />
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/editorial/RangeSlider.tsx src/app/globals.css
git commit -m "feat(editorial): RangeSlider component with bordeaux/champagne styling"
```

---

## Task 5: Default checklist data

**Files:**
- Create: `src/data/checklistDefaults.ts`

- [ ] **Step 1: Write the data module**

```ts
export type Priority = "high" | "medium" | "low";

export interface DefaultTask {
  id: string;             // stable id for migrations + react keys
  bucket: string;         // timeline bucket label
  task: string;
  categoryId: string;     // matches Prisma Category.id
  priority: Priority;
}

export interface TimelineBucket {
  id: string;
  label: string;
  timeframe: string;
  emoji: string;
  /** Months before the wedding date when this bucket starts. */
  monthsBefore: number;
}

export const TIMELINE_BUCKETS: TimelineBucket[] = [
  { id: "6plus", label: "6+ Months Before", timeframe: "Start early for the best options", emoji: "🗓", monthsBefore: 6 },
  { id: "3to6", label: "3–6 Months Before", timeframe: "Lock in the main vendors", emoji: "🎯", monthsBefore: 3 },
  { id: "1to3", label: "1–3 Months Before", timeframe: "Fine-tune every detail", emoji: "✨", monthsBefore: 1 },
  { id: "2weeks", label: "2 Weeks Before", timeframe: "Final preparations", emoji: "📋", monthsBefore: 0.5 },
  { id: "week", label: "Wedding Week", timeframe: "You've got this!", emoji: "🎉", monthsBefore: 0 },
];

export const DEFAULT_TASKS: DefaultTask[] = [
  // 6+ months
  { id: "venue-book", bucket: "6plus", task: "Book your wedding venue", categoryId: "venues", priority: "high" },
  { id: "planner-hire", bucket: "6plus", task: "Hire a wedding planner", categoryId: "planning", priority: "high" },
  { id: "photo-book", bucket: "6plus", task: "Book photographer & videographer", categoryId: "photography", priority: "high" },
  { id: "caterer-book", bucket: "6plus", task: "Finalize caterer", categoryId: "catering", priority: "high" },

  // 3–6 months
  { id: "decor-book", bucket: "3to6", task: "Book decorator & theme setup", categoryId: "decor", priority: "high" },
  { id: "ent-book", bucket: "3to6", task: "Book entertainment (DJ, band, etc.)", categoryId: "entertainment", priority: "medium" },
  { id: "outfits", bucket: "3to6", task: "Shop for bridal & groom outfits", categoryId: "attire", priority: "high" },
  { id: "invites", bucket: "3to6", task: "Design and send invitations", categoryId: "invitations", priority: "medium" },

  // 1–3 months
  { id: "makeup", bucket: "1to3", task: "Book makeup artist & trials", categoryId: "beauty", priority: "high" },
  { id: "jewelry", bucket: "1to3", task: "Finalize jewellery & accessories", categoryId: "jewelry", priority: "medium" },
  { id: "favours", bucket: "1to3", task: "Order wedding favours & return gifts", categoryId: "gifts", priority: "medium" },
  { id: "transport", bucket: "1to3", task: "Arrange transport & logistics", categoryId: "logistics", priority: "medium" },
  { id: "pandit", bucket: "1to3", task: "Book pandit & arrange ritual items", categoryId: "rituals", priority: "high" },

  // 2 weeks
  { id: "guests-confirm", bucket: "2weeks", task: "Confirm guest list & hotel bookings", categoryId: "logistics", priority: "high" },
  { id: "registration", bucket: "2weeks", task: "Prepare marriage registration documents", categoryId: "planning", priority: "medium" },
  { id: "prebridal", bucket: "2weeks", task: "Begin pre-bridal beauty treatments", categoryId: "beauty", priority: "medium" },
  { id: "welcome-kits", bucket: "2weeks", task: "Prepare welcome kits for guests", categoryId: "gifts", priority: "low" },

  // Week of
  { id: "vendor-confirm", bucket: "week", task: "Confirm all vendor arrivals & timings", categoryId: "planning", priority: "high" },
  { id: "final-makeup", bucket: "week", task: "Final grooming & makeup appointments", categoryId: "beauty", priority: "high" },
  { id: "honeymoon", bucket: "week", task: "Confirm honeymoon bookings", categoryId: "honeymoon", priority: "low" },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/checklistDefaults.ts
git commit -m "feat(plan): default checklist tasks and timeline buckets"
```

---

## Task 6: Default budget categories

**Files:**
- Create: `src/data/budgetCategories.ts`

- [ ] **Step 1: Write the data module**

```ts
export interface BudgetCategoryDefault {
  id: string;          // matches Prisma Category.id where applicable
  label: string;
  emoji: string;
  /** Suggested percentage of total budget (sums to 100). */
  defaultPct: number;
  /** Champagne / bordeaux / ink-tinted color for chart segments. */
  color: string;
}

/** Sums to 100. Order is the rendering order in the legend. */
export const BUDGET_CATEGORIES: BudgetCategoryDefault[] = [
  { id: "venues",         label: "Venue",          emoji: "🏛", defaultPct: 25, color: "#6b1f2a" },
  { id: "catering",       label: "Catering",       emoji: "🍛", defaultPct: 22, color: "#8a2a36" },
  { id: "decor",          label: "Decor",          emoji: "🌸", defaultPct: 12, color: "#c9a86a" },
  { id: "photography",    label: "Photography",    emoji: "📸", defaultPct: 10, color: "#d9bf8a" },
  { id: "attire",         label: "Attire",         emoji: "👗", defaultPct: 8,  color: "#a36b4a" },
  { id: "jewelry",        label: "Jewellery",      emoji: "💍", defaultPct: 6,  color: "#7a4a2a" },
  { id: "entertainment",  label: "Entertainment",  emoji: "🎶", defaultPct: 4,  color: "#3a3a3a" },
  { id: "beauty",         label: "Beauty",         emoji: "💄", defaultPct: 3,  color: "#b07f6a" },
  { id: "rituals",        label: "Rituals & Pandit", emoji: "🪔", defaultPct: 3,  color: "#4a1620" },
  { id: "invitations",    label: "Invitations",    emoji: "✉️", defaultPct: 2,  color: "#9a7350" },
  { id: "gifts",          label: "Gifts & Favours", emoji: "🎁", defaultPct: 2,  color: "#cda88a" },
  { id: "logistics",      label: "Logistics",      emoji: "🚌", defaultPct: 2,  color: "#1a1a1a" },
  { id: "buffer",         label: "Buffer",         emoji: "🪙", defaultPct: 1,  color: "#e8d5d0" },
];
```

- [ ] **Step 2: Sanity-check the percentages**

Run a one-liner to confirm they sum to 100:

```bash
node -e "console.log(require('./src/data/budgetCategories.ts'))" 2>/dev/null \
  || grep "defaultPct:" src/data/budgetCategories.ts | awk -F'defaultPct: ' '{print $2}' | awk -F',' '{s+=$1} END {print s}'
```

Expected output: `100`. If different, edit the percentages and re-run.

- [ ] **Step 3: Commit**

```bash
git add src/data/budgetCategories.ts
git commit -m "feat(plan): default budget categories with allocations"
```

---

## Task 7: Vendor benchmark query

**Files:**
- Create: `src/lib/queries/benchmarks.ts`

- [ ] **Step 1: Write the query**

```ts
import { db } from "@/lib/db";

export interface CategoryBenchmark {
  categoryId: string;
  /** Most-common priceRange string for this category, or null if none. */
  modePriceRange: string | null;
  /** Number of vendors in this category. */
  vendorCount: number;
}

/**
 * Per-category vendor pricing benchmarks. We don't store numeric prices in
 * the DB (priceRange is a label like "₹50K-₹1L"); this returns the most
 * common range so the budget planner can hint "average venue: ₹X–₹Y".
 */
export async function getVendorBenchmarks(): Promise<CategoryBenchmark[]> {
  const rows = await db.vendor.findMany({
    where: { moderationState: "live" },
    select: { categoryId: true, priceRange: true },
  });

  const byCat = new Map<string, Map<string, number>>();
  for (const r of rows) {
    if (!byCat.has(r.categoryId)) byCat.set(r.categoryId, new Map());
    const inner = byCat.get(r.categoryId)!;
    inner.set(r.priceRange, (inner.get(r.priceRange) ?? 0) + 1);
  }

  const out: CategoryBenchmark[] = [];
  for (const [categoryId, ranges] of byCat) {
    let mode: string | null = null;
    let modeCount = 0;
    let total = 0;
    for (const [range, n] of ranges) {
      total += n;
      if (n > modeCount) {
        mode = range;
        modeCount = n;
      }
    }
    out.push({ categoryId, modePriceRange: mode, vendorCount: total });
  }

  return out;
}
```

- [ ] **Step 2: Manual smoke**

Run a one-shot Node check against the live DB:

```bash
cat > /tmp/check_benchmarks.mjs <<'JS'
import { getVendorBenchmarks } from "./src/lib/queries/benchmarks.ts";
const out = await getVendorBenchmarks();
console.log(out.slice(0, 5));
JS
set -a; . ./.env.local; set +a; ./scripts/with-ca.sh npx tsx /tmp/check_benchmarks.mjs
```

Expected: an array of `{ categoryId, modePriceRange, vendorCount }` rows for at least the top categories. If empty, seed the DB first.

- [ ] **Step 3: Commit**

```bash
git add src/lib/queries/benchmarks.ts
git commit -m "feat(plan): vendor pricing benchmark query"
```

---

## Task 8: Planning hub page

**Files:**
- Create: `src/app/plan/page.tsx` (overwrites the existing wizard)

- [ ] **Step 1: Replace the page entirely**

Write `src/app/plan/page.tsx`:

```tsx
import Link from "next/link";
import { RevealOnScroll } from "@/components/editorial/RevealOnScroll";
import { SectionDivider } from "@/components/editorial/SectionDivider";

export const metadata = {
  title: "Planning Tools — ShaadiSetu",
  description:
    "A wedding checklist and a budget planner — two editorial tools for the most logistically demanding day of your life.",
};

const TOOLS = [
  {
    href: "/plan/checklist",
    eyebrow: "Tool · 01",
    title: "Wedding Checklist",
    blurb:
      "A timeline-aware, fully editable checklist. Add custom tasks, set due dates, jot vendor notes, filter by priority — all saved to your browser.",
    bullets: ["Custom tasks with notes", "Smart due-date warnings", "Filter & sort", "Auto-saved locally"],
    cta: "Open Checklist",
    cover:
      "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80')",
  },
  {
    href: "/plan/budget",
    eyebrow: "Tool · 02",
    title: "Budget Planner",
    blurb:
      "Set a total, get a recommended split across thirteen categories, and track every line item. Live charts compare what you've allocated to what you've spent.",
    bullets: ["Drag-adjust allocation", "Per-line spend tracking", "Animated donut visual", "Real vendor benchmarks"],
    cta: "Open Budget Planner",
    cover:
      "url('https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1600&q=80')",
  },
];

export default function PlanHub() {
  return (
    <main className="bg-cream text-ink">
      <section className="relative overflow-hidden border-b border-ink/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/85" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 fade-up">
            <span className="block w-12 h-px bg-champagne" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-champagne">
              Planning Tools
            </p>
            <span className="block w-12 h-px bg-champagne" />
          </div>
          <h1 className="fade-up stagger-1 font-serif-display text-4xl md:text-6xl text-cream leading-[1.05]">
            Bring order to the <span className="italic text-champagne">chaos.</span>
          </h1>
          <p className="fade-up stagger-2 mt-6 text-cream/80 max-w-xl mx-auto leading-relaxed font-light">
            Two tools we built because spreadsheets weren&apos;t cutting it. Both
            free. Both private — they save to your browser, never to our servers.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {TOOLS.map((t, i) => (
            <RevealOnScroll key={t.href} delay={i * 80}>
              <Link href={t.href} className="editorial-card block group h-full overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    style={{ backgroundImage: t.cover }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                  <p className="absolute top-4 left-5 text-[0.62rem] uppercase tracking-[0.28em] text-champagne">
                    {t.eyebrow}
                  </p>
                </div>
                <div className="p-7 flex flex-col gap-4">
                  <h2 className="font-serif-display text-3xl md:text-4xl text-ink leading-tight group-hover:text-bordeaux transition-colors">
                    {t.title}
                  </h2>
                  <span className="block w-10 h-px bg-champagne transition-all duration-500 group-hover:w-20" />
                  <p className="text-ink-soft font-light leading-relaxed">{t.blurb}</p>
                  <ul className="text-sm text-ink-soft/85 space-y-1.5 list-none">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="text-champagne mt-1">◆</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="btn-editorial-ghost mt-4 self-start">{t.cta}</span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-20 max-w-3xl mx-auto px-6 text-center">
          <SectionDivider />
          <p className="mt-6 text-ink-soft text-sm font-light">
            More tools — guest list manager, RSVP tracker, day-of timeline —
            arrive next quarter.
          </p>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Build**

```bash
./scripts/with-ca.sh npx next build
```

Expected: build completes; `/plan` is listed as a static (`○`) route. No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/plan/page.tsx
git commit -m "feat(plan): editorial planning hub at /plan"
```

---

## Task 9: Checklist server shell

**Files:**
- Create: `src/app/plan/checklist/page.tsx`

- [ ] **Step 1: Write the server page**

```tsx
import { ChecklistApp } from "./ChecklistApp";
import { TIMELINE_BUCKETS, DEFAULT_TASKS } from "@/data/checklistDefaults";

export const metadata = {
  title: "Wedding Checklist — ShaadiSetu",
  description:
    "A timeline-aware wedding checklist. Custom tasks, due dates, notes, filter & sort — all saved to your browser.",
};

export default function ChecklistPage() {
  return <ChecklistApp buckets={TIMELINE_BUCKETS} defaults={DEFAULT_TASKS} />;
}
```

- [ ] **Step 2: Commit (deferred — gets bundled with Task 10's commit)**

No commit yet; the `ChecklistApp` import won't resolve until Task 10. Move on.

---

## Task 10: Checklist client app

**Files:**
- Create: `src/app/plan/checklist/ChecklistApp.tsx`

This is the largest task in the plan. Breaking the implementation into steps.

- [ ] **Step 1: Define the state shape**

Create `src/app/plan/checklist/ChecklistApp.tsx` with the type definitions and the persistence key:

```tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePersistentState, clearPersistentState } from "@/lib/hooks/usePersistentState";
import { PrimitiveCheckbox } from "@/components/editorial/PrimitiveCheckbox";
import { SectionDivider } from "@/components/editorial/SectionDivider";
import { CountUp } from "@/components/editorial/CountUp";
import type { Priority, DefaultTask, TimelineBucket } from "@/data/checklistDefaults";

const STORAGE_KEY = "shaadisetu.checklist.v1";

interface UserTask {
  id: string;            // stable id
  source: "default" | "custom";
  bucket: string;        // bucket id
  task: string;
  categoryId: string;
  priority: Priority;
  dueDate: string | null;   // ISO yyyy-mm-dd
  note: string;
  done: boolean;
}

interface ChecklistState {
  weddingDate: string;   // ISO yyyy-mm-dd ("" if unset)
  tasks: UserTask[];     // includes mutated defaults + custom additions
  removedDefaultIds: string[]; // ids of defaults the user deleted
  filter: { priority: Priority | "all"; status: "all" | "open" | "done" };
  sort: "priority" | "dueDate" | "bucket";
}

function buildInitialTasks(defaults: DefaultTask[]): UserTask[] {
  return defaults.map((d) => ({
    id: `default-${d.id}`,
    source: "default",
    bucket: d.bucket,
    task: d.task,
    categoryId: d.categoryId,
    priority: d.priority,
    dueDate: null,
    note: "",
    done: false,
  }));
}
```

- [ ] **Step 2: Add the component skeleton**

Append to the same file:

```tsx
interface Props {
  buckets: TimelineBucket[];
  defaults: DefaultTask[];
}

export function ChecklistApp({ buckets, defaults }: Props) {
  const initial: ChecklistState = useMemo(
    () => ({
      weddingDate: "",
      tasks: buildInitialTasks(defaults),
      removedDefaultIds: [],
      filter: { priority: "all", status: "all" },
      sort: "bucket",
    }),
    [defaults],
  );

  const [state, setState, hydrated] = usePersistentState<ChecklistState>(STORAGE_KEY, initial);

  // Derived progress numbers.
  const visibleTasks = state.tasks.filter((t) => !state.removedDefaultIds.includes(t.id));
  const total = visibleTasks.length;
  const done = visibleTasks.filter((t) => t.done).length;

  // Days until wedding.
  const daysUntil = useMemo(() => {
    if (!state.weddingDate) return null;
    const diff = new Date(state.weddingDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [state.weddingDate]);

  // Filter + sort.
  const filtered = useMemo(() => {
    let list = visibleTasks;
    if (state.filter.priority !== "all") {
      list = list.filter((t) => t.priority === state.filter.priority);
    }
    if (state.filter.status === "open") list = list.filter((t) => !t.done);
    if (state.filter.status === "done") list = list.filter((t) => t.done);

    const priOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    const bucketOrder = new Map(buckets.map((b, i) => [b.id, i]));

    if (state.sort === "priority") {
      list = [...list].sort((a, b) => priOrder[a.priority] - priOrder[b.priority]);
    } else if (state.sort === "dueDate") {
      list = [...list].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    } else {
      list = [...list].sort(
        (a, b) =>
          (bucketOrder.get(a.bucket) ?? 99) - (bucketOrder.get(b.bucket) ?? 99),
      );
    }
    return list;
  }, [visibleTasks, state.filter, state.sort, buckets]);

  // Group into buckets when sort === "bucket".
  const grouped = useMemo(() => {
    if (state.sort !== "bucket") return null;
    const map = new Map<string, UserTask[]>();
    for (const b of buckets) map.set(b.id, []);
    for (const t of filtered) {
      if (!map.has(t.bucket)) map.set(t.bucket, []);
      map.get(t.bucket)!.push(t);
    }
    return map;
  }, [filtered, buckets, state.sort]);

  // Mutators (defined inside the component because they close over setState).
  function toggleDone(id: string) {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }
  function updateTask(id: string, patch: Partial<UserTask>) {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }
  function removeTask(id: string) {
    setState((s) => {
      const t = s.tasks.find((x) => x.id === id);
      if (!t) return s;
      if (t.source === "default") {
        return { ...s, removedDefaultIds: [...s.removedDefaultIds, id] };
      }
      return { ...s, tasks: s.tasks.filter((x) => x.id !== id) };
    });
  }
  function addTask(input: { bucket: string; task: string; priority: Priority; categoryId: string }) {
    const newTask: UserTask = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      source: "custom",
      bucket: input.bucket,
      task: input.task,
      categoryId: input.categoryId,
      priority: input.priority,
      dueDate: null,
      note: "",
      done: false,
    };
    setState((s) => ({ ...s, tasks: [...s.tasks, newTask] }));
  }
  function resetAll() {
    if (!confirm("Reset checklist to defaults? Your custom tasks and notes will be lost.")) return;
    clearPersistentState(STORAGE_KEY);
    setState(initial);
  }

  if (!hydrated) {
    return <ChecklistSkeleton />;
  }

  return (
    <main className="bg-cream text-ink min-h-screen">
      <ChecklistHero
        weddingDate={state.weddingDate}
        onDateChange={(d) => setState((s) => ({ ...s, weddingDate: d }))}
        daysUntil={daysUntil}
        total={total}
        done={done}
      />

      <section className="max-w-5xl mx-auto px-6 py-10">
        <ChecklistControls
          state={state}
          setState={setState}
          buckets={buckets}
          onAddTask={addTask}
          onReset={resetAll}
        />

        <div className="mt-8 space-y-6">
          {state.sort === "bucket" && grouped
            ? buckets
                .filter((b) => (grouped.get(b.id) ?? []).length > 0)
                .map((b) => (
                  <BucketSection
                    key={b.id}
                    bucket={b}
                    tasks={grouped.get(b.id) ?? []}
                    onToggle={toggleDone}
                    onUpdate={updateTask}
                    onRemove={removeTask}
                  />
                ))
            : filtered.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  bucket={buckets.find((b) => b.id === t.bucket) ?? null}
                  onToggle={toggleDone}
                  onUpdate={updateTask}
                  onRemove={removeTask}
                />
              ))}
          {filtered.length === 0 && (
            <p className="text-center text-ink-soft italic py-12">
              No tasks match your filters.
            </p>
          )}
        </div>

        <div className="mt-16 text-center">
          <SectionDivider />
          <p className="mt-6 text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft">
            Your checklist auto-saves to this browser. Clear cookies and it&apos;s gone.
          </p>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Add the hero component**

Append:

```tsx
function ChecklistHero({
  weddingDate,
  onDateChange,
  daysUntil,
  total,
  done,
}: {
  weddingDate: string;
  onDateChange: (d: string) => void;
  daysUntil: number | null;
  total: number;
  done: number;
}) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=2400&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/90" />
      <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Link href="/plan" className="text-[0.65rem] uppercase tracking-[0.28em] text-champagne hover:text-cream">
          ← Back to Planning
        </Link>
        <h1 className="fade-up font-serif-display text-4xl md:text-6xl text-cream leading-[1.05] mt-4">
          Wedding <span className="italic text-champagne">Checklist.</span>
        </h1>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-champagne mb-2">
              Wedding Date
            </p>
            <input
              type="date"
              value={weddingDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => onDateChange(e.target.value)}
              className="editorial-input w-full max-w-xs"
            />
            {daysUntil !== null && daysUntil > 0 && (
              <p className="mt-2 text-cream/80 text-sm">
                <CountUp to={daysUntil} /> days to go
              </p>
            )}
          </div>
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-champagne mb-2">
              Progress
            </p>
            <div className="flex items-end gap-3">
              <p className="font-serif-display text-5xl text-cream tabular-nums">
                <CountUp to={pct} suffix="%" />
              </p>
              <p className="text-cream/70 text-sm pb-2">
                {done}/{total} done
              </p>
            </div>
            <div className="mt-2 w-full max-w-xs h-[2px] bg-cream/15 overflow-hidden">
              <div
                className="h-full bg-champagne transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-champagne mb-2">
              Auto-Saved
            </p>
            <p className="text-cream/85 text-sm font-light">
              Your changes save to this browser as you go.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add the controls bar**

Append:

```tsx
function ChecklistControls({
  state,
  setState,
  buckets,
  onAddTask,
  onReset,
}: {
  state: ChecklistState;
  setState: React.Dispatch<React.SetStateAction<ChecklistState>>;
  buckets: TimelineBucket[];
  onAddTask: (t: { bucket: string; task: string; priority: Priority; categoryId: string }) => void;
  onReset: () => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({
    bucket: buckets[0]?.id ?? "",
    task: "",
    priority: "medium" as Priority,
    categoryId: "planning",
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4 justify-between">
        <div className="flex flex-wrap gap-3">
          <SelectControl
            label="Priority"
            value={state.filter.priority}
            onChange={(v) =>
              setState((s) => ({ ...s, filter: { ...s.filter, priority: v as Priority | "all" } }))
            }
            options={[
              { value: "all", label: "All" },
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
          />
          <SelectControl
            label="Status"
            value={state.filter.status}
            onChange={(v) =>
              setState((s) => ({ ...s, filter: { ...s.filter, status: v as "all" | "open" | "done" } }))
            }
            options={[
              { value: "all", label: "All" },
              { value: "open", label: "Open" },
              { value: "done", label: "Done" },
            ]}
          />
          <SelectControl
            label="Sort"
            value={state.sort}
            onChange={(v) => setState((s) => ({ ...s, sort: v as ChecklistState["sort"] }))}
            options={[
              { value: "bucket", label: "Timeline" },
              { value: "priority", label: "Priority" },
              { value: "dueDate", label: "Due Date" },
            ]}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAdd((v) => !v)} className="btn-editorial text-[0.7rem]">
            + Add Task
          </button>
          <button onClick={onReset} className="btn-editorial-ghost text-[0.7rem]">
            Reset
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="editorial-card p-5 space-y-3 fade-up">
          <input
            type="text"
            placeholder="Task description (e.g. Tasting at Trishna)"
            value={draft.task}
            onChange={(e) => setDraft((d) => ({ ...d, task: e.target.value }))}
            className="editorial-input w-full"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SelectControl
              label="Timeline"
              value={draft.bucket}
              onChange={(v) => setDraft((d) => ({ ...d, bucket: v }))}
              options={buckets.map((b) => ({ value: b.id, label: b.label }))}
            />
            <SelectControl
              label="Priority"
              value={draft.priority}
              onChange={(v) => setDraft((d) => ({ ...d, priority: v as Priority }))}
              options={[
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ]}
            />
            <SelectControl
              label="Category"
              value={draft.categoryId}
              onChange={(v) => setDraft((d) => ({ ...d, categoryId: v }))}
              options={[
                { value: "planning", label: "Planning" },
                { value: "venues", label: "Venue" },
                { value: "catering", label: "Catering" },
                { value: "decor", label: "Decor" },
                { value: "photography", label: "Photography" },
                { value: "attire", label: "Attire" },
                { value: "beauty", label: "Beauty" },
                { value: "rituals", label: "Rituals" },
                { value: "logistics", label: "Logistics" },
                { value: "gifts", label: "Gifts" },
                { value: "honeymoon", label: "Honeymoon" },
              ]}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowAdd(false)}
              className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
            <button
              disabled={!draft.task.trim()}
              onClick={() => {
                onAddTask({ ...draft, task: draft.task.trim() });
                setDraft({ bucket: draft.bucket, task: "", priority: "medium", categoryId: "planning" });
                setShowAdd(false);
              }}
              className="btn-editorial text-[0.7rem] disabled:opacity-40"
            >
              Save Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SelectControl({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft/70 mb-1">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="editorial-input"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
```

- [ ] **Step 5: Add bucket section + task row**

Append:

```tsx
function BucketSection({
  bucket,
  tasks,
  onToggle,
  onUpdate,
  onRemove,
}: {
  bucket: TimelineBucket;
  tasks: UserTask[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, patch: Partial<UserTask>) => void;
  onRemove: (id: string) => void;
}) {
  const completed = tasks.filter((t) => t.done).length;
  return (
    <section className="editorial-card overflow-hidden">
      <header className="px-6 py-4 bg-cream-soft border-b border-ink/8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{bucket.emoji}</span>
          <div>
            <p className="font-serif-display text-xl text-ink leading-tight">{bucket.label}</p>
            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft/70 mt-0.5">
              {bucket.timeframe}
            </p>
          </div>
        </div>
        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-bordeaux">
          {completed}/{tasks.length} Done
        </p>
      </header>
      <div className="divide-y divide-ink/8">
        {tasks.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            bucket={bucket}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}

function TaskRow({
  task,
  bucket,
  onToggle,
  onUpdate,
  onRemove,
}: {
  task: UserTask;
  bucket: TimelineBucket | null;
  onToggle: (id: string) => void;
  onUpdate: (id: string, patch: Partial<UserTask>) => void;
  onRemove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const dueWarn = useMemo(() => {
    if (!task.dueDate) return null;
    const days = Math.ceil(
      (new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (days < 0) return { tone: "overdue" as const, label: "Overdue" };
    if (days <= 7) return { tone: "soon" as const, label: `In ${days}d` };
    return null;
  }, [task.dueDate]);

  return (
    <div className="px-6 py-4">
      <div className="flex items-start gap-4">
        <PrimitiveCheckbox
          checked={task.done}
          onChange={() => onToggle(task.id)}
          ariaLabel={`Mark ${task.task} as done`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p
              className={`text-sm md:text-base font-medium leading-snug ${
                task.done ? "text-ink-soft/50 line-through" : "text-ink"
              }`}
            >
              {task.task}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <PriorityBadge priority={task.priority} />
              {dueWarn && (
                <span
                  className={`text-[0.6rem] uppercase tracking-[0.18em] px-2 py-0.5 ${
                    dueWarn.tone === "overdue"
                      ? "bg-bordeaux text-cream"
                      : "bg-champagne/30 text-bordeaux"
                  }`}
                >
                  {dueWarn.label}
                </span>
              )}
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-soft hover:text-ink"
              >
                {expanded ? "Hide" : "Edit"}
              </button>
            </div>
          </div>
          {(bucket || task.note) && !expanded && (
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-ink-soft/70">
              {bucket?.emoji} {bucket?.label}
              {task.note && <span className="ml-2 text-ink-soft/85 normal-case tracking-normal">— {task.note.slice(0, 80)}{task.note.length > 80 ? "…" : ""}</span>}
            </p>
          )}

          {expanded && (
            <div className="mt-3 space-y-3 fade-up">
              <input
                type="text"
                value={task.task}
                onChange={(e) => onUpdate(task.id, { task: e.target.value })}
                className="editorial-input w-full"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="block">
                  <span className="block text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft/70 mb-1">
                    Due date
                  </span>
                  <input
                    type="date"
                    value={task.dueDate ?? ""}
                    onChange={(e) => onUpdate(task.id, { dueDate: e.target.value || null })}
                    className="editorial-input"
                  />
                </label>
                <label className="block">
                  <span className="block text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft/70 mb-1">
                    Priority
                  </span>
                  <select
                    value={task.priority}
                    onChange={(e) => onUpdate(task.id, { priority: e.target.value as Priority })}
                    className="editorial-input"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </label>
                <div className="flex items-end justify-end gap-2">
                  <button
                    onClick={() => onRemove(task.id)}
                    className="text-[0.65rem] uppercase tracking-[0.2em] text-bordeaux hover:text-ink"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <textarea
                value={task.note}
                onChange={(e) => onUpdate(task.id, { note: e.target.value })}
                rows={3}
                placeholder="Notes — vendor name, deposit amount, anything you'd forget."
                className="editorial-input w-full resize-y"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles =
    priority === "high"
      ? "bg-bordeaux text-cream"
      : priority === "medium"
        ? "bg-champagne/30 text-bordeaux"
        : "bg-ink/8 text-ink-soft";
  return (
    <span className={`text-[0.6rem] uppercase tracking-[0.18em] px-2 py-0.5 ${styles}`}>
      {priority}
    </span>
  );
}

function ChecklistSkeleton() {
  return (
    <main className="bg-cream text-ink min-h-screen">
      <div className="h-72 skeleton-shimmer" />
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 skeleton-shimmer" />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Build**

```bash
./scripts/with-ca.sh npx next build
```

Expected: build completes, `/plan/checklist` is listed as `ƒ` (server-rendered on demand because of the date input default values being computed at request time). No type errors.

- [ ] **Step 7: Manual smoke**

Start dev server (`npm run dev` or already-running) and visit `/plan/checklist`. Verify:
1. Page loads with the default 20 tasks grouped by timeline bucket
2. Toggling a checkbox makes the row strike-through
3. Click "Edit" on a task; due date, priority, note inputs appear
4. Add a task via "+ Add Task"; it appears in the chosen bucket
5. Refresh the page; all changes survive
6. Click "Reset" → confirm; defaults come back

If any step fails, fix before committing.

- [ ] **Step 8: Commit**

```bash
git add src/app/plan/checklist
git commit -m "feat(plan): editorial wedding checklist with custom tasks, dates, notes, filter/sort"
```

---

## Task 11: Budget server shell

**Files:**
- Create: `src/app/plan/budget/page.tsx`

- [ ] **Step 1: Write the server page**

```tsx
import { BudgetApp } from "./BudgetApp";
import { BUDGET_CATEGORIES } from "@/data/budgetCategories";
import { getVendorBenchmarks } from "@/lib/queries/benchmarks";

export const metadata = {
  title: "Budget Planner — ShaadiSetu",
  description:
    "Allocate, track, and visualize your wedding budget. Real vendor benchmarks included.",
};

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const benchmarks = await getVendorBenchmarks();
  return <BudgetApp categories={BUDGET_CATEGORIES} benchmarks={benchmarks} />;
}
```

- [ ] **Step 2: Defer commit (bundled with Task 12)**

The import won't resolve until Task 12. Move on.

---

## Task 12: Budget client app

**Files:**
- Create: `src/app/plan/budget/BudgetApp.tsx`

Largest task in the plan after Task 10. Broken into steps.

- [ ] **Step 1: Define state shape and helpers**

Create `src/app/plan/budget/BudgetApp.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePersistentState, clearPersistentState } from "@/lib/hooks/usePersistentState";
import { DonutChart } from "@/components/editorial/DonutChart";
import { RangeSlider } from "@/components/editorial/RangeSlider";
import { CountUp } from "@/components/editorial/CountUp";
import { SectionDivider } from "@/components/editorial/SectionDivider";
import type { BudgetCategoryDefault } from "@/data/budgetCategories";
import type { CategoryBenchmark } from "@/lib/queries/benchmarks";

const STORAGE_KEY = "shaadisetu.budget.v1";

interface BudgetLine {
  id: string;
  categoryId: string;
  label: string;
  estimated: number;
  actual: number;
  paid: boolean;
}

interface BudgetState {
  total: number;
  /** percentage allocations keyed by category id; sums to 100 unless user fudges */
  allocations: Record<string, number>;
  lines: BudgetLine[];
}

function formatINR(n: number): string {
  return n.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}

function buildInitialAllocations(cats: BudgetCategoryDefault[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of cats) out[c.id] = c.defaultPct;
  return out;
}
```

- [ ] **Step 2: Add the main component**

Append:

```tsx
interface Props {
  categories: BudgetCategoryDefault[];
  benchmarks: CategoryBenchmark[];
}

export function BudgetApp({ categories, benchmarks }: Props) {
  const initial: BudgetState = useMemo(
    () => ({
      total: 2_500_000, // ₹25L sensible default
      allocations: buildInitialAllocations(categories),
      lines: [],
    }),
    [categories],
  );

  const [state, setState, hydrated] = usePersistentState<BudgetState>(STORAGE_KEY, initial);

  const benchmarkByCat = useMemo(() => {
    const m = new Map<string, CategoryBenchmark>();
    for (const b of benchmarks) m.set(b.categoryId, b);
    return m;
  }, [benchmarks]);

  // Sum allocations to detect drift from 100%.
  const allocSum = useMemo(
    () => Object.values(state.allocations).reduce((s, v) => s + v, 0),
    [state.allocations],
  );

  // Per-category derived numbers.
  const perCategory = useMemo(() => {
    return categories.map((c) => {
      const pct = state.allocations[c.id] ?? 0;
      const allocAmount = Math.round((pct / 100) * state.total);
      const lines = state.lines.filter((l) => l.categoryId === c.id);
      const actual = lines.reduce((s, l) => s + (l.actual || 0), 0);
      const estimated = lines.reduce((s, l) => s + (l.estimated || 0), 0);
      return { category: c, pct, allocAmount, actual, estimated, lines };
    });
  }, [categories, state.allocations, state.total, state.lines]);

  const totalActual = perCategory.reduce((s, p) => s + p.actual, 0);
  const totalEstimated = perCategory.reduce((s, p) => s + p.estimated, 0);

  // Mutators.
  function setTotal(n: number) {
    setState((s) => ({ ...s, total: Math.max(0, n) }));
  }
  function setAllocation(catId: string, pct: number) {
    setState((s) => ({ ...s, allocations: { ...s.allocations, [catId]: Math.max(0, Math.min(100, pct)) } }));
  }
  function rebalanceTo100() {
    setState((s) => {
      const sum = Object.values(s.allocations).reduce((x, v) => x + v, 0);
      if (sum === 0) return s;
      const factor = 100 / sum;
      const next: Record<string, number> = {};
      for (const [k, v] of Object.entries(s.allocations)) {
        next[k] = Math.round(v * factor * 10) / 10;
      }
      return { ...s, allocations: next };
    });
  }
  function addLine(catId: string) {
    const newLine: BudgetLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      categoryId: catId,
      label: "",
      estimated: 0,
      actual: 0,
      paid: false,
    };
    setState((s) => ({ ...s, lines: [...s.lines, newLine] }));
  }
  function updateLine(id: string, patch: Partial<BudgetLine>) {
    setState((s) => ({
      ...s,
      lines: s.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  }
  function removeLine(id: string) {
    setState((s) => ({ ...s, lines: s.lines.filter((l) => l.id !== id) }));
  }
  function resetAll() {
    if (!confirm("Reset budget to defaults? Your line items will be lost.")) return;
    clearPersistentState(STORAGE_KEY);
    setState(initial);
  }

  if (!hydrated) {
    return <BudgetSkeleton />;
  }

  const segments = perCategory
    .filter((p) => p.pct > 0)
    .map((p) => ({ label: p.category.label, value: p.pct, color: p.category.color }));

  return (
    <main className="bg-cream text-ink min-h-screen">
      <BudgetHero
        total={state.total}
        onTotalChange={setTotal}
        actual={totalActual}
        estimated={totalEstimated}
      />

      <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <header className="flex items-center justify-between mb-6">
            <h2 className="font-serif-display text-3xl text-ink">Allocation</h2>
            <div className="flex items-center gap-3">
              {Math.round(allocSum) !== 100 && (
                <button
                  onClick={rebalanceTo100}
                  className="text-[0.65rem] uppercase tracking-[0.2em] text-bordeaux hover:text-ink"
                >
                  Rebalance to 100%
                </button>
              )}
              <button
                onClick={resetAll}
                className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
              >
                Reset
              </button>
            </div>
          </header>
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft mb-4">
            Allocated: {Math.round(allocSum)}%
            {Math.round(allocSum) !== 100 && (
              <span className="text-bordeaux ml-2">
                ({Math.round(allocSum) > 100 ? "over" : "under"} by {Math.abs(Math.round(allocSum) - 100)}%)
              </span>
            )}
          </p>

          <div className="space-y-4">
            {perCategory.map((p) => (
              <CategoryRow
                key={p.category.id}
                category={p.category}
                pct={p.pct}
                allocAmount={p.allocAmount}
                actual={p.actual}
                estimated={p.estimated}
                lines={p.lines}
                benchmark={benchmarkByCat.get(p.category.id)}
                onPctChange={(v) => setAllocation(p.category.id, v)}
                onAddLine={() => addLine(p.category.id)}
                onUpdateLine={updateLine}
                onRemoveLine={removeLine}
              />
            ))}
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          <div className="editorial-card p-6 text-center">
            <DonutChart
              segments={segments}
              centerValue={`${Math.round(allocSum)}%`}
              centerLabel="Allocated"
            />
            <SectionDivider className="mt-6" />
            <p className="mt-4 text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft">
              Total Budget
            </p>
            <p className="font-serif-display text-3xl text-bordeaux">
              ₹<CountUp to={state.total} />
            </p>
          </div>

          <Legend perCategory={perCategory} />
        </aside>
      </section>

      <p className="max-w-6xl mx-auto px-6 pb-16 text-center text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft">
        Your budget auto-saves to this browser. Clear cookies and it&apos;s gone.
      </p>
    </main>
  );
}
```

- [ ] **Step 3: Add hero, legend, and category row**

Append:

```tsx
function BudgetHero({
  total,
  onTotalChange,
  actual,
  estimated,
}: {
  total: number;
  onTotalChange: (n: number) => void;
  actual: number;
  estimated: number;
}) {
  const remaining = total - actual;
  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=2400&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/55 to-ink/90" />
      <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Link href="/plan" className="text-[0.65rem] uppercase tracking-[0.28em] text-champagne hover:text-cream">
          ← Back to Planning
        </Link>
        <h1 className="fade-up font-serif-display text-4xl md:text-6xl text-cream leading-[1.05] mt-4">
          Budget <span className="italic text-champagne">Planner.</span>
        </h1>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-champagne mb-2">
              Total Budget (₹)
            </p>
            <input
              type="number"
              min={0}
              value={total}
              onChange={(e) => onTotalChange(Number(e.target.value))}
              className="editorial-input w-full max-w-xs"
            />
          </div>
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-champagne mb-2">
              Spent So Far
            </p>
            <p className="font-serif-display text-4xl text-cream tabular-nums">
              ₹<CountUp to={actual} />
            </p>
            <p className="text-cream/65 text-xs mt-1">
              Estimated: ₹{formatINR(estimated)}
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-champagne mb-2">
              Remaining
            </p>
            <p
              className={`font-serif-display text-4xl tabular-nums ${
                remaining < 0 ? "text-bordeaux" : "text-champagne"
              }`}
            >
              ₹<CountUp to={Math.abs(remaining)} />
            </p>
            {remaining < 0 && (
              <p className="text-bordeaux text-[0.65rem] uppercase tracking-[0.22em] mt-1">
                Over budget
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Legend({
  perCategory,
}: {
  perCategory: ReturnType<typeof buildPerCategoryShape>;
}) {
  return (
    <div className="editorial-card p-6">
      <p className="eyebrow mb-4">Legend</p>
      <ul className="space-y-2 text-sm">
        {perCategory
          .filter((p) => p.pct > 0)
          .map((p) => (
            <li key={p.category.id} className="flex items-center gap-3">
              <span
                className="w-3 h-3 shrink-0"
                style={{ backgroundColor: p.category.color }}
                aria-hidden
              />
              <span className="text-ink-soft flex-1 truncate">
                {p.category.emoji} {p.category.label}
              </span>
              <span className="font-medium text-ink tabular-nums">
                {p.pct.toFixed(1)}%
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

// Type helper so `Legend`'s prop type is referenceable.
function buildPerCategoryShape(): Array<{
  category: BudgetCategoryDefault;
  pct: number;
  allocAmount: number;
  actual: number;
  estimated: number;
  lines: BudgetLine[];
}> {
  return [];
}

function CategoryRow({
  category,
  pct,
  allocAmount,
  actual,
  estimated,
  lines,
  benchmark,
  onPctChange,
  onAddLine,
  onUpdateLine,
  onRemoveLine,
}: {
  category: BudgetCategoryDefault;
  pct: number;
  allocAmount: number;
  actual: number;
  estimated: number;
  lines: BudgetLine[];
  benchmark: CategoryBenchmark | undefined;
  onPctChange: (v: number) => void;
  onAddLine: () => void;
  onUpdateLine: (id: string, patch: Partial<BudgetLine>) => void;
  onRemoveLine: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const overspent = actual > allocAmount;

  return (
    <article className="editorial-card overflow-hidden">
      <header className="px-5 py-4 flex items-center gap-4">
        <span className="text-2xl shrink-0" aria-hidden>
          {category.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-serif-display text-xl text-ink leading-tight">{category.label}</p>
            <p
              className={`text-sm tabular-nums ${
                overspent ? "text-bordeaux font-medium" : "text-ink-soft"
              }`}
            >
              ₹{formatINR(actual)} / ₹{formatINR(allocAmount)}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <RangeSlider
              value={pct}
              onChange={onPctChange}
              min={0}
              max={50}
              step={0.5}
              ariaLabel={`${category.label} allocation percentage`}
            />
            <span className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft tabular-nums w-10 text-right">
              {pct.toFixed(1)}%
            </span>
          </div>
          {benchmark?.modePriceRange && (
            <p className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft/70">
              Vendor benchmark: {benchmark.modePriceRange} · {benchmark.vendorCount} listed
            </p>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-[0.62rem] uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
        >
          {open ? "Hide" : `Lines (${lines.length})`}
        </button>
      </header>

      {open && (
        <div className="border-t border-ink/8 bg-cream-soft/40 px-5 py-4 space-y-3 fade-up">
          {lines.length === 0 ? (
            <p className="text-sm text-ink-soft italic">No line items yet.</p>
          ) : (
            <ul className="divide-y divide-ink/8">
              {lines.map((l) => (
                <li key={l.id} className="py-3 grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Description"
                    value={l.label}
                    onChange={(e) => onUpdateLine(l.id, { label: e.target.value })}
                    className="editorial-input col-span-12 md:col-span-4"
                  />
                  <input
                    type="number"
                    placeholder="Estimate"
                    value={l.estimated || ""}
                    onChange={(e) => onUpdateLine(l.id, { estimated: Number(e.target.value) || 0 })}
                    className="editorial-input col-span-6 md:col-span-3"
                  />
                  <input
                    type="number"
                    placeholder="Actual"
                    value={l.actual || ""}
                    onChange={(e) => onUpdateLine(l.id, { actual: Number(e.target.value) || 0 })}
                    className="editorial-input col-span-6 md:col-span-3"
                  />
                  <label className="col-span-9 md:col-span-1 inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-ink-soft">
                    <input
                      type="checkbox"
                      checked={l.paid}
                      onChange={(e) => onUpdateLine(l.id, { paid: e.target.checked })}
                      className="accent-bordeaux"
                    />
                    Paid
                  </label>
                  <button
                    onClick={() => onRemoveLine(l.id)}
                    aria-label="Remove line"
                    className="col-span-3 md:col-span-1 text-[0.62rem] uppercase tracking-[0.2em] text-bordeaux hover:text-ink justify-self-end"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={onAddLine} className="btn-editorial-ghost text-[0.65rem]">
            + Add Line Item
          </button>
          {estimated > 0 && actual !== estimated && (
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ink-soft">
              Estimated: ₹{formatINR(estimated)} · Variance: ₹{formatINR(actual - estimated)}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

function BudgetSkeleton() {
  return (
    <main className="bg-cream text-ink min-h-screen">
      <div className="h-72 skeleton-shimmer" />
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 skeleton-shimmer" />
          ))}
        </div>
        <div className="h-72 skeleton-shimmer" />
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Build**

```bash
./scripts/with-ca.sh npx next build
```

Expected: build completes, `/plan/budget` listed as `ƒ`. No type errors.

- [ ] **Step 5: Manual smoke**

Visit `/plan/budget`. Verify:
1. Default total ₹25,00,000 visible; donut chart draws with 13 colored segments
2. Drag a slider — donut + legend update in real time; allocation sum bumps off 100%
3. Click "Rebalance to 100%" — sum returns to 100
4. Open a category, click "+ Add Line Item", fill in numbers — actual updates in header and hero
5. Make actual > allocAmount — header turns bordeaux ("over" badge in hero if total exceeds budget)
6. Refresh page — all changes survive
7. Click "Reset" → confirm; defaults come back

If any step fails, fix before committing.

- [ ] **Step 6: Commit**

```bash
git add src/app/plan/budget src/lib/queries/benchmarks.ts
git commit -m "feat(plan): editorial budget planner with allocation sliders, line items, donut viz, vendor benchmarks"
```

---

## Task 13: Mobile menu link copy update

**Files:**
- Modify: `src/components/MobileMenu.tsx`

The desktop nav already says "Planning" → `/plan`. Update mobile copy to match.

- [ ] **Step 1: Read the file to confirm current state**

```bash
grep -n "Planning" src/components/MobileMenu.tsx
```

Expected: a single line containing `Planning Tools` linking to `/plan`. Already correct from prior work — no change needed unless the text differs.

- [ ] **Step 2: If text already says "Planning Tools", skip**

This task may be a no-op. Confirm with the grep above. If text needs change, edit it to match the desktop nav (which uses just "Planning"). Commit only if changed.

---

## Task 14: Final smoke + deploy

**Files:** None — verification + deploy only.

- [ ] **Step 1: Type check**

```bash
npx tsc --noEmit
```

Expected: no output (clean).

- [ ] **Step 2: Production build**

```bash
./scripts/with-ca.sh npx next build
```

Expected: build completes with `/plan` (○ Static), `/plan/checklist` (ƒ Dynamic), `/plan/budget` (ƒ Dynamic) listed in routes. No errors.

- [ ] **Step 3: Push and deploy**

```bash
git push origin main
./scripts/with-ca.sh npx vercel deploy --prod --yes
```

Expected: deployment succeeds and is aliased to https://shaadisetu.vercel.app.

- [ ] **Step 4: Production smoke**

```bash
for path in /plan /plan/checklist /plan/budget; do
  printf "%s = " "$path"
  curl -s -o /dev/null -w "%{http_code}\n" "https://shaadisetu.vercel.app$path"
done
```

Expected output: all three return `200`.

Open each URL in a browser and click through:
- `/plan` — both tool cards visible, lift on hover, link to sub-pages
- `/plan/checklist` — hero, controls, default tasks group by timeline; toggle, edit, add, reset all work; reload preserves state
- `/plan/budget` — donut animates in, sliders move, line items add, totals recompute; reload preserves state

If any production smoke fails, debug via `vercel logs` and fix before declaring done.

---

## Self-Review

**Spec coverage:**
- Hub at `/plan` with sub-pages — Task 8 ✓
- localStorage persistence — Task 1 (hook), Tasks 10 + 12 (use it) ✓
- Budget: allocation by category — Task 12 step 3 (`CategoryRow` slider) ✓
- Budget: per-item line entries — Task 12 step 3 (line list inside `CategoryRow`) ✓
- Budget: spend visualization — Task 3 (DonutChart), Task 12 (uses it) ✓
- Budget: vendor cost benchmarks — Task 7 (query), Task 12 (`CategoryRow` shows `benchmark.modePriceRange`) ✓
- Checklist: custom tasks — Task 10 step 4 (`+ Add Task`) ✓
- Checklist: due dates with badges — Task 10 step 5 (`dueWarn` overdue/soon) ✓
- Checklist: notes per task — Task 10 step 5 (`textarea` in expanded row) ✓
- Checklist: filter & sort — Task 10 step 4 (`SelectControl` for priority/status/sort) ✓
- Editorial styling — every page uses cream/ink/bordeaux/champagne, `font-serif-display`, fade-up motion ✓

**Placeholder scan:**
- No "TBD" / "TODO" / "implement later" left in steps — confirmed by Ctrl-F.
- No "similar to Task N" references — Tasks 10 and 12 each carry full code.
- No vague "add error handling" steps — error paths are inline (try/catch in hook, confirm() before destructive resets).

**Type consistency:**
- `Priority` type exported from `checklistDefaults.ts`, imported in `ChecklistApp.tsx` ✓
- `BudgetCategoryDefault` exported from `budgetCategories.ts`, imported in `BudgetApp.tsx` ✓
- `CategoryBenchmark` exported from `benchmarks.ts`, imported in `BudgetApp.tsx` ✓
- `usePersistentState` signature `[T, Dispatch, boolean]` matches consumers in both apps ✓
- `BudgetLine`, `UserTask`, `BudgetState`, `ChecklistState` defined once each, used consistently ✓

One known fudge in Task 12 step 3: I introduced a `buildPerCategoryShape()` helper purely to give `Legend`'s prop a referenceable type. Cleaner would be to extract a `PerCategory` type at the top of the file. Acceptable as-is; if the implementer prefers, they can lift the type without changing semantics.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-28-planning-hub.md`.

Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?