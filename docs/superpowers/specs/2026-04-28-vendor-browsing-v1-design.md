# ShaadiSetu — Vendor Browsing v1 Design Spec

**Date:** 2026-04-28
**Slice:** A (first of seven planned slices toward the full Wedding Super App)
**Status:** Frontend-only, mock data. No backend, no auth, no DB.

## Overview

Slice A delivers a polished, demoable vendor browsing experience: users land on the homepage, pick a city + category, browse a filtered listing, open a rich vendor profile, compare 2–3 vendors side-by-side, and submit an enquiry that round-trips through a Next.js API route. Everything reads from `src/data/*.ts` mock files. This slice also finishes the in-progress pages already drafted in the working tree (Functions, Client Diaries, Membership, Plan, Login/Signup as UI shells; new components EntryPaths, ShaadiSetuWay, TopVendors).

This is the foundation for Slice B (real lead capture with Postgres) and beyond.

## Tech Stack

- **Framework:** Next.js 16 (App Router) — already installed
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 — already installed, theme tokens defined in `src/app/globals.css`
- **Validation:** Zod (new dependency) for enquiry form
- **Testing:** Vitest + React Testing Library (unit/component), Playwright (3 E2E happy paths)
- **Images:** Unsplash via URL with Next.js `<Image>` (configure `next.config.ts` `images.remotePatterns`)

## Routes & File Structure

```
src/app/
├── vendors/
│   ├── page.tsx                          # Browse-all + city/category landing
│   ├── [city]/
│   │   └── [category]/
│   │       └── page.tsx                  # Listing page (Layout B: chips + row cards)
│   └── [id]/
│       └── page.tsx                      # Profile page (Layout B: scroll + sticky rail)
├── compare/
│   └── page.tsx                          # 2–3 vendors side-by-side
└── api/
    └── enquiries/
        └── route.ts                      # POST handler — validates + console.log + returns ok

src/data/
├── (existing) categories.ts, cities.ts, vendors.ts, blogs.ts, functions.ts
├── portfolio.ts                          # Unsplash URLs per vendor (5–8 each)
├── availability.ts                       # Booked dates per vendor (~5 over 6 months)
├── reviews.ts                            # 5–10 hand-written reviews per vendor
├── packages.ts                           # 3 packages per vendor (basic/standard/premium)
└── stats.ts                              # weddingsCompleted, customersServed, responseTime per vendor

src/components/vendor/
├── VendorListingFilters.tsx              # Top filter chips (city/category/budget/rating/date/sort)
├── VendorRowCard.tsx                     # Wide row card for listing
├── VendorProfileHero.tsx                 # Cover image + name + verified badge + stats strip
├── VendorPortfolio.tsx                   # Gallery grid + lightbox
├── VendorPackages.tsx                    # 3 pricing cards
├── VendorAvailabilityCalendar.tsx        # Month grid with available/booked states
├── VendorReviews.tsx                     # Review list + rating histogram
├── VendorEnquiryRail.tsx                 # Sticky form (desktop) / bottom sheet (mobile)
└── VendorServicesList.tsx                # Bullet list of services offered

src/components/compare/
├── CompareTray.tsx                       # Floating bottom-right "Compare (N)" pill
└── ComparisonTable.tsx                   # Side-by-side feature matrix

src/context/
└── CompareContext.tsx                    # Add/remove/clear vendor ids; persisted to localStorage

src/hooks/
├── useVendorFilters.ts                   # URL-synced filter state
└── useEnquiry.ts                         # Submit + localStorage history

src/lib/
├── slugs.ts                              # City/category slug normalization helpers
└── validators.ts                         # Zod schemas (enquiry, phone)
```

In addition, the design wires up the already-drafted-but-uncommitted pages in `src/app/`: `categories/`, `client-diaries/`, `functions/`, `login/`, `membership/`, `plan/`, `signup/`, `vendor/dashboard/`, `vendors/` and the new components `EntryPaths.tsx`, `ShaadiSetuWay.tsx`, `TopVendors.tsx`. Their UI shells are completed but no backend behavior is connected.

## Layouts (validated visually)

### Listing page (Layout B)
- **Top filter chips bar**: City (locked from URL slug), Category (locked from URL slug), Budget, Rating, Date, Sort
- **Wide row vendor cards**: cover image (60–80px square), name, key tags, rating + review count, price range, availability badge ("● Available" green / "● Booked" red when a date filter is set and overlaps booked dates), "+ Compare" button
- Mobile: chips horizontally scroll; cards become 1 col

### Profile page (Layout B)
- **Cover hero**: gradient cover image + verified badge + photo counter
- **Title strip**: name, ⭐ rating (count), city, years experience
- **Single-scroll content sections** (no tabs): Overview → Stats strip → Portfolio → Services → Packages → Availability → Reviews
- **Sticky right rail (desktop ≥ lg)**: Enquiry form always visible
- **Mobile**: rail collapses to bottom bar `Starts at ₹X · Enquire Now`; tap opens full-screen modal form

## Data Shapes (additions)

```ts
// src/data/portfolio.ts
export interface PortfolioImage {
  id: string;
  url: string;          // Unsplash URL with ?w=1200&q=80
  caption: string;
  eventType: 'haldi' | 'mehendi' | 'wedding' | 'reception' | 'engagement';
}
export const portfolioByVendor: Record<string, PortfolioImage[]>;

// src/data/availability.ts
export const bookedDatesByVendor: Record<string, string[]>;  // ISO YYYY-MM-DD

// src/data/reviews.ts
export interface Review {
  id: string;
  author: string;        // "Priya S."
  rating: number;        // 1–5
  date: string;          // ISO
  title: string;
  body: string;
  eventType: string;     // "Wedding · Dec 2025"
}
export const reviewsByVendor: Record<string, Review[]>;

// src/data/packages.ts
export interface Package {
  tier: 'basic' | 'standard' | 'premium';
  name: string;
  price: number;         // INR
  features: string[];    // 5–7 bullets
  popular?: boolean;
}
export const packagesByVendor: Record<string, Package[]>;

// src/data/stats.ts
export interface VendorStats {
  weddingsCompleted: number;
  customersServed: number;
  yearsExperience: number;     // mirrors vendor.yearsExperience
  responseTime: string;        // "Usually within 2 hours"
}
export const statsByVendor: Record<string, VendorStats>;
```

All keyed by `vendor.id`. The existing `Vendor` interface in `src/data/vendors.ts` is unchanged.

## URL Conventions

- **Listing:** `/vendors/[city]/[category]?budget=X&rating=Y&date=YYYY-MM-DD&sort=Z`
  - City and category slugs are lowercase, dash-separated (e.g., `new-delhi`, `photography`)
  - Slug normalization in `src/lib/slugs.ts`
- **Profile:** `/vendors/[id]` (e.g., `/vendors/v5`)
- **Compare:** `/compare` — vendor ids read from `CompareContext` (localStorage-backed)

## Filter Behavior

- **URL is the source of truth.** URL params parsed via Zod with `.catch(undefined)` so invalid values are silently ignored.
- City + category come from path; budget, rating, date, sort from search params.
- Filter chip click opens a popover (multi-budget select / rating threshold / date picker / sort options).
- **Sort options:** Popularity (review count), Rating high→low, Price low→high, Price high→low.
- **Date filter:** vendors with that date in `bookedDatesByVendor[id]` show "Booked" badge and are sorted to the bottom of results.
- **"Clear all"** pill appears when ≥1 filter is active.
- **Empty state:** illustration + "No vendors match — try removing filters", with a "Clear filters" CTA.

## Enquiry Flow

**Form fields:** name, phone, event date, event type, requirements (textarea).

**Validation (Zod, in `src/lib/validators.ts`):**
- name: min 2 chars
- phone: `/^[6-9]\d{9}$/` (Indian 10-digit mobile)
- event date: must be in the future
- event type: enum
- requirements: min 10 chars

**Submit:**
1. Client-side Zod validation; inline errors below each field on failure.
2. `POST /api/enquiries` with JSON body — Next.js route handler in `src/app/api/enquiries/route.ts` re-validates with the same Zod schema, `console.log`s the enquiry, returns `{ ok: true, id: <uuid> }`.
3. On success: replace form with thank-you state ("We've sent your enquiry. The vendor will reach out within 24h.").
4. **Persistence:** save to `localStorage['shaadisetu.enquiries']` (array of enquiry records with vendor id, timestamp, and form data). Read on page load to display "You've enquired with this vendor before" hint.
5. On POST failure: form stays open, inline error banner ("Couldn't send. Please try again."), submit re-enabled.

## Compare Flow

- **Trigger:** "+ Add to Compare" button on every vendor row card and profile page.
- **State:** `CompareContext` holds up to 3 vendor ids; persisted to `localStorage['shaadisetu.compare']`.
- **Floating tray** (`CompareTray`): bottom-right pill, hidden when count = 0, shows count + thumbnails + "Compare →" + "Clear" buttons.
- **Overflow:** adding a 4th vendor triggers a toast: "You can compare up to 3 vendors. Remove one first." No silent drop.
- **`/compare` page (`ComparisonTable`):** side-by-side table — cover image, name, rating, starting price, services list, response time, verified status, "Enquire" CTA per column (links back to profile).
- **Removing** a vendor from `/compare` updates the tray immediately.
- **Mobile:** table becomes horizontal-scroll, vendor column headers stick on scroll.

## Mobile Behavior

- Listing chips horizontally scroll; cards become 1 column.
- Filter popovers become full-screen sheets on mobile.
- Profile content single-column; sticky right rail becomes a fixed bottom bar.
- Compare table horizontally scrollable with sticky column headers.
- Calendar shows single-month view with arrow nav; tighter cell sizing.
- Portfolio: 3-col desktop → 2-col mobile; lightbox uses native swipe.
- Compare tray: smaller pill on mobile (count only, expands on tap).

## Error Handling & Edge Cases

- **Unknown city/category slug** → `notFound()` → custom `not-found.tsx` with "Browse all categories" CTA.
- **Unknown vendor id** → same `notFound()` flow.
- **Empty filter result** → friendly empty state, not a 404.
- **Invalid filter param** (`?rating=abc`) → Zod silently parses to `undefined`; no crash.
- **Date in past** for enquiry/availability filter → date picker disables past dates; URL-forced past dates treated as no filter.
- **Booked date selected in enquiry form** → inline warning under the date field: "This vendor is booked on this date. Submitting anyway will request alternate dates." (Submission still allowed.)
- **localStorage unavailable** (private mode) → wrap reads/writes in try/catch; enquiry still POSTs; compare context falls back to in-memory state.
- **Unsplash image failure** → Next `<Image>` with CSS gradient placeholder + emoji fallback block. `next.config.ts` configured with `images.remotePatterns` for `images.unsplash.com`.
- **Compare overflow** → toast on 4th add attempt; no silent drop.

## Testing Strategy

### Unit (Vitest + React Testing Library)
- `useVendorFilters` — URL params parse/serialize round-trip, invalid params ignored, sort logic deterministic.
- `CompareContext` — add/remove/clear, max 3 enforced, localStorage hydration with try/catch.
- `phoneValidator` — accepts `[6-9]\d{9}`, rejects everything else (boundary cases: `5xxxxxxxxx`, 9 digits, 11 digits, alphanumeric).
- Pure date helpers in `availability.ts` — booked-date lookup, "is past" check.

### Component
- `VendorRowCard` — renders name/rating/price; shows "Booked" badge when date filter overlaps booked dates; fires compare add on click.
- `VendorEnquiryRail` — Zod validation surfaces inline errors; success state replaces form; retry on POST failure.
- `CompareTray` — hides at 0; shows count; removes vendor; links to `/compare`.
- `VendorAvailabilityCalendar` — booked dates marked; past dates disabled; month navigation.

### E2E (Playwright, 3 happy paths)
1. **Browse → filter → profile:** Home → click "Photography" + "Mumbai" → listing renders → apply rating filter → click first vendor → profile loads with portfolio, packages, and calendar visible.
2. **Enquiry happy path:** On profile, fill form (valid name + valid phone + future date + requirements) → submit → thank-you state visible → reload → enquiry record present in `localStorage`.
3. **Compare flow:** From listing, click "+ Compare" on 2 vendors → tray appears → click "Compare" → `/compare` page renders both columns → remove one column → tray updates.

### Out of Test Scope
- Visual regression (deferred to v2)
- API contract tests (no real backend yet)
- Full accessibility audit (manual axe pass at end of slice; comprehensive audit deferred)

## Out of Scope (later slices)

- Real backend, database, authentication, OTP
- Vendor self-serve dashboard with editable profile/portfolio/calendar/leads
- Real search engine (Meilisearch)
- Booking + payment integration
- Admin panel (vendor approval, featured vendors, analytics)
- Map view on listing page (deferred from Layout C)
- Chat between user and vendor
- AI vendor recommendations
- Wedding packages (bundled services), guest management, wedding website builder

## Deliverables

- All routes/components/data/hooks/lib files listed in **Routes & File Structure**
- Zod added as a dependency (`pnpm add zod` or equivalent)
- `next.config.ts` updated with Unsplash image domain
- Vitest + RTL + Playwright wired up with the tests listed in **Testing Strategy**
- All in-progress uncommitted pages either committed (after wiring up) or removed if abandoned
- README updated with run commands for dev/test/e2e

## Open Questions / Assumptions

- **Wedding-themed Unsplash photo curation:** ~30–50 high-quality wedding photo URLs covering haldi, mehendi, wedding, reception. Hand-picked during implementation. Implementation must verify each URL returns 200 (script or manual smoke check) before committing `portfolio.ts`. Runtime fallback (gradient + emoji) handles any later breakage.
- **Review authors:** ~30 plausible Indian first-name + last-initial combinations (Priya S., Arjun M., etc.) reused across vendors. No need to invent a unique persona per review.
- **Package pricing:** derived from each vendor's existing `priceRange` field — basic ≈ low end, premium ≈ high end, standard interpolated.
