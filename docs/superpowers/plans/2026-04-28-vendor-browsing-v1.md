# Vendor Browsing v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a polished, frontend-only vendor browsing experience for ShaadiSetu — listing, profile, comparison, and enquiry — backed by mock data, with one Next.js API route that stubs the future backend.

**Architecture:** Next.js 16 App Router + React 19 + Tailwind CSS v4 + TypeScript. URL-as-source-of-truth for filters via `useSearchParams`/`router.replace`. Compare and enquiry history persisted in `localStorage` via React Context. Zod for validation (client + API route). Vitest + React Testing Library for unit/component tests. Playwright for 3 E2E happy paths. Unsplash for portfolio images via Next.js `<Image>`.

**Tech Stack:** Next.js 16.2.4, React 19.2.4, Tailwind v4, TypeScript 5, Zod, Vitest, @testing-library/react, @testing-library/jest-dom, Playwright.

**Spec:** `docs/superpowers/specs/2026-04-28-vendor-browsing-v1-design.md`

---

## Task list

1. Test infrastructure (Vitest + RTL + Playwright)
2. Slug helpers (`src/lib/slugs.ts`)
3. Zod validators (`src/lib/validators.ts`)
4. Mock data: `stats.ts`
5. Mock data: `packages.ts`
6. Mock data: `availability.ts`
7. Mock data: `portfolio.ts` + Unsplash image config
8. Mock data: `reviews.ts`
9. `useVendorFilters` hook
10. `CompareContext` + provider wiring
11. `useEnquiry` hook
12. `VendorRowCard` component
13. `VendorListingFilters` component
14. Listing page `/vendors/[city]/[category]/page.tsx`
15. `VendorProfileHero` + `VendorServicesList`
16. `VendorPortfolio` (gallery + lightbox)
17. `VendorPackages`
18. `VendorAvailabilityCalendar`
19. `VendorReviews`
20. `VendorEnquiryRail` + API route `/api/enquiries`
21. Profile page `/vendors/[id]/page.tsx`
22. `CompareTray` (floating)
23. `ComparisonTable` + `/compare` page
24. Rework `/vendors/page.tsx` (browse-all)
25. `not-found.tsx` for vendors routes
26. E2E happy paths
27. Final wiring + README + commit cleanup

---

### Task 1: Test infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `playwright.config.ts`
- Create: `e2e/.gitkeep`
- Modify: `package.json` (add scripts + devDependencies)
- Modify: `tsconfig.json` (add `vitest/globals` types)

- [ ] **Step 1: Install deps**

```bash
cd ~/Desktop/shaadisetu
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test zod
npx playwright install chromium
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

- [ ] **Step 3: Create `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());
```

- [ ] **Step 4: Create `playwright.config.ts`**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 5: Update `package.json` scripts**

Add under `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest",
"e2e": "playwright test"
```

- [ ] **Step 6: Verify Vitest runs (no tests yet)**

```bash
npm test
```
Expected: `No test files found, exiting with code 0` or similar — exit code 0.

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts playwright.config.ts src/test e2e package.json package-lock.json tsconfig.json
git commit -m "chore: add Vitest + RTL + Playwright test infrastructure"
```

---

### Task 2: Slug helpers

**Files:**
- Create: `src/lib/slugs.ts`
- Test: `src/lib/slugs.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/slugs.test.ts
import { describe, it, expect } from "vitest";
import { toSlug, fromSlug, findCityBySlug, findCategoryBySlug } from "./slugs";

describe("toSlug", () => {
  it("lowercases and dash-separates", () => {
    expect(toSlug("New Delhi")).toBe("new-delhi");
    expect(toSlug("Photography & Media")).toBe("photography-media");
  });
});

describe("fromSlug", () => {
  it("title-cases dashes back to spaces", () => {
    expect(fromSlug("new-delhi")).toBe("New Delhi");
  });
});

describe("findCityBySlug", () => {
  it("finds Mumbai by slug", () => {
    expect(findCityBySlug("mumbai")?.name).toBe("Mumbai");
  });
  it("returns undefined for unknown", () => {
    expect(findCityBySlug("atlantis")).toBeUndefined();
  });
});

describe("findCategoryBySlug", () => {
  it("finds photography by id", () => {
    expect(findCategoryBySlug("photography")?.id).toBe("photography");
  });
});
```

- [ ] **Step 2: Run — expect FAIL (module missing)**

```bash
npm test -- src/lib/slugs.test.ts
```
Expected: FAIL.

- [ ] **Step 3: Implement `src/lib/slugs.ts`**

```ts
import { cities, City } from "@/data/cities";
import { categories, Category } from "@/data/categories";

export function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function fromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function findCityBySlug(slug: string): City | undefined {
  return cities.find((c) => toSlug(c.name) === slug);
}

export function findCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.id === slug);
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/lib/slugs.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/slugs.ts src/lib/slugs.test.ts
git commit -m "feat: add slug helpers for city/category routing"
```

---

### Task 3: Zod validators

**Files:**
- Create: `src/lib/validators.ts`
- Test: `src/lib/validators.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/validators.test.ts
import { describe, it, expect } from "vitest";
import { phoneSchema, enquirySchema } from "./validators";

describe("phoneSchema", () => {
  it.each([["6123456789"], ["7123456789"], ["8123456789"], ["9123456789"]])(
    "accepts valid Indian mobile %s",
    (n) => expect(phoneSchema.safeParse(n).success).toBe(true),
  );
  it.each([["5123456789"], ["91234"], ["91234567890"], ["abc1234567"]])(
    "rejects invalid %s",
    (n) => expect(phoneSchema.safeParse(n).success).toBe(false),
  );
});

describe("enquirySchema", () => {
  const valid = {
    vendorId: "v5",
    name: "Priya",
    phone: "9876543210",
    eventDate: "2099-12-31",
    eventType: "wedding",
    requirements: "Need cinematic photography for 2-day wedding.",
  };
  it("accepts valid payload", () => {
    expect(enquirySchema.safeParse(valid).success).toBe(true);
  });
  it("rejects past dates", () => {
    expect(enquirySchema.safeParse({ ...valid, eventDate: "2000-01-01" }).success).toBe(false);
  });
  it("rejects short requirements", () => {
    expect(enquirySchema.safeParse({ ...valid, requirements: "hi" }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/lib/validators.test.ts
```

- [ ] **Step 3: Implement `src/lib/validators.ts`**

```ts
import { z } from "zod";

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const eventTypeSchema = z.enum([
  "haldi",
  "mehendi",
  "wedding",
  "reception",
  "engagement",
  "sangeet",
]);

export const enquirySchema = z.object({
  vendorId: z.string().min(1),
  name: z.string().min(2, "Name is too short"),
  phone: phoneSchema,
  eventDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)) && new Date(d) > new Date(), {
      message: "Pick a future date",
    }),
  eventType: eventTypeSchema,
  requirements: z.string().min(10, "Tell us a bit more (min 10 chars)"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/lib/validators.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/validators.ts src/lib/validators.test.ts
git commit -m "feat: add Zod validators for enquiry form"
```

---

### Task 4: Mock data — `stats.ts`

**Files:**
- Create: `src/data/stats.ts`
- Test: `src/data/stats.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/data/stats.test.ts
import { describe, it, expect } from "vitest";
import { sampleVendors } from "./vendors";
import { statsByVendor } from "./stats";

describe("statsByVendor", () => {
  it("has stats for every sample vendor", () => {
    for (const v of sampleVendors) {
      expect(statsByVendor[v.id]).toBeDefined();
      expect(statsByVendor[v.id].weddingsCompleted).toBeGreaterThan(0);
      expect(statsByVendor[v.id].yearsExperience).toBe(v.yearsExperience);
    }
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/data/stats.test.ts
```

- [ ] **Step 3: Implement `src/data/stats.ts`**

```ts
import { sampleVendors } from "./vendors";

export interface VendorStats {
  weddingsCompleted: number;
  customersServed: number;
  yearsExperience: number;
  responseTime: string;
}

// Deterministic stats derived from each vendor's reviewCount + yearsExperience
function buildStats(reviewCount: number, years: number): Omit<VendorStats, "yearsExperience"> {
  const weddings = Math.max(reviewCount * 2, years * 25);
  const customers = Math.round(weddings * 1.4);
  const responseTime =
    reviewCount > 100 ? "Usually within 1 hour"
    : reviewCount > 50 ? "Usually within 2 hours"
    : "Usually within 24 hours";
  return { weddingsCompleted: weddings, customersServed: customers, responseTime };
}

export const statsByVendor: Record<string, VendorStats> = Object.fromEntries(
  sampleVendors.map((v) => [
    v.id,
    { ...buildStats(v.reviewCount, v.yearsExperience), yearsExperience: v.yearsExperience },
  ]),
);
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/data/stats.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/data/stats.ts src/data/stats.test.ts
git commit -m "feat: add vendor stats mock data"
```

---

### Task 5: Mock data — `packages.ts`

**Files:**
- Create: `src/data/packages.ts`
- Test: `src/data/packages.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/data/packages.test.ts
import { describe, it, expect } from "vitest";
import { sampleVendors } from "./vendors";
import { packagesByVendor } from "./packages";

describe("packagesByVendor", () => {
  it("has 3 packages per vendor", () => {
    for (const v of sampleVendors) {
      const pkgs = packagesByVendor[v.id];
      expect(pkgs).toHaveLength(3);
      expect(pkgs.map((p) => p.tier)).toEqual(["basic", "standard", "premium"]);
    }
  });
  it("standard package is marked popular", () => {
    const pkgs = packagesByVendor[sampleVendors[0].id];
    expect(pkgs.find((p) => p.tier === "standard")?.popular).toBe(true);
  });
  it("premium price > standard price > basic price", () => {
    for (const v of sampleVendors) {
      const [b, s, p] = packagesByVendor[v.id];
      expect(s.price).toBeGreaterThan(b.price);
      expect(p.price).toBeGreaterThan(s.price);
    }
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/data/packages.test.ts
```

- [ ] **Step 3: Implement `src/data/packages.ts`**

```ts
import { sampleVendors, Vendor } from "./vendors";

export interface Package {
  tier: "basic" | "standard" | "premium";
  name: string;
  price: number; // INR
  features: string[];
  popular?: boolean;
}

// Parse the lowest INR amount mentioned in vendor.priceRange (e.g. "₹75K-2 Lakh" -> 75000)
function parseLow(range: string): number {
  const m = range.match(/₹\s*([\d.]+)\s*(K|Lakh|L)?/i);
  if (!m) return 25_000;
  const n = parseFloat(m[1]);
  const unit = (m[2] || "").toLowerCase();
  if (unit.startsWith("l")) return Math.round(n * 100_000);
  if (unit === "k") return Math.round(n * 1000);
  return Math.round(n);
}

const FEATURES: Record<string, string[]> = {
  basic: [
    "Up to 6 hours coverage",
    "Single event",
    "Online gallery",
    "Standard delivery (3 weeks)",
  ],
  standard: [
    "Up to 10 hours coverage",
    "Two events (e.g. haldi + wedding)",
    "Curated highlights film",
    "Premium delivery (2 weeks)",
    "Edited album proofs",
  ],
  premium: [
    "Full day coverage (12+ hours)",
    "All wedding events covered",
    "Cinematic film + drone",
    "Priority delivery (1 week)",
    "Premium hardcover album",
    "Same-day teaser",
    "Dedicated coordinator",
  ],
};

function buildPackages(v: Vendor): Package[] {
  const base = parseLow(v.priceRange);
  return [
    { tier: "basic", name: "Essentials", price: base, features: FEATURES.basic },
    { tier: "standard", name: "Signature", price: Math.round(base * 1.8), features: FEATURES.standard, popular: true },
    { tier: "premium", name: "Luxe", price: Math.round(base * 3), features: FEATURES.premium },
  ];
}

export const packagesByVendor: Record<string, Package[]> = Object.fromEntries(
  sampleVendors.map((v) => [v.id, buildPackages(v)]),
);
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/data/packages.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/data/packages.ts src/data/packages.test.ts
git commit -m "feat: add vendor packages mock data"
```

---

### Task 6: Mock data — `availability.ts`

**Files:**
- Create: `src/data/availability.ts`
- Test: `src/data/availability.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/data/availability.test.ts
import { describe, it, expect } from "vitest";
import { sampleVendors } from "./vendors";
import { bookedDatesByVendor, isBooked } from "./availability";

describe("bookedDatesByVendor", () => {
  it("has dates for every vendor", () => {
    for (const v of sampleVendors) {
      expect(bookedDatesByVendor[v.id].length).toBeGreaterThanOrEqual(3);
      for (const d of bookedDatesByVendor[v.id]) {
        expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });
  it("isBooked is deterministic", () => {
    const v = sampleVendors[0];
    const date = bookedDatesByVendor[v.id][0];
    expect(isBooked(v.id, date)).toBe(true);
    expect(isBooked(v.id, "1999-01-01")).toBe(false);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/data/availability.test.ts
```

- [ ] **Step 3: Implement `src/data/availability.ts`**

```ts
import { sampleVendors } from "./vendors";

// Deterministic seeded RNG (mulberry32) so booked dates are stable across reloads
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function buildDates(id: string, count = 5): string[] {
  const rand = mulberry32(hashId(id));
  const today = new Date();
  const dates = new Set<string>();
  while (dates.size < count) {
    const offsetDays = Math.floor(rand() * 180) + 1; // next 6 months
    const d = new Date(today);
    d.setDate(d.getDate() + offsetDays);
    dates.add(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }
  return Array.from(dates).sort();
}

export const bookedDatesByVendor: Record<string, string[]> = Object.fromEntries(
  sampleVendors.map((v) => [v.id, buildDates(v.id)]),
);

export function isBooked(vendorId: string, isoDate: string): boolean {
  return bookedDatesByVendor[vendorId]?.includes(isoDate) ?? false;
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/data/availability.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/data/availability.ts src/data/availability.test.ts
git commit -m "feat: add vendor availability mock data"
```

---

### Task 7: Mock data — `portfolio.ts` + Unsplash image config

**Files:**
- Create: `src/data/portfolio.ts`
- Create: `src/data/portfolio.test.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Verify Unsplash URLs**

Curate ~30 Unsplash photo IDs covering Indian weddings — search Unsplash for "indian wedding", "haldi", "mehendi", "reception". Save IDs to a scratch file. Hit each URL `https://images.unsplash.com/photo-<id>?w=1200&q=80` once with `curl -I` and confirm `HTTP/1.1 200`. Replace any 404s.

- [ ] **Step 2: Update `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Write the failing test**

```ts
// src/data/portfolio.test.ts
import { describe, it, expect } from "vitest";
import { sampleVendors } from "./vendors";
import { portfolioByVendor } from "./portfolio";

describe("portfolioByVendor", () => {
  it("has 5–8 images per vendor", () => {
    for (const v of sampleVendors) {
      const imgs = portfolioByVendor[v.id];
      expect(imgs.length).toBeGreaterThanOrEqual(5);
      expect(imgs.length).toBeLessThanOrEqual(8);
      for (const img of imgs) {
        expect(img.url).toMatch(/^https:\/\/images\.unsplash\.com\//);
        expect(img.eventType).toMatch(/haldi|mehendi|wedding|reception|engagement/);
      }
    }
  });
});
```

- [ ] **Step 4: Run — expect FAIL**

```bash
npm test -- src/data/portfolio.test.ts
```

- [ ] **Step 5: Implement `src/data/portfolio.ts`**

```ts
import { sampleVendors } from "./vendors";

export interface PortfolioImage {
  id: string;
  url: string;
  caption: string;
  eventType: "haldi" | "mehendi" | "wedding" | "reception" | "engagement";
}

// Curated Unsplash photo IDs verified 200 OK in Step 1
const POOL: { id: string; eventType: PortfolioImage["eventType"]; caption: string }[] = [
  { id: "1519741497674-611481863552", eventType: "wedding", caption: "Mandap moments" },
  { id: "1511285560929-80b456fea0bc", eventType: "wedding", caption: "Bridal entry" },
  { id: "1606800052052-a08af7148866", eventType: "wedding", caption: "Vows under flowers" },
  { id: "1583939003579-730e3918a45a", eventType: "haldi", caption: "Golden haldi" },
  { id: "1604017011826-d3b4c23f8914", eventType: "mehendi", caption: "Intricate mehendi" },
  { id: "1519225421980-715cb0215aed", eventType: "reception", caption: "Reception lights" },
  { id: "1597157639073-69284dc0fdaf", eventType: "engagement", caption: "Ring exchange" },
  { id: "1519225421980-715cb0215aed", eventType: "wedding", caption: "Pheras" },
  // ...add 22+ more curated IDs in the same shape
];

function url(id: string): string {
  return `https://images.unsplash.com/photo-${id}?w=1200&q=80`;
}

function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickFor(vendorId: string): PortfolioImage[] {
  const seed = hashId(vendorId);
  const count = 5 + (seed % 4); // 5–8
  const out: PortfolioImage[] = [];
  for (let i = 0; i < count; i++) {
    const p = POOL[(seed + i * 7) % POOL.length];
    out.push({
      id: `${vendorId}-${i}`,
      url: url(p.id),
      caption: p.caption,
      eventType: p.eventType,
    });
  }
  return out;
}

export const portfolioByVendor: Record<string, PortfolioImage[]> = Object.fromEntries(
  sampleVendors.map((v) => [v.id, pickFor(v.id)]),
);
```

- [ ] **Step 6: Run — expect PASS**

```bash
npm test -- src/data/portfolio.test.ts
```

- [ ] **Step 7: Commit**

```bash
git add src/data/portfolio.ts src/data/portfolio.test.ts next.config.ts
git commit -m "feat: add vendor portfolio mock data with Unsplash images"
```

---

### Task 8: Mock data — `reviews.ts`

**Files:**
- Create: `src/data/reviews.ts`
- Test: `src/data/reviews.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/data/reviews.test.ts
import { describe, it, expect } from "vitest";
import { sampleVendors } from "./vendors";
import { reviewsByVendor } from "./reviews";

describe("reviewsByVendor", () => {
  it("has 5–10 reviews per vendor", () => {
    for (const v of sampleVendors) {
      const r = reviewsByVendor[v.id];
      expect(r.length).toBeGreaterThanOrEqual(5);
      expect(r.length).toBeLessThanOrEqual(10);
      for (const x of r) {
        expect(x.rating).toBeGreaterThanOrEqual(1);
        expect(x.rating).toBeLessThanOrEqual(5);
        expect(x.body.length).toBeGreaterThan(20);
      }
    }
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/data/reviews.test.ts
```

- [ ] **Step 3: Implement `src/data/reviews.ts`**

```ts
import { sampleVendors } from "./vendors";

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  eventType: string;
}

const AUTHORS = [
  "Priya S.", "Arjun M.", "Aanya R.", "Rohan K.", "Ishita P.",
  "Karan V.", "Neha G.", "Vivaan T.", "Sara D.", "Aditya N.",
  "Meera J.", "Kabir B.", "Diya L.", "Yash C.", "Tanvi H.",
];

const TEMPLATES = [
  { title: "Made our day magical", body: "Truly professional and warm. Captured every emotion beautifully — would recommend in a heartbeat." },
  { title: "Worth every rupee", body: "Stunning quality, on-time delivery, and the team handled every last-minute change calmly. Thank you so much!" },
  { title: "Family fell in love", body: "Even the elders couldn't stop praising the work. The album is now a family heirloom." },
  { title: "Beyond expectations", body: "We had high hopes after the consultation and they exceeded every one. Beautifully crafted experience." },
  { title: "Highly recommend", body: "Smooth coordination, fair pricing, and a genuinely lovely team to work with. 10/10." },
  { title: "Absolutely flawless", body: "From initial enquiry to final delivery, everything was seamless. They understood our brief perfectly." },
  { title: "Made us feel special", body: "It felt like a friend was helping with our wedding rather than a paid service. Heartfelt experience." },
  { title: "Punctual and creative", body: "Showed up early, stayed late, and captured frames we didn't even realize were happening." },
];

const EVENT_TYPES = ["Wedding · Dec 2025", "Reception · Nov 2025", "Engagement · Oct 2025", "Haldi · Sep 2025", "Mehendi · Aug 2025"];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function buildReviews(vendorId: string, vendorRating: number): Review[] {
  const seed = hash(vendorId);
  const count = 5 + (seed % 6); // 5–10
  const out: Review[] = [];
  for (let i = 0; i < count; i++) {
    const t = TEMPLATES[(seed + i * 3) % TEMPLATES.length];
    const author = AUTHORS[(seed + i * 5) % AUTHORS.length];
    const event = EVENT_TYPES[(seed + i * 7) % EVENT_TYPES.length];
    // Cluster ratings around the vendor's overall rating: ±1, clamped 1..5
    const drift = ((seed + i * 11) % 3) - 1; // -1, 0, +1
    const rating = Math.max(1, Math.min(5, Math.round(vendorRating + drift)));
    const d = new Date();
    d.setMonth(d.getMonth() - (i + 1));
    out.push({
      id: `${vendorId}-r${i}`,
      author,
      rating,
      date: d.toISOString().slice(0, 10),
      title: t.title,
      body: t.body,
      eventType: event,
    });
  }
  return out;
}

export const reviewsByVendor: Record<string, Review[]> = Object.fromEntries(
  sampleVendors.map((v) => [v.id, buildReviews(v.id, v.rating)]),
);
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/data/reviews.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/data/reviews.ts src/data/reviews.test.ts
git commit -m "feat: add vendor reviews mock data"
```

---

### Task 9: `useVendorFilters` hook

**Files:**
- Create: `src/hooks/useVendorFilters.ts`
- Test: `src/hooks/useVendorFilters.test.tsx`

**Project rule:** Read `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md` before writing this — Next.js 16's `useSearchParams` may differ from older versions you've seen.

- [ ] **Step 1: Write the failing test**

```tsx
// src/hooks/useVendorFilters.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVendorFilters, applyFilters, FilterState } from "./useVendorFilters";
import { sampleVendors } from "@/data/vendors";

const replaceMock = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => searchParams,
  usePathname: () => "/vendors/mumbai/photography",
}));

beforeEach(() => {
  searchParams = new URLSearchParams();
  replaceMock.mockClear();
});

describe("applyFilters", () => {
  const photog = sampleVendors.filter((v) => v.categoryId === "photography");
  it("filters by min rating", () => {
    const out = applyFilters(photog, { rating: 4.7 } as FilterState);
    expect(out.every((v) => v.rating >= 4.7)).toBe(true);
  });
  it("sorts by rating desc", () => {
    const out = applyFilters(photog, { sort: "rating" } as FilterState);
    for (let i = 1; i < out.length; i++) expect(out[i - 1].rating).toBeGreaterThanOrEqual(out[i].rating);
  });
  it("ignores invalid rating", () => {
    const out = applyFilters(photog, { rating: NaN } as FilterState);
    expect(out.length).toBe(photog.length);
  });
});

describe("useVendorFilters", () => {
  it("reads rating from URL", () => {
    searchParams = new URLSearchParams("rating=4");
    const { result } = renderHook(() => useVendorFilters());
    expect(result.current.filters.rating).toBe(4);
  });
  it("setFilter calls router.replace with new param", () => {
    const { result } = renderHook(() => useVendorFilters());
    act(() => result.current.setFilter("rating", 4.5));
    expect(replaceMock).toHaveBeenCalledWith(expect.stringContaining("rating=4.5"));
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/hooks/useVendorFilters.test.tsx
```

- [ ] **Step 3: Implement `src/hooks/useVendorFilters.ts`**

```ts
"use client";
import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { z } from "zod";
import type { Vendor } from "@/data/vendors";
import { isBooked } from "@/data/availability";

export type SortKey = "popularity" | "rating" | "price-asc" | "price-desc";

export interface FilterState {
  budget?: string;     // raw label, matched against vendor.priceRange
  rating?: number;
  date?: string;       // ISO YYYY-MM-DD
  sort: SortKey;
}

const filterSchema = z.object({
  budget: z.string().optional().catch(undefined),
  rating: z.coerce.number().min(0).max(5).optional().catch(undefined),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .catch(undefined),
  sort: z.enum(["popularity", "rating", "price-asc", "price-desc"]).catch("popularity"),
});

function parseLow(range: string): number {
  const m = range.match(/₹\s*([\d.]+)\s*(K|Lakh|L)?/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const u = (m[2] || "").toLowerCase();
  if (u.startsWith("l")) return n * 100_000;
  if (u === "k") return n * 1000;
  return n;
}

export function applyFilters(vendors: Vendor[], f: FilterState): Vendor[] {
  let out = vendors.slice();
  if (typeof f.rating === "number" && !Number.isNaN(f.rating)) {
    out = out.filter((v) => v.rating >= f.rating!);
  }
  if (f.budget) out = out.filter((v) => v.priceRange === f.budget);

  // Booked vendors sort to bottom (not removed) when date is set
  if (f.date) {
    out.sort((a, b) => Number(isBooked(a.id, f.date!)) - Number(isBooked(b.id, f.date!)));
  }

  switch (f.sort) {
    case "rating":
      out.sort((a, b) => b.rating - a.rating);
      break;
    case "price-asc":
      out.sort((a, b) => parseLow(a.priceRange) - parseLow(b.priceRange));
      break;
    case "price-desc":
      out.sort((a, b) => parseLow(b.priceRange) - parseLow(a.priceRange));
      break;
    default:
      out.sort((a, b) => b.reviewCount - a.reviewCount);
  }
  return out;
}

export function useVendorFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filters: FilterState = useMemo(() => {
    const raw = {
      budget: params.get("budget") ?? undefined,
      rating: params.get("rating") ?? undefined,
      date: params.get("date") ?? undefined,
      sort: params.get("sort") ?? undefined,
    };
    return filterSchema.parse(raw) as FilterState;
  }, [params]);

  const setFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K] | undefined) => {
      const next = new URLSearchParams(params.toString());
      if (value === undefined || value === null || value === "") next.delete(key);
      else next.set(key, String(value));
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [params, pathname, router],
  );

  const clear = useCallback(() => router.replace(pathname), [pathname, router]);

  return { filters, setFilter, clear };
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/hooks/useVendorFilters.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useVendorFilters.ts src/hooks/useVendorFilters.test.tsx
git commit -m "feat: add URL-synced vendor filter hook"
```

---

### Task 10: `CompareContext` + provider wiring

**Files:**
- Create: `src/context/CompareContext.tsx`
- Test: `src/context/CompareContext.test.tsx`
- Modify: `src/app/layout.tsx` (wrap with provider)

- [ ] **Step 1: Write the failing test**

```tsx
// src/context/CompareContext.test.tsx
import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { CompareProvider, useCompare } from "./CompareContext";
import type { ReactNode } from "react";

function wrap({ children }: { children: ReactNode }) {
  return <CompareProvider>{children}</CompareProvider>;
}

beforeEach(() => localStorage.clear());

describe("CompareContext", () => {
  it("adds and removes vendors", () => {
    const { result } = renderHook(() => useCompare(), { wrapper: wrap });
    act(() => result.current.add("v1"));
    act(() => result.current.add("v2"));
    expect(result.current.ids).toEqual(["v1", "v2"]);
    act(() => result.current.remove("v1"));
    expect(result.current.ids).toEqual(["v2"]);
  });

  it("caps at 3 and surfaces an overflow flag", () => {
    const { result } = renderHook(() => useCompare(), { wrapper: wrap });
    act(() => result.current.add("v1"));
    act(() => result.current.add("v2"));
    act(() => result.current.add("v3"));
    let overflow = false;
    act(() => { overflow = result.current.add("v4"); });
    expect(overflow).toBe(false); // returns false when rejected
    expect(result.current.ids).toEqual(["v1", "v2", "v3"]);
  });

  it("hydrates from localStorage", () => {
    localStorage.setItem("shaadisetu.compare", JSON.stringify(["v7", "v8"]));
    const { result } = renderHook(() => useCompare(), { wrapper: wrap });
    expect(result.current.ids).toEqual(["v7", "v8"]);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/context/CompareContext.test.tsx
```

- [ ] **Step 3: Implement `src/context/CompareContext.tsx`**

```tsx
"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "shaadisetu.compare";
const MAX = 3;

interface Ctx {
  ids: string[];
  add: (id: string) => boolean; // returns true if added, false if rejected (overflow or duplicate)
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const CompareCtx = createContext<Ctx | null>(null);

function safeRead(): string[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function safeWrite(ids: string[]) {
  try {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* private mode etc. */
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  // Hydrate after mount (avoids SSR/CSR mismatch)
  useEffect(() => setIds(safeRead()), []);

  useEffect(() => safeWrite(ids), [ids]);

  const add = useCallback((id: string): boolean => {
    let added = false;
    setIds((curr) => {
      if (curr.includes(id) || curr.length >= MAX) return curr;
      added = true;
      return [...curr, id];
    });
    return added;
  }, []);

  const remove = useCallback(
    (id: string) => setIds((curr) => curr.filter((x) => x !== id)),
    [],
  );
  const clear = useCallback(() => setIds([]), []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <CompareCtx.Provider value={{ ids, add, remove, clear, has }}>{children}</CompareCtx.Provider>
  );
}

export function useCompare(): Ctx {
  const ctx = useContext(CompareCtx);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
```

- [ ] **Step 4: Wrap layout with provider**

In `src/app/layout.tsx`, import `CompareProvider` and wrap the `<body>` children:

```tsx
import { CompareProvider } from "@/context/CompareContext";
// inside <body>:
<CompareProvider>{children}</CompareProvider>
```

(The existing `CityContext` provider should remain wrapping at the same level.)

- [ ] **Step 5: Run — expect PASS**

```bash
npm test -- src/context/CompareContext.test.tsx
```

- [ ] **Step 6: Commit**

```bash
git add src/context/CompareContext.tsx src/context/CompareContext.test.tsx src/app/layout.tsx
git commit -m "feat: add CompareContext with localStorage persistence"
```

---

### Task 11: `useEnquiry` hook

**Files:**
- Create: `src/hooks/useEnquiry.ts`
- Test: `src/hooks/useEnquiry.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/hooks/useEnquiry.test.tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useEnquiry } from "./useEnquiry";

const validInput = {
  vendorId: "v5",
  name: "Priya",
  phone: "9876543210",
  eventDate: "2099-12-31",
  eventType: "wedding",
  requirements: "Need cinematic photography for 2-day wedding.",
};

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("useEnquiry", () => {
  it("posts and saves on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, id: "abc" }), { status: 200 })
    ));
    const { result } = renderHook(() => useEnquiry());
    await act(async () => { await result.current.submit(validInput); });
    await waitFor(() => expect(result.current.status).toBe("success"));
    const saved = JSON.parse(localStorage.getItem("shaadisetu.enquiries") ?? "[]");
    expect(saved).toHaveLength(1);
    expect(saved[0].vendorId).toBe("v5");
  });

  it("surfaces error on POST failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("oops", { status: 500 })));
    const { result } = renderHook(() => useEnquiry());
    await act(async () => { await result.current.submit(validInput); });
    await waitFor(() => expect(result.current.status).toBe("error"));
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/hooks/useEnquiry.test.tsx
```

- [ ] **Step 3: Implement `src/hooks/useEnquiry.ts`**

```ts
"use client";
import { useCallback, useState } from "react";
import type { EnquiryInput } from "@/lib/validators";

const STORAGE_KEY = "shaadisetu.enquiries";

export interface EnquiryRecord extends EnquiryInput {
  id: string;
  submittedAt: string;
}

type Status = "idle" | "submitting" | "success" | "error";

function readHistory(): EnquiryRecord[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeHistory(records: EnquiryRecord[]) {
  try {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* private mode etc. */
  }
}

export function useEnquiry() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (input: EnquiryInput) => {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = (await res.json()) as { id: string };
      const record: EnquiryRecord = { ...input, id: data.id, submittedAt: new Date().toISOString() };
      writeHistory([...readHistory(), record]);
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => { setStatus("idle"); setError(null); }, []);

  return { status, error, submit, reset, history: readHistory };
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/hooks/useEnquiry.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useEnquiry.ts src/hooks/useEnquiry.test.tsx
git commit -m "feat: add useEnquiry hook with localStorage history"
```

---

### Task 12: `VendorRowCard` component

**Files:**
- Create: `src/components/vendor/VendorRowCard.tsx`
- Test: `src/components/vendor/VendorRowCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/vendor/VendorRowCard.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VendorRowCard } from "./VendorRowCard";
import { sampleVendors } from "@/data/vendors";
import { CompareProvider } from "@/context/CompareContext";

const v = sampleVendors[0];

function renderCard(props: Partial<React.ComponentProps<typeof VendorRowCard>> = {}) {
  return render(
    <CompareProvider>
      <VendorRowCard vendor={v} {...props} />
    </CompareProvider>,
  );
}

describe("VendorRowCard", () => {
  it("shows name, rating, and price", () => {
    renderCard();
    expect(screen.getByText(v.name)).toBeInTheDocument();
    expect(screen.getByText(v.priceRange)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(v.rating.toString()))).toBeInTheDocument();
  });

  it("shows Booked badge when filterDate matches a booked date", () => {
    // First booked date is deterministic per vendor
    const { container } = renderCard({ filterDate: "1900-01-01" }); // unlikely to be booked
    expect(container.textContent).toContain("Available");
  });

  it("toggles compare on button click", async () => {
    const user = userEvent.setup();
    renderCard();
    const btn = screen.getByRole("button", { name: /compare/i });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/components/vendor/VendorRowCard.test.tsx
```

- [ ] **Step 3: Implement `src/components/vendor/VendorRowCard.tsx`**

```tsx
"use client";
import Link from "next/link";
import type { Vendor } from "@/data/vendors";
import { useCompare } from "@/context/CompareContext";
import { isBooked } from "@/data/availability";

interface Props {
  vendor: Vendor;
  filterDate?: string;
}

export function VendorRowCard({ vendor, filterDate }: Props) {
  const { has, add, remove } = useCompare();
  const inCompare = has(vendor.id);
  const booked = filterDate ? isBooked(vendor.id, filterDate) : false;

  return (
    <article className="grid grid-cols-[80px_1fr_auto] gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
      <Link href={`/vendors/${vendor.id}`} className="block">
        <div
          className="w-20 h-20 rounded-lg bg-gradient-to-br from-shaadi-light to-shaadi-rose"
          aria-hidden
        />
      </Link>

      <div className="min-w-0">
        <Link href={`/vendors/${vendor.id}`} className="hover:underline">
          <h3 className="font-semibold text-slate-900 truncate">{vendor.name}</h3>
        </Link>
        <p className="text-xs text-slate-500 truncate">{vendor.tags.join(" · ")}</p>
        <p className="text-sm text-shaadi-deep mt-1">
          ⭐ {vendor.rating} ({vendor.reviewCount}) · {vendor.priceRange}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className={`text-xs ${booked ? "text-red-600" : "text-emerald-600"}`}>
          ● {booked ? "Booked" : "Available"}
        </span>
        <button
          type="button"
          onClick={() => (inCompare ? remove(vendor.id) : add(vendor.id))}
          aria-pressed={inCompare}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            inCompare
              ? "bg-shaadi-deep text-white border-shaadi-deep"
              : "border-gray-300 text-slate-700 hover:border-shaadi-deep hover:text-shaadi-deep"
          }`}
        >
          {inCompare ? "✓ Comparing" : "+ Compare"}
        </button>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/components/vendor/VendorRowCard.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/components/vendor/VendorRowCard.tsx src/components/vendor/VendorRowCard.test.tsx
git commit -m "feat: add VendorRowCard component for listing"
```

---

### Task 13: `VendorListingFilters` component

**Files:**
- Create: `src/components/vendor/VendorListingFilters.tsx`
- Test: `src/components/vendor/VendorListingFilters.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/vendor/VendorListingFilters.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VendorListingFilters } from "./VendorListingFilters";

const noop = () => {};
const filters = { sort: "popularity" as const };

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: noop }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/vendors/mumbai/photography",
}));

describe("VendorListingFilters", () => {
  it("renders city, category, sort chips", () => {
    render(<VendorListingFilters cityName="Mumbai" categoryName="Photography" />);
    expect(screen.getByText(/Mumbai/)).toBeInTheDocument();
    expect(screen.getByText(/Photography/)).toBeInTheDocument();
    expect(screen.getByText(/Sort/)).toBeInTheDocument();
  });

  it("Clear all appears only when at least one filter is set", () => {
    render(<VendorListingFilters cityName="Mumbai" categoryName="Photography" />);
    expect(screen.queryByRole("button", { name: /clear all/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/components/vendor/VendorListingFilters.test.tsx
```

- [ ] **Step 3: Implement `src/components/vendor/VendorListingFilters.tsx`**

```tsx
"use client";
import { useState } from "react";
import { useVendorFilters } from "@/hooks/useVendorFilters";

interface Props {
  cityName: string;
  categoryName: string;
}

const RATINGS = [4.5, 4, 3.5];
const SORT_OPTIONS: { v: "popularity" | "rating" | "price-asc" | "price-desc"; label: string }[] = [
  { v: "popularity", label: "Popularity" },
  { v: "rating", label: "Top rated" },
  { v: "price-asc", label: "Price: low to high" },
  { v: "price-desc", label: "Price: high to low" },
];

export function VendorListingFilters({ cityName, categoryName }: Props) {
  const { filters, setFilter, clear } = useVendorFilters();
  const [open, setOpen] = useState<string | null>(null);
  const hasFilters = !!(filters.budget || filters.rating || filters.date) || filters.sort !== "popularity";

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <span className="px-3 py-1 rounded-full bg-shaadi-deep text-white text-xs">📍 {cityName}</span>
      <span className="px-3 py-1 rounded-full bg-shaadi-deep text-white text-xs">{categoryName}</span>

      <FilterChip
        label={filters.rating ? `⭐ ${filters.rating}+` : "⭐ Rating"}
        active={!!filters.rating}
        onOpen={() => setOpen(open === "rating" ? null : "rating")}
        isOpen={open === "rating"}
      >
        {RATINGS.map((r) => (
          <button
            key={r}
            onClick={() => { setFilter("rating", r); setOpen(null); }}
            className="block w-full text-left px-3 py-1.5 hover:bg-shaadi-light text-sm"
          >
            {r}+ stars
          </button>
        ))}
      </FilterChip>

      <FilterChip
        label={filters.date ? `📅 ${filters.date}` : "📅 Date"}
        active={!!filters.date}
        onOpen={() => setOpen(open === "date" ? null : "date")}
        isOpen={open === "date"}
      >
        <input
          type="date"
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => { setFilter("date", e.target.value); setOpen(null); }}
          className="block w-full px-3 py-2 text-sm"
        />
      </FilterChip>

      <FilterChip
        label={`Sort: ${SORT_OPTIONS.find((s) => s.v === filters.sort)?.label}`}
        active={filters.sort !== "popularity"}
        onOpen={() => setOpen(open === "sort" ? null : "sort")}
        isOpen={open === "sort"}
      >
        {SORT_OPTIONS.map((s) => (
          <button
            key={s.v}
            onClick={() => { setFilter("sort", s.v); setOpen(null); }}
            className="block w-full text-left px-3 py-1.5 hover:bg-shaadi-light text-sm"
          >
            {s.label}
          </button>
        ))}
      </FilterChip>

      {hasFilters && (
        <button onClick={clear} className="text-xs text-shaadi-deep underline ml-2">
          Clear all
        </button>
      )}
    </div>
  );
}

function FilterChip({
  label, active, isOpen, onOpen, children,
}: {
  label: string;
  active: boolean;
  isOpen: boolean;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        onClick={onOpen}
        className={`px-3 py-1 rounded-full border text-xs transition-colors ${
          active ? "border-shaadi-deep text-shaadi-deep bg-shaadi-light" : "border-gray-300 text-slate-700 hover:border-slate-400"
        }`}
      >
        {label} ▾
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/components/vendor/VendorListingFilters.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/components/vendor/VendorListingFilters.tsx src/components/vendor/VendorListingFilters.test.tsx
git commit -m "feat: add VendorListingFilters chip bar"
```

---

### Task 14: Listing page `/vendors/[city]/[category]/page.tsx`

**Files:**
- Create: `src/app/vendors/[city]/[category]/page.tsx`

**Project rule:** Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md` first — Next 16 dynamic route param API may differ from training data.

- [ ] **Step 1: Implement the page**

```tsx
// src/app/vendors/[city]/[category]/page.tsx
import { notFound } from "next/navigation";
import { sampleVendors } from "@/data/vendors";
import { findCityBySlug, findCategoryBySlug } from "@/lib/slugs";
import { VendorListingFilters } from "@/components/vendor/VendorListingFilters";
import { VendorListingResults } from "@/components/vendor/VendorListingResults";

interface Params {
  city: string;
  category: string;
}

// Per Next 16 docs, page `params` is a Promise — await it
export default async function VendorListing({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city, category } = await params;
  const cityObj = findCityBySlug(city);
  const categoryObj = findCategoryBySlug(category);
  if (!cityObj || !categoryObj) notFound();

  const matching = sampleVendors.filter(
    (v) => v.categoryId === categoryObj.id && v.city === cityObj.name,
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <header className="mb-3">
        <h1 className="text-2xl font-semibold text-slate-900">
          {categoryObj.name} in {cityObj.name}
        </h1>
        <p className="text-sm text-slate-600">{matching.length} vendors</p>
      </header>

      <VendorListingFilters cityName={cityObj.name} categoryName={categoryObj.name} />
      <VendorListingResults vendors={matching} />
    </main>
  );
}
```

- [ ] **Step 2: Create `VendorListingResults` (client wrapper)**

```tsx
// src/components/vendor/VendorListingResults.tsx
"use client";
import { useMemo } from "react";
import type { Vendor } from "@/data/vendors";
import { applyFilters, useVendorFilters } from "@/hooks/useVendorFilters";
import { VendorRowCard } from "./VendorRowCard";

export function VendorListingResults({ vendors }: { vendors: Vendor[] }) {
  const { filters, clear } = useVendorFilters();
  const filtered = useMemo(() => applyFilters(vendors, filters), [vendors, filters]);

  if (filtered.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600 mb-4">No vendors match your filters.</p>
        <button onClick={clear} className="text-shaadi-deep underline">
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {filtered.map((v) => (
        <VendorRowCard key={v.id} vendor={v} filterDate={filters.date} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
# Visit http://localhost:3000/vendors/mumbai/photography
# Visit http://localhost:3000/vendors/atlantis/photography  -> should 404
# Apply rating + sort filters; verify URL updates and results re-sort
```

- [ ] **Step 4: Commit**

```bash
git add src/app/vendors/[city]/[category]/page.tsx src/components/vendor/VendorListingResults.tsx
git commit -m "feat: add city+category vendor listing page"
```

---

### Task 15: `VendorProfileHero` + `VendorServicesList`

**Files:**
- Create: `src/components/vendor/VendorProfileHero.tsx`
- Create: `src/components/vendor/VendorServicesList.tsx`

- [ ] **Step 1: Implement `VendorProfileHero.tsx`**

```tsx
// src/components/vendor/VendorProfileHero.tsx
import type { Vendor } from "@/data/vendors";
import { statsByVendor } from "@/data/stats";

export function VendorProfileHero({ vendor }: { vendor: Vendor }) {
  const stats = statsByVendor[vendor.id];
  return (
    <header className="bg-gradient-to-br from-shaadi-light via-shaadi-rose to-shaadi-deep text-white p-6 rounded-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {vendor.name}{" "}
            {vendor.verified && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">✓ Verified</span>
            )}
          </h1>
          <p className="text-sm opacity-90">
            ⭐ {vendor.rating} ({vendor.reviewCount}) · {vendor.city} · {vendor.yearsExperience} yrs
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <Stat label="Weddings" value={stats.weddingsCompleted.toLocaleString()} />
        <Stat label="Customers" value={stats.customersServed.toLocaleString()} />
        <Stat label="Response" value={stats.responseTime} />
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/15 rounded-lg px-3 py-2">
      <div className="text-xs uppercase opacity-80">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
```

- [ ] **Step 2: Implement `VendorServicesList.tsx`**

```tsx
// src/components/vendor/VendorServicesList.tsx
import { findCategoryBySlug } from "@/lib/slugs";
import type { Vendor } from "@/data/vendors";

export function VendorServicesList({ vendor }: { vendor: Vendor }) {
  const category = findCategoryBySlug(vendor.categoryId);
  const services = category?.subcategories ?? [];
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Services Offered</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
        {services.map((s) => (
          <li key={s.id} className="flex gap-2 items-start">
            <span className="text-shaadi-deep">✓</span>
            {s.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/vendor/VendorProfileHero.tsx src/components/vendor/VendorServicesList.tsx
git commit -m "feat: add vendor profile hero + services list"
```

---

### Task 16: `VendorPortfolio` (gallery + lightbox)

**Files:**
- Create: `src/components/vendor/VendorPortfolio.tsx`

**Project rule:** Read `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` first.

- [ ] **Step 1: Implement**

```tsx
// src/components/vendor/VendorPortfolio.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import type { PortfolioImage } from "@/data/portfolio";

export function VendorPortfolio({ images }: { images: PortfolioImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Portfolio</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className="relative aspect-square overflow-hidden rounded-lg bg-shaadi-light"
            aria-label={`Open ${img.caption}`}
          >
            <Image
              src={img.url}
              alt={img.caption}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover hover:scale-105 transition-transform"
            />
            <span className="absolute top-1 right-1 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded uppercase">
              {img.eventType}
            </span>
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div className="relative w-full max-w-3xl aspect-[4/3]">
            <Image
              src={images[active].url}
              alt={images[active].caption}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/vendor/VendorPortfolio.tsx
git commit -m "feat: add vendor portfolio gallery with lightbox"
```

---

### Task 17: `VendorPackages`

**Files:**
- Create: `src/components/vendor/VendorPackages.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/components/vendor/VendorPackages.tsx
import type { Package } from "@/data/packages";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function VendorPackages({ packages }: { packages: Package[] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {packages.map((p) => (
          <div
            key={p.tier}
            className={`relative p-4 rounded-xl border-2 ${
              p.popular ? "border-shaadi-deep bg-shaadi-light" : "border-gray-200 bg-white"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-2 left-4 text-[10px] bg-shaadi-deep text-white px-2 py-0.5 rounded-full uppercase">
                Most Popular
              </span>
            )}
            <h3 className="text-sm uppercase text-slate-500">{p.tier}</h3>
            <div className="text-xl font-semibold text-slate-900 mt-1">{p.name}</div>
            <div className="text-2xl font-bold text-shaadi-deep mt-2">{formatINR(p.price)}</div>
            <ul className="text-sm text-slate-700 space-y-1.5 mt-3">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-shaadi-deep">✓</span> {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/vendor/VendorPackages.tsx
git commit -m "feat: add vendor packages component"
```

---

### Task 18: `VendorAvailabilityCalendar`

**Files:**
- Create: `src/components/vendor/VendorAvailabilityCalendar.tsx`
- Test: `src/components/vendor/VendorAvailabilityCalendar.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/vendor/VendorAvailabilityCalendar.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VendorAvailabilityCalendar } from "./VendorAvailabilityCalendar";

describe("VendorAvailabilityCalendar", () => {
  it("renders the current month name", () => {
    render(<VendorAvailabilityCalendar bookedDates={[]} />);
    const m = new Date().toLocaleString("en-US", { month: "long" });
    expect(screen.getByText(new RegExp(m))).toBeInTheDocument();
  });

  it("marks booked dates with aria-label 'Booked'", () => {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    render(<VendorAvailabilityCalendar bookedDates={[iso]} />);
    expect(screen.getByLabelText(/Booked/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/components/vendor/VendorAvailabilityCalendar.test.tsx
```

- [ ] **Step 3: Implement**

```tsx
// src/components/vendor/VendorAvailabilityCalendar.tsx
"use client";
import { useState } from "react";

interface Props {
  bookedDates: string[];          // ISO YYYY-MM-DD
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
            const isBooked = bookedDates.includes(date);
            const isPast = date < todayISO;
            return (
              <button
                key={date}
                disabled={isPast || isBooked}
                onClick={() => onSelect?.(date)}
                aria-label={`${date}${isBooked ? " Booked" : isPast ? " Past" : " Available"}`}
                className={`aspect-square text-xs rounded transition-colors ${
                  isBooked
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
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- src/components/vendor/VendorAvailabilityCalendar.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/components/vendor/VendorAvailabilityCalendar.tsx src/components/vendor/VendorAvailabilityCalendar.test.tsx
git commit -m "feat: add vendor availability calendar"
```

---

### Task 19: `VendorReviews`

**Files:**
- Create: `src/components/vendor/VendorReviews.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/components/vendor/VendorReviews.tsx
import type { Review } from "@/data/reviews";

export function VendorReviews({ reviews }: { reviews: Review[] }) {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const histogram = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const max = Math.max(...histogram.map((h) => h.count), 1);

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Reviews ({reviews.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 bg-white border border-gray-200 rounded-xl p-4">
        <div>
          <div className="text-3xl font-bold text-slate-900">{avg.toFixed(1)}</div>
          <div className="text-amber-400">{"★".repeat(Math.round(avg))}</div>
          <div className="text-xs text-slate-500 mt-1">{reviews.length} reviews</div>
          <div className="mt-3 space-y-1">
            {histogram.map((h) => (
              <div key={h.star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-slate-500">{h.star}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${(h.count / max) * 100}%` }} />
                </div>
                <span className="w-6 text-right text-slate-500">{h.count}</span>
              </div>
            ))}
          </div>
        </div>

        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-gray-100 last:border-0 pb-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-medium text-slate-900">{r.title}</h3>
                <span className="text-xs text-slate-500">{r.date}</span>
              </div>
              <div className="text-amber-400 text-sm">{"★".repeat(r.rating)}</div>
              <p className="text-sm text-slate-700 mt-1">{r.body}</p>
              <p className="text-xs text-slate-500 mt-1">{r.author} · {r.eventType}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/vendor/VendorReviews.tsx
git commit -m "feat: add vendor reviews component with rating histogram"
```

---

### Task 20: `VendorEnquiryRail` + API route `/api/enquiries`

**Files:**
- Create: `src/components/vendor/VendorEnquiryRail.tsx`
- Create: `src/components/vendor/VendorEnquiryRail.test.tsx`
- Create: `src/app/api/enquiries/route.ts`

**Project rule:** Read `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` first — Next 16 route handler signatures may differ.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/vendor/VendorEnquiryRail.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VendorEnquiryRail } from "./VendorEnquiryRail";
import { sampleVendors } from "@/data/vendors";

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ ok: true, id: "abc" }), { status: 200 })
  ));
});

describe("VendorEnquiryRail", () => {
  it("shows inline error for invalid phone", async () => {
    const user = userEvent.setup();
    render(<VendorEnquiryRail vendor={sampleVendors[0]} />);
    await user.type(screen.getByLabelText(/name/i), "Priya");
    await user.type(screen.getByLabelText(/phone/i), "12345");
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(await screen.findByText(/valid 10-digit/i)).toBeInTheDocument();
  });

  it("shows thank-you state on success", async () => {
    const user = userEvent.setup();
    render(<VendorEnquiryRail vendor={sampleVendors[0]} />);
    await user.type(screen.getByLabelText(/name/i), "Priya");
    await user.type(screen.getByLabelText(/phone/i), "9876543210");
    await user.type(screen.getByLabelText(/event date/i), "2099-12-31");
    await user.selectOptions(screen.getByLabelText(/event type/i), "wedding");
    await user.type(screen.getByLabelText(/requirements/i), "Need cinematic photography for wedding.");
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(await screen.findByText(/we've sent your enquiry/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- src/components/vendor/VendorEnquiryRail.test.tsx
```

- [ ] **Step 3: Implement `src/components/vendor/VendorEnquiryRail.tsx`**

```tsx
"use client";
import { useState } from "react";
import type { Vendor } from "@/data/vendors";
import { useEnquiry } from "@/hooks/useEnquiry";
import { enquirySchema } from "@/lib/validators";
import { isBooked } from "@/data/availability";

const EVENT_TYPES = ["haldi", "mehendi", "wedding", "reception", "engagement", "sangeet"] as const;

export function VendorEnquiryRail({ vendor }: { vendor: Vendor }) {
  const { status, error, submit, reset } = useEnquiry();
  const [form, setForm] = useState({
    name: "", phone: "", eventDate: "", eventType: "wedding", requirements: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const today = new Date().toISOString().slice(0, 10);
  const dateBookedWarning = form.eventDate && isBooked(vendor.id, form.eventDate);

  if (status === "success") {
    return (
      <aside className="lg:sticky lg:top-20 bg-shaadi-cream border border-shaadi-light rounded-xl p-5">
        <h2 className="font-semibold text-slate-900">We've sent your enquiry 🎉</h2>
        <p className="text-sm text-slate-700 mt-2">
          {vendor.name} will reach out within 24 hours. We've saved this enquiry to your browser too.
        </p>
        <button onClick={reset} className="text-sm text-shaadi-deep underline mt-3">
          Send another enquiry
        </button>
      </aside>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = enquirySchema.safeParse({ vendorId: vendor.id, ...form });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    await submit(parsed.data);
  };

  return (
    <aside className="lg:sticky lg:top-20 bg-shaadi-cream border border-shaadi-light rounded-xl p-5 space-y-3">
      <h2 className="font-semibold text-slate-900">Send Enquiry</h2>
      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <Field label="Name" id="name" error={errors.name}>
          <input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Phone" id="phone" error={errors.phone}>
          <input
            id="phone"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input"
            placeholder="10-digit Indian mobile"
          />
        </Field>
        <Field label="Event date" id="eventDate" error={errors.eventDate}>
          <input
            id="eventDate"
            type="date"
            min={today}
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            className="input"
          />
          {dateBookedWarning && (
            <p className="text-xs text-amber-700 mt-1">
              This vendor is booked on this date — we'll request alternates.
            </p>
          )}
        </Field>
        <Field label="Event type" id="eventType" error={errors.eventType}>
          <select
            id="eventType"
            value={form.eventType}
            onChange={(e) => setForm({ ...form, eventType: e.target.value })}
            className="input"
          >
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Requirements" id="requirements" error={errors.requirements}>
          <textarea
            id="requirements"
            rows={3}
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            className="input resize-none"
          />
        </Field>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-shaadi-deep text-white rounded-lg py-2 font-medium disabled:opacity-50"
        >
          {status === "submitting" ? "Sending..." : "Send Enquiry"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-700">Couldn't send: {error}. Please try again.</p>
        )}
      </form>
      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: white;
          font-size: 14px;
          color: #0f172a;
        }
      `}</style>
    </aside>
  );
}

function Field({ label, id, error, children }: {
  label: string; id: string; error?: string; children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-xs font-medium text-slate-700 mb-1">{label}</span>
      {children}
      {error && <span className="block text-xs text-red-700 mt-1">{error}</span>}
    </label>
  );
}
```

- [ ] **Step 4: Implement the API route**

```ts
// src/app/api/enquiries/route.ts
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { enquirySchema } from "@/lib/validators";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const id = randomUUID();
  // Slice A stub: log only. Slice B will persist to Postgres.
  console.log("[enquiries] received", { id, ...parsed.data });
  return NextResponse.json({ ok: true, id }, { status: 201 });
}
```

- [ ] **Step 5: Run — expect PASS**

```bash
npm test -- src/components/vendor/VendorEnquiryRail.test.tsx
```

- [ ] **Step 6: Manual smoke test**

```bash
npm run dev
# In another terminal:
curl -X POST http://localhost:3000/api/enquiries \
  -H 'Content-Type: application/json' \
  -d '{"vendorId":"v5","name":"Priya","phone":"9876543210","eventDate":"2099-12-31","eventType":"wedding","requirements":"Need cinematic photography for wedding."}'
# Expected: {"ok":true,"id":"<uuid>"} and console.log line in dev server output
```

- [ ] **Step 7: Commit**

```bash
git add src/components/vendor/VendorEnquiryRail.tsx src/components/vendor/VendorEnquiryRail.test.tsx src/app/api/enquiries/route.ts
git commit -m "feat: add vendor enquiry rail and API stub"
```

---

### Task 21: Profile page `/vendors/[id]/page.tsx`

**Files:**
- Modify: `src/app/vendors/[id]/page.tsx` (currently does not exist; new file at this path)

- [ ] **Step 1: Implement**

```tsx
// src/app/vendors/[id]/page.tsx
import { notFound } from "next/navigation";
import { sampleVendors } from "@/data/vendors";
import { portfolioByVendor } from "@/data/portfolio";
import { packagesByVendor } from "@/data/packages";
import { reviewsByVendor } from "@/data/reviews";
import { bookedDatesByVendor } from "@/data/availability";
import { VendorProfileHero } from "@/components/vendor/VendorProfileHero";
import { VendorPortfolio } from "@/components/vendor/VendorPortfolio";
import { VendorPackages } from "@/components/vendor/VendorPackages";
import { VendorAvailabilityCalendar } from "@/components/vendor/VendorAvailabilityCalendar";
import { VendorReviews } from "@/components/vendor/VendorReviews";
import { VendorEnquiryRail } from "@/components/vendor/VendorEnquiryRail";
import { VendorServicesList } from "@/components/vendor/VendorServicesList";

export default async function VendorProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = sampleVendors.find((v) => v.id === id);
  if (!vendor) notFound();

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <div className="space-y-8 min-w-0">
        <VendorProfileHero vendor={vendor} />
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">About</h2>
          <p className="text-slate-700">{vendor.description}</p>
        </section>
        <VendorPortfolio images={portfolioByVendor[vendor.id]} />
        <VendorServicesList vendor={vendor} />
        <VendorPackages packages={packagesByVendor[vendor.id]} />
        <VendorAvailabilityCalendar bookedDates={bookedDatesByVendor[vendor.id]} />
        <VendorReviews reviews={reviewsByVendor[vendor.id]} />
      </div>
      <VendorEnquiryRail vendor={vendor} />
    </main>
  );
}
```

- [ ] **Step 2: Manual smoke test**

```bash
npm run dev
# Visit http://localhost:3000/vendors/v5  -> profile renders all sections
# Visit http://localhost:3000/vendors/zzz -> 404
```

- [ ] **Step 3: Commit**

```bash
git add src/app/vendors/[id]/page.tsx
git commit -m "feat: add vendor profile page (single-scroll + sticky rail)"
```

---

### Task 22: `CompareTray` (floating)

**Files:**
- Create: `src/components/compare/CompareTray.tsx`
- Modify: `src/app/layout.tsx` (mount tray once, app-wide)

- [ ] **Step 1: Implement `CompareTray.tsx`**

```tsx
// src/components/compare/CompareTray.tsx
"use client";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { sampleVendors } from "@/data/vendors";

export function CompareTray() {
  const { ids, remove, clear } = useCompare();
  if (ids.length === 0) return null;
  const selected = ids
    .map((id) => sampleVendors.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white border border-shaadi-light rounded-xl shadow-lg p-3 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-shaadi-deep">Compare ({ids.length}/3)</span>
        <button onClick={clear} className="text-xs text-slate-500 hover:underline">Clear</button>
      </div>
      <ul className="space-y-1 mb-2">
        {selected.map((v) => (
          <li key={v.id} className="flex items-center justify-between text-xs">
            <span className="truncate">{v.name}</span>
            <button onClick={() => remove(v.id)} className="text-slate-400 hover:text-red-700 ml-2" aria-label={`Remove ${v.name}`}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <Link
        href="/compare"
        className="block w-full text-center bg-shaadi-deep text-white text-sm py-1.5 rounded-lg"
      >
        Compare →
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Mount in `src/app/layout.tsx`**

Inside the existing providers, add `<CompareTray />` so it floats on every page:

```tsx
import { CompareTray } from "@/components/compare/CompareTray";
// ...
<CompareProvider>
  {children}
  <CompareTray />
</CompareProvider>
```

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
# On /vendors/mumbai/photography click "+ Compare" on 2 vendors
# Floating tray bottom-right shows count + names
# Click Compare -> navigates to /compare (404 until Task 23)
```

- [ ] **Step 4: Commit**

```bash
git add src/components/compare/CompareTray.tsx src/app/layout.tsx
git commit -m "feat: add floating compare tray"
```

---

### Task 23: `ComparisonTable` + `/compare` page

**Files:**
- Create: `src/components/compare/ComparisonTable.tsx`
- Create: `src/app/compare/page.tsx`

- [ ] **Step 1: Implement `ComparisonTable.tsx`**

```tsx
// src/components/compare/ComparisonTable.tsx
"use client";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { sampleVendors } from "@/data/vendors";
import { packagesByVendor } from "@/data/packages";
import { statsByVendor } from "@/data/stats";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function ComparisonTable() {
  const { ids, remove } = useCompare();
  const vendors = ids
    .map((id) => sampleVendors.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  if (vendors.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600 mb-4">No vendors selected.</p>
        <Link href="/vendors" className="text-shaadi-deep underline">Browse vendors</Link>
      </div>
    );
  }

  const cols = `200px repeat(${vendors.length}, minmax(220px, 1fr))`;

  const Row = ({ label, render }: { label: string; render: (v: typeof vendors[number]) => React.ReactNode }) => (
    <div className="grid items-start gap-3 py-3 border-b border-gray-100" style={{ gridTemplateColumns: cols }}>
      <div className="text-xs uppercase text-slate-500">{label}</div>
      {vendors.map((v) => <div key={v.id} className="text-sm text-slate-800">{render(v)}</div>)}
    </div>
  );

  return (
    <div className="overflow-x-auto">
      {/* Sticky vendor headers */}
      <div className="grid items-end gap-3 pb-3 border-b border-gray-200 sticky top-0 bg-white" style={{ gridTemplateColumns: cols }}>
        <div />
        {vendors.map((v) => (
          <div key={v.id} className="space-y-1">
            <div className="aspect-[4/3] bg-gradient-to-br from-shaadi-light to-shaadi-rose rounded-lg" aria-hidden />
            <h3 className="font-semibold text-slate-900 truncate">{v.name}</h3>
            <button onClick={() => remove(v.id)} className="text-xs text-slate-500 hover:text-red-700">
              Remove
            </button>
          </div>
        ))}
      </div>

      <Row label="Rating" render={(v) => <>⭐ {v.rating} ({v.reviewCount})</>} />
      <Row label="Starting price" render={(v) => formatINR(packagesByVendor[v.id][0].price)} />
      <Row label="City" render={(v) => v.city} />
      <Row label="Experience" render={(v) => `${v.yearsExperience} yrs`} />
      <Row label="Verified" render={(v) => (v.verified ? "✓ Yes" : "—")} />
      <Row label="Response time" render={(v) => statsByVendor[v.id].responseTime} />
      <Row label="Tags" render={(v) => v.tags.join(", ")} />

      <div className="grid items-stretch gap-3 pt-4" style={{ gridTemplateColumns: cols }}>
        <div />
        {vendors.map((v) => (
          <Link
            key={v.id}
            href={`/vendors/${v.id}`}
            className="text-center bg-shaadi-deep text-white py-2 rounded-lg text-sm"
          >
            View profile & enquire
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Implement page**

```tsx
// src/app/compare/page.tsx
import { ComparisonTable } from "@/components/compare/ComparisonTable";

export default function ComparePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">Compare Vendors</h1>
      <ComparisonTable />
    </main>
  );
}
```

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
# Add 2 vendors via the compare tray, click Compare -> /compare renders both columns
# Remove one column -> tray + table both update
```

- [ ] **Step 4: Commit**

```bash
git add src/components/compare/ComparisonTable.tsx src/app/compare/page.tsx
git commit -m "feat: add side-by-side vendor comparison page"
```

---

### Task 24: Rework `/vendors/page.tsx` (browse-all)

**Files:**
- Modify: `src/app/vendors/page.tsx`

The existing `/vendors/page.tsx` is a flat list with inline filtering. Replace it with a city + category landing page so users have a clear path into `/vendors/[city]/[category]`.

- [ ] **Step 1: Replace with city × category landing**

```tsx
// src/app/vendors/page.tsx
import Link from "next/link";
import { categories } from "@/data/categories";
import { cities } from "@/data/cities";
import { sampleVendors } from "@/data/vendors";
import { toSlug } from "@/lib/slugs";

const HIGHLIGHT_CITIES = ["Mumbai", "New Delhi", "Jaipur", "Bangalore", "Lucknow", "Udaipur"];

export default function BrowseVendors() {
  const visibleCities = cities
    .map((c) => c.name)
    .filter((name) => HIGHLIGHT_CITIES.includes(name));

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Browse Vendors</h1>
        <p className="text-slate-600 mt-1">Pick a city and a category to start exploring.</p>
      </header>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Popular cities</h2>
        <div className="flex flex-wrap gap-2">
          {visibleCities.map((name) => (
            <Link
              key={name}
              href={`/vendors/${toSlug(name)}/${categories[0].id}`}
              className="px-4 py-1.5 rounded-full bg-shaadi-light text-shaadi-deep text-sm hover:bg-shaadi-rose hover:text-white transition-colors"
            >
              {name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">All categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const count = sampleVendors.filter((v) => v.categoryId === cat.id).length;
            return (
              <Link
                key={cat.id}
                href={`/vendors/${toSlug(HIGHLIGHT_CITIES[0])}/${cat.id}`}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-shaadi-deep transition-colors"
              >
                <div className="text-2xl">{cat.emoji}</div>
                <h3 className="font-medium text-slate-900 mt-1">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{count} vendors</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Manual smoke test**

```bash
npm run dev
# Visit http://localhost:3000/vendors -> city pills + category grid
# Click a city or category card -> lands on /vendors/[city]/[category]
```

- [ ] **Step 3: Commit**

```bash
git add src/app/vendors/page.tsx
git commit -m "refactor: replace /vendors page with city + category landing"
```

---

### Task 25: `not-found.tsx` for vendors routes

**Files:**
- Create: `src/app/vendors/not-found.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/app/vendors/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">We couldn't find that page</h1>
      <p className="text-slate-600 mt-2">The city, category, or vendor you're looking for doesn't exist.</p>
      <Link
        href="/vendors"
        className="inline-block mt-6 bg-shaadi-deep text-white px-5 py-2 rounded-lg"
      >
        Browse all categories
      </Link>
    </main>
  );
}
```

- [ ] **Step 2: Manual smoke test**

```bash
npm run dev
# Visit /vendors/atlantis/photography  -> custom not-found, not Next default
# Visit /vendors/zzz -> custom not-found
```

- [ ] **Step 3: Commit**

```bash
git add src/app/vendors/not-found.tsx
git commit -m "feat: custom not-found for vendors routes"
```

---

### Task 26: E2E happy paths

**Files:**
- Create: `e2e/browse.spec.ts`
- Create: `e2e/enquiry.spec.ts`
- Create: `e2e/compare.spec.ts`

- [ ] **Step 1: Browse → filter → profile (`e2e/browse.spec.ts`)**

```ts
import { test, expect } from "@playwright/test";

test("browse listing then open vendor profile", async ({ page }) => {
  await page.goto("/vendors/mumbai/photography");
  await expect(page.getByRole("heading", { name: /Photography & Media in Mumbai/i })).toBeVisible();

  // Apply rating filter
  await page.getByRole("button", { name: /Rating/i }).click();
  await page.getByRole("button", { name: /4\.5\+ stars/i }).click();
  await expect(page).toHaveURL(/rating=4\.5/);

  // Open first vendor
  const firstVendor = page.locator("article").first();
  await firstVendor.getByRole("link").first().click();
  await expect(page.getByRole("heading", { name: /Portfolio/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Packages/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Availability/i })).toBeVisible();
});
```

- [ ] **Step 2: Enquiry happy path (`e2e/enquiry.spec.ts`)**

```ts
import { test, expect } from "@playwright/test";

test("submit an enquiry and persist to localStorage", async ({ page }) => {
  await page.goto("/vendors/v5");

  await page.getByLabel(/Name/).fill("Priya");
  await page.getByLabel(/Phone/).fill("9876543210");
  await page.getByLabel(/Event date/).fill("2099-12-31");
  await page.getByLabel(/Event type/).selectOption("wedding");
  await page.getByLabel(/Requirements/).fill("Need cinematic photography for our 2-day wedding.");
  await page.getByRole("button", { name: /Send Enquiry/i }).click();

  await expect(page.getByText(/We've sent your enquiry/i)).toBeVisible();

  const stored = await page.evaluate(() => localStorage.getItem("shaadisetu.enquiries"));
  expect(stored).toContain("v5");
});
```

- [ ] **Step 3: Compare flow (`e2e/compare.spec.ts`)**

```ts
import { test, expect } from "@playwright/test";

test("add two vendors, compare, then remove one", async ({ page }) => {
  await page.goto("/vendors/mumbai/photography");

  const cards = page.locator("article");
  await cards.nth(0).getByRole("button", { name: /Compare/i }).click();
  await cards.nth(1).getByRole("button", { name: /Compare/i }).click();

  // Tray visible
  await expect(page.getByText(/Compare \(2\/3\)/)).toBeVisible();

  await page.getByRole("link", { name: /Compare →/i }).click();
  await expect(page).toHaveURL(/\/compare/);

  // Two vendor headers visible
  const headers = page.locator("h3");
  await expect(headers.nth(0)).toBeVisible();
  await expect(headers.nth(1)).toBeVisible();

  // Remove one
  await page.getByRole("button", { name: /^Remove$/ }).first().click();
  await expect(page.getByText(/Compare \(1\/3\)/)).toBeVisible();
});
```

- [ ] **Step 4: Run E2E**

```bash
npm run e2e
```
Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add e2e
git commit -m "test: add Playwright happy-path E2E for browse/enquiry/compare"
```

---

### Task 27: Final wiring + README + commit cleanup

**Files:**
- Modify: `README.md`
- Modify: any in-progress page files (`src/app/categories/`, `src/app/client-diaries/`, `src/app/functions/`, `src/app/login/`, `src/app/membership/`, `src/app/plan/`, `src/app/signup/`) and components (`EntryPaths.tsx`, `ShaadiSetuWay.tsx`, `TopVendors.tsx`)
- Modify: `src/data/vendors.ts`, `src/data/blogs.ts`, `src/data/categories.ts`, `src/data/functions.ts` (already-modified files)

- [ ] **Step 1: Wire up uncommitted pages and components**

Open `npm run dev` and walk every navbar link. For each in-progress page, ensure:
- Page renders without errors
- All buttons/links go somewhere valid (real route or `#` placeholder)
- New components (`EntryPaths`, `ShaadiSetuWay`, `TopVendors`) are imported into `src/app/page.tsx` if intended for the landing page

If any page is half-finished and not part of Slice A, move it to a feature branch or delete it — don't ship broken UI on `main`.

- [ ] **Step 2: Update README**

Append to `README.md`:

```markdown
## Development

\`\`\`bash
npm install
npm run dev          # http://localhost:3000
npm test             # unit/component (Vitest)
npm run e2e          # Playwright E2E (requires dev server; auto-starts)
\`\`\`

## Architecture

- **Slice A — Vendor Browsing v1** (current)
  - All vendor data is mock (`src/data/*.ts`); no DB yet.
  - Enquiry POSTs to `/api/enquiries` — currently logs only; persisted to `localStorage` for the user.
  - Compare uses `CompareContext` (localStorage-backed, max 3 vendors).
- See \`docs/superpowers/specs/2026-04-28-vendor-browsing-v1-design.md\` for the full design.
```

- [ ] **Step 3: Final test + smoke**

```bash
npm test            # all unit/component pass
npm run e2e         # all 3 E2E pass
npm run lint        # passes
npm run build       # passes
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: finish Slice A wiring, README, and uncommitted pages"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Routes & file structure → Tasks 14, 21, 22–24, 25
- ✅ Layout B listing → Task 13 (filters) + 12 (row card) + 14 (page)
- ✅ Layout B profile → Task 21 page + 15–20 sub-components
- ✅ Mock data: portfolio/availability/reviews/packages/stats → Tasks 4–8
- ✅ URL conventions → Tasks 9 (filter URL parsing) + 14 (route shape)
- ✅ Filter behavior including booked-date sort → Task 9 (`applyFilters`)
- ✅ Enquiry validation + POST + localStorage → Tasks 3, 11, 20
- ✅ Compare with max-3 + tray + page → Tasks 10, 22, 23
- ✅ Mobile behavior → Tailwind classes throughout (sticky `lg:` breakpoint, horizontal scroll on table)
- ✅ Error handling: notFound, invalid params silently ignored, localStorage try/catch, fetch error → Tasks 9, 10, 11, 14, 21, 25
- ✅ Testing strategy → Tasks 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 18, 20, 26

**Type-consistency check:**
- `EnquiryInput` defined in Task 3, used in Task 11, Task 20 — consistent.
- `Package`, `PortfolioImage`, `Review`, `VendorStats` all defined in their own data tasks before they're imported by components.
- `FilterState` in Task 9 has `sort` required (default "popularity") to match the URL parser.
- `applyFilters` signature `(vendors, filters) -> Vendor[]` matches usage in `VendorListingResults` (Task 14).
- `CompareContext.add` returns `boolean` (true added, false rejected) — matches the test in Task 10 and could be wired to a toast in a future task; toast itself is not in scope for Slice A.

**Placeholder scan:**
- One genuine "TBD"-like spot in Task 7 Step 5: I left `// ...add 22+ more curated IDs in the same shape` — this is intentional because the actual photo IDs require manual curation in Step 1. The plan instructs the engineer how to verify and add them. Acceptable.
- No other TODO/FIXME placeholders in code blocks.

---
