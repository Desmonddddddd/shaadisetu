# ShaadiSetu — Vendor Backend v1 Design Spec

**Date:** 2026-04-28
**Slice:** B (Real Backend) — successor to Slice A (Vendor Browsing v1)
**Status:** Backend foundation. Replaces mock data + console-log enquiry stub with Postgres + Prisma. Deployed on Vercel.

## Overview

Slice B replaces the mock-data layer and the enquiry stub with a real Postgres backend. Every existing page keeps working with no visible change to the user; the difference is that vendor/category/city/package/portfolio/review/availability/stats data now comes from the database, and submitting an enquiry persists a row instead of console-logging.

This slice migrates the contents of `src/data/*.ts` into Postgres via a one-time seed script, then deletes the mock files. After this slice, the codebase has a single source of truth for application data.

## Tech Stack Additions

- **Prisma** ORM — schema in `prisma/schema.prisma`, generated client at `src/generated/prisma`, singleton at `src/lib/db.ts`.
- **Vercel Postgres (Neon)** — provisioned via the Vercel marketplace. Pooled `POSTGRES_PRISMA_URL` for runtime, direct `POSTGRES_URL_NON_POOLING` for migrations.
- **Docker Postgres** — local-only, for integration tests. Checked-in `docker-compose.yml`.
- **`vercel.ts`** — typed project config; sets `buildCommand` to run migrations before build.

## Architecture

- Server Components query Prisma directly (no internal HTTP hop). Idiomatic Next 16 + Fluid Compute.
- A single `PrismaClient` singleton at `src/lib/db.ts` is reused across server components and API routes.
- Read queries live in `src/lib/queries/*.ts` so pages call named functions (`getVendorProfile(id)`) rather than scattering `db.vendor.findUnique({ include: ... })` inline. Two-line wrappers are fine — the goal is one obvious test entry point per query.
- The write path (`POST /api/enquiries`) keeps the existing Zod validation and replaces the body with `db.enquiry.create({ data })`.
- Migrations run as part of the Vercel build command (`prisma migrate deploy`). Seed runs manually once after first deploy.

## Schema (Prisma)

Mirror of the existing TS interfaces with `createdAt`/`updatedAt` audit fields and an `Enquiry.status` enum. `Category.id` and `Subcategory.id` are slugs (matches today's mock-data shape — minimal blast radius on the client). `BookedDate.date` and `Review.date` keep ISO strings rather than `DateTime` because the existing UI compares strings and renders them raw, and storing as DateTime would invite timezone bugs. `tags` and `Package.features` use Postgres `String[]`. All vendor-owned tables cascade-delete from `Vendor`.

```prisma
model City {
  id        String   @id @default(cuid())
  name      String
  state     String
  slug      String   @unique
  vendors   Vendor[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Category {
  id            String        @id              // slug as id
  name          String
  emoji         String
  description   String
  vendors       Vendor[]
  subcategories Subcategory[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Subcategory {
  id         String   @id                      // e.g. "wedding-photography"
  name       String
  group      String?
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Vendor {
  id              String           @id @default(cuid())
  name            String
  description     String           @db.Text
  city            City             @relation(fields: [cityId], references: [id])
  cityId          String
  category        Category         @relation(fields: [categoryId], references: [id])
  categoryId      String
  rating          Float
  reviewCount     Int
  priceRange      String                       // raw label, e.g. "₹5-15 Lakh"
  yearsExperience Int
  verified        Boolean          @default(false)
  tags            String[]
  packages        Package[]
  portfolio       PortfolioImage[]
  reviews         Review[]
  bookedDates     BookedDate[]
  stats           VendorStats?
  enquiries       Enquiry[]
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  @@index([cityId, categoryId])
}

model Package {
  id        String   @id @default(cuid())
  vendor    Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorId  String
  tier      String                              // "basic" | "standard" | "premium"
  name      String
  price     Int
  features  String[]
  popular   Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([vendorId])
}

model PortfolioImage {
  id        String   @id
  vendor    Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorId  String
  url       String
  caption   String
  eventType String                              // haldi|mehendi|wedding|reception|engagement
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([vendorId])
}

model Review {
  id        String   @id
  vendor    Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorId  String
  author    String
  rating    Int
  date      String                              // ISO YYYY-MM-DD
  title     String
  body      String   @db.Text
  eventType String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([vendorId])
}

model BookedDate {
  vendor    Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorId  String
  date      String                              // ISO YYYY-MM-DD
  createdAt DateTime @default(now())
  @@id([vendorId, date])
}

model VendorStats {
  vendor             Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorId           String   @id
  weddingsCompleted  Int
  customersServed    Int
  responseTime       String                     // "Usually within 2 hours"
  yearsExperience    Int
  updatedAt          DateTime @updatedAt
}

enum EnquiryStatus {
  new
  contacted
  closed
}

model Enquiry {
  id           String        @id @default(cuid())
  vendor       Vendor        @relation(fields: [vendorId], references: [id])
  vendorId     String
  name         String
  phone        String                            // 10-digit Indian, validated by Zod
  eventDate    String                            // ISO YYYY-MM-DD
  eventType    String
  requirements String        @db.Text
  status       EnquiryStatus @default(new)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  @@index([vendorId, createdAt])
}
```

## File Changes

```
prisma/
├── schema.prisma                          # NEW
├── migrations/                            # NEW (Prisma-managed)
└── seed.ts                                # NEW — reads src/data/*.ts, upserts via Prisma

src/
├── lib/
│   ├── db.ts                              # NEW — singleton PrismaClient
│   └── queries/
│       ├── vendors.ts                     # NEW — getVendorsForListing, getVendorProfile, getVendorsByIds, getCategoryVendorCounts
│       └── enquiries.ts                   # NEW — createEnquiry
├── types/
│   └── vendor.ts                          # NEW — re-exports Prisma types as the UI's Vendor/Package/etc.
├── app/
│   ├── vendors/page.tsx                   # MODIFY — use queries
│   ├── vendors/[city]/[category]/page.tsx # MODIFY — use queries
│   ├── vendors/[id]/page.tsx              # MODIFY — use queries
│   ├── vendors/error.tsx                  # NEW — minimal error boundary
│   ├── compare/page.tsx                   # MODIFY — read ids from cookie or searchParam → fetch via query → pass vendors prop
│   └── api/enquiries/route.ts             # MODIFY — db.enquiry.create
├── components/compare/
│   ├── CompareTray.tsx                    # MODIFY — read previews from CompareContext, no sampleVendors import
│   └── ComparisonTable.tsx                # MODIFY — accept vendors prop instead of importing sampleVendors
├── context/
│   └── CompareContext.tsx                 # MODIFY — store {id, name, slug?} previews not just ids
├── hooks/
│   └── useVendorFilters.ts                # MODIFY — Vendor type alias updated; no behavior change

src/data/                                  # DELETE entire directory after seed runs once
src/data/*.test.ts                         # DELETE — replaced by integration tests against the DB

.env.example                               # NEW — DATABASE_URL keys
docker-compose.yml                         # NEW — local Postgres for integration tests
vercel.ts                                  # NEW — typed project config
vitest.integration.config.ts               # NEW — separate config for DB tests
package.json                               # MODIFY — add prisma deps + test:int script
README.md                                  # MODIFY — DB setup, migrate, seed instructions
```

## Data Flow

**Reads (server components):**

| Page | Before | After |
|---|---|---|
| `/vendors` | imports mock `categories`, `cities`, `sampleVendors` | `getCategoryVendorCounts()`, `db.city.findMany`, `db.category.findMany` |
| `/vendors/[city]/[category]` | filters `sampleVendors` by city name + category id | resolves slug → `City.id` via `db.city.findUnique({ where: { slug }})`, then `getVendorsForListing({ cityId, categoryId })`. The route param `city` is the city slug; `category` matches `Category.id` directly. |
| `/vendors/[id]` | reads 5 mock maps by id | `getVendorProfile(id)` — single query with nested includes |
| `/compare` | client component reads `sampleVendors` | server component reads ids from URL `?ids=v1,v2,v3` → `getVendorsByIds(ids)` → passes to `<ComparisonTable vendors={...} />`. `CompareTray.tsx` updated so the "Compare →" link emits `/compare?ids=${ids.join(",")}`. |

The `applyFilters` function in `useVendorFilters.ts` is unchanged — it already operates on whatever `Vendor[]` the server passed in.

**Writes:**

`POST /api/enquiries` keeps Zod validation, replaces the stub body with `createEnquiry(parsed.data)` which calls `db.enquiry.create`. Returns `{ ok: true, id }` on success, `{ ok: false, error }` with appropriate status on failure. The client `useEnquiry` hook is unchanged.

**Compare flow change:**

Today, `CompareTray` imports `sampleVendors` to map ids → names for display. After this slice, `sampleVendors` won't exist. The fix: when a user clicks "+ Compare" on a row card, the surrounding component already has the full vendor object — `CompareContext.add` is widened to accept `{id, name}` (a "preview"), stored in localStorage as before. `CompareTray` renders previews directly without any DB roundtrip. The `/compare` page receives `?ids=v1,v2,v3` in the URL, server-fetches the full rows via `getVendorsByIds`, and renders the table.

## Deployment & Migrations

**Provisioning:**
- Add Vercel Postgres (Neon) integration via the Vercel dashboard.
- Vercel auto-injects `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` into project env. `schema.prisma` reads `POSTGRES_PRISMA_URL` (pooled, runtime) and `POSTGRES_URL_NON_POOLING` (direct, migrations).
- Local: `vercel env pull .env.local` to sync. `.env.example` checked in showing required keys.

**Migration workflow:**
- Local: `pnpm prisma migrate dev --name <change>` after every schema edit.
- Production: `prisma migrate deploy` runs as part of the Vercel build command.
- Build command (set in `vercel.ts`): `pnpm prisma generate && pnpm prisma migrate deploy && pnpm next build`.

**Seed:**
- `prisma/seed.ts` imports the existing `src/data/*.ts` files, uses `prisma.*.upsert` for idempotency, inserts everything in dependency order: City → Category → Subcategory → Vendor → Package, PortfolioImage, Review, BookedDate, VendorStats.
- **Preserves existing string ids** (`v1`, `v2`, ...) by passing them explicitly to `upsert`; Prisma's `@default(cuid())` only fires when an id is omitted. This keeps the existing E2E test (`/vendors/v5`) and any hardcoded references valid.
- Run **once** after first production deploy: `pnpm prisma db seed`.
- Not part of every build (would attempt re-insert; upsert makes this safe but wasteful).
- Documented in README.

**Branch databases:** Neon supports zero-config branch DBs per Vercel preview deploy. Each PR gets an isolated DB; schema migrations apply automatically on the preview's build. Free from the integration.

**Connection limits:** Vercel Hobby tier allows 60 concurrent connections per Postgres. Pooled `POSTGRES_PRISMA_URL` + singleton client is sufficient. No PgBouncer config needed for this slice.

## Error Handling

- **DB connection failure on read pages:** Server component throws → Next 16 catches → renders `error.tsx`. Add `src/app/vendors/error.tsx` with "Couldn't load vendors right now" + retry link.
- **Vendor not found:** Prisma `findUnique` returns `null` → page calls `notFound()` → existing `src/app/vendors/not-found.tsx` renders.
- **Enquiry insert failure:** `/api/enquiries` catches `db.enquiry.create` rejection, returns 500 `{ ok: false, error: "Database error" }`. Existing `useEnquiry` hook handles `!res.ok` → status="error".
- **Enquiry foreign-key violation (unknown vendorId):** caught as a Prisma `P2003` error → returns 400 `{ ok: false, error: "Vendor not found" }`. Vendor existence is part of input validation.
- **No retries, no circuit breakers, no request-level caching.** YAGNI for this slice.

## Testing Strategy

| Layer | Tool | Coverage |
|---|---|---|
| Schema | `prisma migrate dev` | Migrations apply cleanly to a fresh DB |
| Seed | Vitest integration | Expected vendor/category/city counts after `seed.ts` |
| Queries | Vitest integration | `getVendorsForListing`, `getVendorProfile` (nested shape), `getVendorsByIds`, `getCategoryVendorCounts`, `createEnquiry` |
| API route | Vitest integration | POST /api/enquiries: valid → 201 + row, invalid Zod → 400, unknown vendorId → 400, DB down → 500 |
| Client components | Vitest unit (existing) | Unchanged — prop fixtures, no DB |
| E2E | Playwright (existing) | Unchanged — runs against deployed preview, exercises real DB |

**Integration test infra:**
- Local Docker Postgres on a non-default port (`5433`), `docker-compose up -d` boots it.
- `vitest.integration.config.ts` separate from `vitest.config.ts`. `pnpm test` stays fast (unit only); `pnpm test:int` runs DB tests.
- Each integration test wraps in a transaction, rolls back on completion. No teardown.

**Existing mock-data tests** (`portfolio.test.ts`, `availability.test.ts`, `packages.test.ts`, `reviews.test.ts`, `stats.test.ts`) are deleted with the mock files — they tested deterministic-hash behavior that won't exist anymore.

## Out of Scope (later slices)

- Authentication (phone OTP login)
- Vendor self-serve dashboard (edit profile, manage portfolio, view leads)
- Admin panel (vendor approval, featured vendors, analytics)
- Search engine (Meilisearch / pg_trgm full-text)
- Booking + payment integration
- Real email/SMS notifications on enquiry
- Map view, AI recommendations, chat, guest management
- CI test database (use Neon test branch when CI is set up)

## Deliverables

- Prisma schema + initial migration committed
- `prisma/seed.ts` populates DB from existing mock files; mock files then deleted
- Singleton `src/lib/db.ts`; query wrappers in `src/lib/queries/`
- Pages updated to use queries; client components decoupled from `sampleVendors`
- `/api/enquiries` persists to DB
- `vercel.ts` + Vercel Postgres provisioned + first production deploy live
- `docker-compose.yml` + integration test config + integration tests for queries & API
- README updated with DB setup, migrate, seed, and test:int commands
- 55+ existing unit/component tests still pass; new integration tests added

## Open Questions / Assumptions

- **Existing `useEnquiry` `localStorage` history:** keeps working unchanged — the client still stores submitted enquiries in `localStorage["shaadisetu.enquiries"]` for the user's "my enquiries" view. The DB row is the source of truth for the vendor side; localStorage is the user's own copy. No conflict.
- **Vendor `priceRange` as string:** preserved as-is. The sort comparator (`parseLow` in `useVendorFilters.ts`) parses "₹5-15 Lakh" labels at query time. A future slice may add numeric `priceMin`/`priceMax` columns for proper SQL filtering.
- **No CI database in this slice:** integration tests run locally via Docker. CI integration deferred until there is CI.
- **`Subcategory.id` global uniqueness:** the schema declares `id @id` (globally unique). Implementation must verify the existing mock-data subcategory ids are globally unique across categories before seed; if any collide, change to a composite `@@id([categoryId, id])` and update `Vendor.categoryId` consumers accordingly. No client code currently looks up subcategories by bare id, so this is low-risk.
