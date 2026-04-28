# Vendor Backend v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `src/data/*.ts` mocks and the console-log enquiry stub with a real Postgres backend (Prisma + Vercel/Neon), seeded from existing mock data, deployed on Vercel — without changing any visible UI behavior.

**Architecture:** Prisma ORM with a singleton `PrismaClient` at `src/lib/db.ts`. Server Components query Prisma directly via thin wrapper functions in `src/lib/queries/`. The write path (`POST /api/enquiries`) persists to the DB. A one-time `prisma/seed.ts` migrates mock data to the DB, then the mock files are deleted. Schema migrations run as part of the Vercel build command. Local integration tests run against a Docker Postgres on port 5433.

**Tech Stack:** Next.js 16.2.4 (App Router), React 19.2.4, TypeScript 5, Tailwind v4, Prisma 6, Vercel Postgres (Neon), Docker Compose for local DB, Vitest, @testing-library/react, Playwright, Zod.

**Spec:** `docs/superpowers/specs/2026-04-28-vendor-backend-v1-design.md`

---

## Task list

1. Prisma + Docker Postgres infra
2. Initial Prisma schema (City, Category, Subcategory, Vendor)
3. Prisma schema additions (Package, PortfolioImage, Review, BookedDate, VendorStats, Enquiry)
4. `src/lib/db.ts` singleton + `src/types/vendor.ts` re-exports
5. `prisma/seed.ts` — Cities + Categories + Subcategories
6. `prisma/seed.ts` — Vendors + Packages
7. `prisma/seed.ts` — Portfolio + Reviews + BookedDates + VendorStats
8. Integration test infra (`vitest.integration.config.ts` + `src/test/db-setup.ts`)
9. `getVendorsForListing` query + integration test
10. `getVendorProfile` query + integration test
11. `getVendorsByIds` + `getCategoryVendorCounts` queries + integration tests
12. `createEnquiry` query + integration test
13. Switch listing page to use queries
14. Switch profile page to use queries
15. Switch `/vendors` browse-all page to use queries
16. Switch `CompareContext` to store previews + update `CompareTray`
17. Switch `/compare` page to read `?ids=` and server-fetch
18. Switch `/api/enquiries` route to persist to DB
19. Add `src/app/vendors/error.tsx`
20. Delete `src/data/*.ts` mock files + their tests + update imports
21. Add `vercel.ts` + Vercel Postgres provisioning + first deploy
22. Run seed against production DB + smoke
23. README updates + final cleanup

---

### Task 1: Prisma + Docker Postgres infra

**Files:**
- Create: `docker-compose.yml`
- Create: `prisma/schema.prisma`
- Create: `.env.example`
- Modify: `package.json` (add deps + scripts)
- Modify: `.gitignore` (ignore `.env*`, prisma generated client output)

- [ ] **Step 1: Install deps**

```bash
cd ~/Desktop/shaadisetu
npm install -D prisma tsx
npm install @prisma/client
```

- [ ] **Step 2: Add scripts to `package.json`**

Edit the `"scripts"` block to include (in addition to existing):

```json
"db:up": "docker compose up -d",
"db:down": "docker compose down",
"db:migrate": "prisma migrate dev",
"db:generate": "prisma generate",
"db:seed": "prisma db seed",
"test:int": "vitest run --config vitest.integration.config.ts"
```

Add a `"prisma"` block at the top level:

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

- [ ] **Step 3: Create `docker-compose.yml`**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: shaadisetu-pg
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: shaadisetu
      POSTGRES_PASSWORD: shaadisetu
      POSTGRES_DB: shaadisetu
    volumes:
      - shaadisetu-pg-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U shaadisetu"]
      interval: 2s
      timeout: 5s
      retries: 10

volumes:
  shaadisetu-pg-data:
```

- [ ] **Step 4: Create `.env.example`**

```bash
# Vercel Postgres (Neon) — production
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# Local Docker Postgres — development + integration tests
DATABASE_URL=postgresql://shaadisetu:shaadisetu@localhost:5433/shaadisetu?schema=public
```

- [ ] **Step 5: Append to `.gitignore`**

```
# prisma generated client
src/generated/prisma/

# env
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

(Skip lines that are already present.)

- [ ] **Step 6: Create `.env.local`** (NOT committed)

```bash
echo 'DATABASE_URL=postgresql://shaadisetu:shaadisetu@localhost:5433/shaadisetu?schema=public' > .env.local
```

- [ ] **Step 7: Initialize Prisma**

```bash
npx prisma init --datasource-provider postgresql --output ../src/generated/prisma
```

This creates `prisma/schema.prisma` with a default datasource. We'll overwrite the schema in Task 2.

- [ ] **Step 8: Boot Postgres and verify**

```bash
npm run db:up
docker compose ps
# Wait for "healthy" status
```

Expected: container `shaadisetu-pg` listed as `healthy`.

- [ ] **Step 9: Commit**

```bash
git add docker-compose.yml prisma/schema.prisma .env.example .gitignore package.json package-lock.json
git commit -m "chore(db): add Prisma + Docker Postgres infrastructure"
```

---

### Task 2: Initial Prisma schema (City, Category, Subcategory, Vendor)

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Replace `prisma/schema.prisma` with**

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}

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
  id            String        @id
  name          String
  emoji         String
  description   String
  vendors       Vendor[]
  subcategories Subcategory[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Subcategory {
  id         String   @id
  name       String
  group      String?
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Vendor {
  id              String   @id
  name            String
  description     String
  cityId          String
  city            City     @relation(fields: [cityId], references: [id])
  categoryId      String
  category        Category @relation(fields: [categoryId], references: [id])
  rating          Float
  reviewCount     Int
  priceRange      String
  yearsExperience Int
  verified        Boolean  @default(false)
  tags            String[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([cityId, categoryId])
}
```

**Note on `POSTGRES_PRISMA_URL`:** locally, we set this via a one-line override in `.env.local` so Prisma's local dev uses the same Docker URL:

- [ ] **Step 2: Update `.env.local` to also set `POSTGRES_PRISMA_URL`**

```bash
cat > .env.local <<'EOF'
# Local Docker Postgres serves all three roles in dev
POSTGRES_PRISMA_URL=postgresql://shaadisetu:shaadisetu@localhost:5433/shaadisetu?schema=public
POSTGRES_URL_NON_POOLING=postgresql://shaadisetu:shaadisetu@localhost:5433/shaadisetu?schema=public
DATABASE_URL=postgresql://shaadisetu:shaadisetu@localhost:5433/shaadisetu?schema=public
EOF
```

- [ ] **Step 3: Run first migration**

```bash
npx prisma migrate dev --name init_core_tables
```

Expected: a directory `prisma/migrations/<timestamp>_init_core_tables/` created with `migration.sql`. Prisma client generated at `src/generated/prisma`.

- [ ] **Step 4: Verify**

```bash
npx prisma db pull --print 2>/dev/null | head -20
```

Expected output contains `model City`, `model Category`, `model Subcategory`, `model Vendor`.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(db): initial schema for City, Category, Subcategory, Vendor"
```

---

### Task 3: Schema additions (Package, PortfolioImage, Review, BookedDate, VendorStats, Enquiry)

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Append to `prisma/schema.prisma`**

```prisma
model Package {
  id        String   @id @default(cuid())
  vendor    Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorId  String
  tier      String
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
  eventType String
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
  date      String
  title     String
  body      String
  eventType String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([vendorId])
}

model BookedDate {
  vendor    Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorId  String
  date      String
  createdAt DateTime @default(now())

  @@id([vendorId, date])
}

model VendorStats {
  vendor            Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  vendorId          String   @id
  weddingsCompleted Int
  customersServed   Int
  responseTime      String
  yearsExperience   Int
  updatedAt         DateTime @updatedAt
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
  phone        String
  eventDate    String
  eventType    String
  requirements String
  status       EnquiryStatus @default(new)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@index([vendorId, createdAt])
}
```

Also update the existing `Vendor` model to add the back-relation fields. Replace the `Vendor` block with:

```prisma
model Vendor {
  id              String           @id
  name            String
  description     String
  cityId          String
  city            City             @relation(fields: [cityId], references: [id])
  categoryId      String
  category        Category         @relation(fields: [categoryId], references: [id])
  rating          Float
  reviewCount     Int
  priceRange      String
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
```

- [ ] **Step 2: Run migration**

```bash
npx prisma migrate dev --name add_packages_portfolio_reviews_bookings_stats_enquiries
```

Expected: new migration directory created and applied successfully.

- [ ] **Step 3: Sanity check via Prisma Studio (optional, visual)**

```bash
npx prisma studio --browser none &
# Visit http://localhost:5555 in a browser, confirm 10 empty tables
# kill %1
```

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(db): add Package, PortfolioImage, Review, BookedDate, VendorStats, Enquiry"
```

---

### Task 4: `src/lib/db.ts` singleton + `src/types/vendor.ts` re-exports

**Files:**
- Create: `src/lib/db.ts`
- Create: `src/types/vendor.ts`

- [ ] **Step 1: Create `src/lib/db.ts`**

```ts
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

The `globalForPrisma` pattern prevents Next.js dev-mode hot reload from spawning a new client on every request (which would exhaust connections).

- [ ] **Step 2: Create `src/types/vendor.ts`**

```ts
import type {
  Vendor as PrismaVendor,
  Package as PrismaPackage,
  PortfolioImage as PrismaPortfolioImage,
  Review as PrismaReview,
  VendorStats as PrismaVendorStats,
  City as PrismaCity,
  Category as PrismaCategory,
  Subcategory as PrismaSubcategory,
  Enquiry as PrismaEnquiry,
} from "@/generated/prisma";

export type Vendor = PrismaVendor;
export type Package = PrismaPackage;
export type PortfolioImage = PrismaPortfolioImage;
export type Review = PrismaReview;
export type VendorStats = PrismaVendorStats;
export type City = PrismaCity;
export type Category = PrismaCategory;
export type Subcategory = PrismaSubcategory;
export type Enquiry = PrismaEnquiry;

/** A Vendor with its full nested profile data. */
export type VendorWithProfile = PrismaVendor & {
  packages: PrismaPackage[];
  portfolio: PrismaPortfolioImage[];
  reviews: PrismaReview[];
  bookedDates: { date: string }[];
  stats: PrismaVendorStats | null;
};

/** A vendor preview stored client-side in CompareContext. */
export interface VendorPreview {
  id: string;
  name: string;
}
```

- [ ] **Step 3: Verify imports compile**

```bash
npx tsc --noEmit
```

Expected: no errors. (The Prisma client must already exist at `src/generated/prisma` from Task 2's `migrate dev`.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/db.ts src/types/vendor.ts
git commit -m "feat(db): add Prisma singleton + vendor type re-exports"
```

---

### Task 5: `prisma/seed.ts` — Cities + Categories + Subcategories

**Files:**
- Create: `prisma/seed.ts`

- [ ] **Step 1: Create `prisma/seed.ts`**

```ts
import { PrismaClient } from "../src/generated/prisma";
import { cities } from "../src/data/cities";
import { categories } from "../src/data/categories";
import { sampleVendors } from "../src/data/vendors";
import { packagesByVendor } from "../src/data/packages";
import { portfolioByVendor } from "../src/data/portfolio";
import { reviewsByVendor } from "../src/data/reviews";
import { bookedDatesByVendor } from "../src/data/availability";
import { statsByVendor } from "../src/data/stats";
import { cityToSlug } from "../src/lib/slugs";

const prisma = new PrismaClient();

async function seedCities() {
  console.log(`[seed] cities: ${cities.length}`);
  for (const c of cities) {
    const slug = cityToSlug(c);
    await prisma.city.upsert({
      where: { slug },
      update: { name: c.name, state: c.state },
      create: { slug, name: c.name, state: c.state },
    });
  }
}

async function seedCategories() {
  console.log(`[seed] categories: ${categories.length}`);
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        emoji: cat.emoji,
        description: cat.description,
      },
      create: {
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji,
        description: cat.description,
      },
    });
    for (const sub of cat.subcategories) {
      await prisma.subcategory.upsert({
        where: { id: sub.id },
        update: { name: sub.name, group: sub.group ?? null, categoryId: cat.id },
        create: { id: sub.id, name: sub.name, group: sub.group ?? null, categoryId: cat.id },
      });
    }
  }
}

async function main() {
  await seedCities();
  await seedCategories();
  console.log("[seed] core taxonomy done");
}

main()
  .catch((e) => {
    console.error("[seed] failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

This is the partial seed for now — Tasks 6 and 7 will extend `main()` to seed vendors and their nested data.

- [ ] **Step 2: Run seed**

```bash
npm run db:seed
```

Expected output (counts will match your data):

```
[seed] cities: ~450
[seed] categories: 18
[seed] core taxonomy done
```

- [ ] **Step 3: Verify**

```bash
npx prisma studio --browser none &
# Open http://localhost:5555, confirm City has ~450 rows, Category has 18, Subcategory > 100
# kill %1
```

Or via SQL:

```bash
docker exec -i shaadisetu-pg psql -U shaadisetu -d shaadisetu -c \
  'SELECT (SELECT COUNT(*) FROM "City") AS cities, (SELECT COUNT(*) FROM "Category") AS categories, (SELECT COUNT(*) FROM "Subcategory") AS subcategories;'
```

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat(db): seed cities, categories, subcategories from mocks"
```

---

### Task 6: `prisma/seed.ts` — Vendors + Packages

**Files:**
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Add `seedVendors` and `seedPackages` functions**

Insert these two functions in `prisma/seed.ts` between `seedCategories` and `main`:

```ts
async function seedVendors() {
  console.log(`[seed] vendors: ${sampleVendors.length}`);
  for (const v of sampleVendors) {
    // Map mock City.name -> seeded City.id via slug.
    const cityRow = await prisma.city.findFirst({
      where: { name: v.city, state: v.state },
    });
    if (!cityRow) {
      console.warn(`[seed] skip vendor ${v.id}: city not found (${v.city}, ${v.state})`);
      continue;
    }
    await prisma.vendor.upsert({
      where: { id: v.id },
      update: {
        name: v.name,
        description: v.description,
        cityId: cityRow.id,
        categoryId: v.categoryId,
        rating: v.rating,
        reviewCount: v.reviewCount,
        priceRange: v.priceRange,
        yearsExperience: v.yearsExperience,
        verified: v.verified,
        tags: v.tags,
      },
      create: {
        id: v.id,
        name: v.name,
        description: v.description,
        cityId: cityRow.id,
        categoryId: v.categoryId,
        rating: v.rating,
        reviewCount: v.reviewCount,
        priceRange: v.priceRange,
        yearsExperience: v.yearsExperience,
        verified: v.verified,
        tags: v.tags,
      },
    });
  }
}

async function seedPackages() {
  let total = 0;
  for (const vendorId of Object.keys(packagesByVendor)) {
    const pkgs = packagesByVendor[vendorId];
    // Wipe existing packages for this vendor to keep tier ordering deterministic.
    await prisma.package.deleteMany({ where: { vendorId } });
    for (const p of pkgs) {
      await prisma.package.create({
        data: {
          vendorId,
          tier: p.tier,
          name: p.name,
          price: p.price,
          features: p.features,
          popular: p.popular ?? false,
        },
      });
      total++;
    }
  }
  console.log(`[seed] packages: ${total}`);
}
```

Then update `main` to call them:

```ts
async function main() {
  await seedCities();
  await seedCategories();
  await seedVendors();
  await seedPackages();
  console.log("[seed] vendors + packages done");
}
```

- [ ] **Step 2: Run seed**

```bash
npm run db:seed
```

Expected:

```
[seed] cities: ~450
[seed] categories: 18
[seed] vendors: 90
[seed] packages: 270
[seed] vendors + packages done
```

- [ ] **Step 3: Sanity check**

```bash
docker exec -i shaadisetu-pg psql -U shaadisetu -d shaadisetu -c \
  'SELECT (SELECT COUNT(*) FROM "Vendor") AS vendors, (SELECT COUNT(*) FROM "Package") AS packages;'
```

Expected: `vendors=90, packages=270` (3 packages per vendor).

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat(db): seed vendors and packages"
```

---

### Task 7: `prisma/seed.ts` — Portfolio + Reviews + BookedDates + VendorStats

**Files:**
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Add four more seed functions**

Insert into `prisma/seed.ts` after `seedPackages`:

```ts
async function seedPortfolio() {
  let total = 0;
  for (const vendorId of Object.keys(portfolioByVendor)) {
    const imgs = portfolioByVendor[vendorId];
    await prisma.portfolioImage.deleteMany({ where: { vendorId } });
    for (const img of imgs) {
      await prisma.portfolioImage.create({
        data: {
          id: img.id,
          vendorId,
          url: img.url,
          caption: img.caption,
          eventType: img.eventType,
        },
      });
      total++;
    }
  }
  console.log(`[seed] portfolio images: ${total}`);
}

async function seedReviews() {
  let total = 0;
  for (const vendorId of Object.keys(reviewsByVendor)) {
    const reviews = reviewsByVendor[vendorId];
    await prisma.review.deleteMany({ where: { vendorId } });
    for (const r of reviews) {
      await prisma.review.create({
        data: {
          id: r.id,
          vendorId,
          author: r.author,
          rating: r.rating,
          date: r.date,
          title: r.title,
          body: r.body,
          eventType: r.eventType,
        },
      });
      total++;
    }
  }
  console.log(`[seed] reviews: ${total}`);
}

async function seedBookedDates() {
  let total = 0;
  for (const vendorId of Object.keys(bookedDatesByVendor)) {
    const dates = bookedDatesByVendor[vendorId];
    await prisma.bookedDate.deleteMany({ where: { vendorId } });
    for (const date of dates) {
      await prisma.bookedDate.create({
        data: { vendorId, date },
      });
      total++;
    }
  }
  console.log(`[seed] booked dates: ${total}`);
}

async function seedVendorStats() {
  let total = 0;
  for (const vendorId of Object.keys(statsByVendor)) {
    const s = statsByVendor[vendorId];
    await prisma.vendorStats.upsert({
      where: { vendorId },
      update: {
        weddingsCompleted: s.weddingsCompleted,
        customersServed: s.customersServed,
        responseTime: s.responseTime,
        yearsExperience: s.yearsExperience,
      },
      create: {
        vendorId,
        weddingsCompleted: s.weddingsCompleted,
        customersServed: s.customersServed,
        responseTime: s.responseTime,
        yearsExperience: s.yearsExperience,
      },
    });
    total++;
  }
  console.log(`[seed] vendor stats: ${total}`);
}
```

Update `main`:

```ts
async function main() {
  await seedCities();
  await seedCategories();
  await seedVendors();
  await seedPackages();
  await seedPortfolio();
  await seedReviews();
  await seedBookedDates();
  await seedVendorStats();
  console.log("[seed] complete");
}
```

- [ ] **Step 2: Run seed**

```bash
npm run db:seed
```

Expected: counts logged for each table; final `[seed] complete`.

- [ ] **Step 3: Verify all tables populated**

```bash
docker exec -i shaadisetu-pg psql -U shaadisetu -d shaadisetu -c \
  'SELECT
     (SELECT COUNT(*) FROM "Vendor") AS vendors,
     (SELECT COUNT(*) FROM "Package") AS packages,
     (SELECT COUNT(*) FROM "PortfolioImage") AS portfolio,
     (SELECT COUNT(*) FROM "Review") AS reviews,
     (SELECT COUNT(*) FROM "BookedDate") AS booked,
     (SELECT COUNT(*) FROM "VendorStats") AS stats;'
```

Expected: vendors=90, packages=270, portfolio>=450, reviews>=450, booked>0, stats=90.

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat(db): seed portfolio, reviews, booked dates, and vendor stats"
```

---

### Task 8: Integration test infra

**Files:**
- Create: `vitest.integration.config.ts`
- Create: `src/test/db-setup.ts`

- [ ] **Step 1: Create `vitest.integration.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./src/test/db-setup.ts"],
    include: ["src/**/*.int.test.ts"],
    pool: "forks",
    poolOptions: { forks: { singleFork: true } },
    testTimeout: 20000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

`singleFork: true` means tests run sequentially in one process — required because Prisma's interactive transactions don't isolate cleanly across parallel workers without per-worker DBs.

- [ ] **Step 2: Create `src/test/db-setup.ts`**

```ts
import { beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";

beforeAll(async () => {
  if (!process.env.POSTGRES_PRISMA_URL?.includes("localhost:5433")) {
    throw new Error(
      "Refusing to run integration tests without a localhost:5433 DATABASE_URL. " +
      "Run `npm run db:up` and ensure .env.local points at the Docker DB.",
    );
  }
  await db.$connect();
});

afterAll(async () => {
  await db.$disconnect();
});
```

The localhost guard prevents accidental destructive runs against a production DB.

- [ ] **Step 3: Smoke-test the harness**

Create a temporary `src/test/harness.int.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { db } from "@/lib/db";

describe("integration harness", () => {
  it("connects to the local DB", async () => {
    const cities = await db.city.count();
    expect(cities).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 4: Run**

```bash
npm run test:int
```

Expected: 1/1 pass.

- [ ] **Step 5: Delete the smoke test**

```bash
rm src/test/harness.int.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add vitest.integration.config.ts src/test/db-setup.ts package.json
git commit -m "test(db): add vitest integration config + DB setup"
```

---

### Task 9: `getVendorsForListing` query + integration test

**Files:**
- Create: `src/lib/queries/vendors.ts`
- Create: `src/lib/queries/vendors.int.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/queries/vendors.int.test.ts
import { describe, it, expect } from "vitest";
import { db } from "@/lib/db";
import { getVendorsForListing } from "./vendors";

describe("getVendorsForListing", () => {
  it("returns vendors for a city + category", async () => {
    const mumbai = await db.city.findFirst({ where: { name: "Mumbai" } });
    expect(mumbai).not.toBeNull();
    const out = await getVendorsForListing({
      cityId: mumbai!.id,
      categoryId: "photography",
    });
    expect(out.length).toBeGreaterThan(0);
    for (const v of out) {
      expect(v.cityId).toBe(mumbai!.id);
      expect(v.categoryId).toBe("photography");
    }
  });

  it("returns [] when city has no vendors in that category", async () => {
    const tirupati = await db.city.findFirst({ where: { name: "Tirupati" } });
    expect(tirupati).not.toBeNull();
    const out = await getVendorsForListing({
      cityId: tirupati!.id,
      categoryId: "photography",
    });
    expect(out).toEqual([]);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm run test:int -- src/lib/queries/vendors.int.test.ts
```

Expected: import error (`./vendors` not found).

- [ ] **Step 3: Create `src/lib/queries/vendors.ts`**

```ts
import { db } from "@/lib/db";
import type { Vendor } from "@/types/vendor";

export async function getVendorsForListing(params: {
  cityId: string;
  categoryId: string;
}): Promise<Vendor[]> {
  return db.vendor.findMany({
    where: { cityId: params.cityId, categoryId: params.categoryId },
    orderBy: { reviewCount: "desc" },
  });
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm run test:int -- src/lib/queries/vendors.int.test.ts
```

Expected: 2/2 pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/queries/vendors.ts src/lib/queries/vendors.int.test.ts
git commit -m "feat(queries): add getVendorsForListing"
```

---

### Task 10: `getVendorProfile` query + integration test

**Files:**
- Modify: `src/lib/queries/vendors.ts`
- Modify: `src/lib/queries/vendors.int.test.ts`

- [ ] **Step 1: Append a failing test**

Append to `src/lib/queries/vendors.int.test.ts`:

```ts
import { getVendorProfile } from "./vendors";

describe("getVendorProfile", () => {
  it("returns the vendor with packages, portfolio, reviews, bookedDates, stats", async () => {
    const v = await getVendorProfile("v5");
    expect(v).not.toBeNull();
    expect(v!.id).toBe("v5");
    expect(v!.packages.length).toBeGreaterThanOrEqual(1);
    expect(v!.portfolio.length).toBeGreaterThanOrEqual(1);
    expect(v!.reviews.length).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(v!.bookedDates)).toBe(true);
    // stats may be null if not seeded for this id, but for v5 it should exist
    expect(v!.stats).not.toBeNull();
  });

  it("returns null for an unknown id", async () => {
    const v = await getVendorProfile("nonexistent-id");
    expect(v).toBeNull();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm run test:int -- src/lib/queries/vendors.int.test.ts
```

Expected: 2 new failures (`getVendorProfile is not a function`).

- [ ] **Step 3: Append `getVendorProfile` to `src/lib/queries/vendors.ts`**

```ts
import type { VendorWithProfile } from "@/types/vendor";

export async function getVendorProfile(id: string): Promise<VendorWithProfile | null> {
  return db.vendor.findUnique({
    where: { id },
    include: {
      packages: { orderBy: { price: "asc" } },
      portfolio: true,
      reviews: { orderBy: { date: "desc" } },
      bookedDates: { select: { date: true } },
      stats: true,
    },
  });
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm run test:int -- src/lib/queries/vendors.int.test.ts
```

Expected: 4/4 pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/queries/vendors.ts src/lib/queries/vendors.int.test.ts
git commit -m "feat(queries): add getVendorProfile with nested includes"
```

---

### Task 11: `getVendorsByIds` + `getCategoryVendorCounts` queries + tests

**Files:**
- Modify: `src/lib/queries/vendors.ts`
- Modify: `src/lib/queries/vendors.int.test.ts`

- [ ] **Step 1: Append failing tests**

Append to `src/lib/queries/vendors.int.test.ts`:

```ts
import { getVendorsByIds, getCategoryVendorCounts } from "./vendors";

describe("getVendorsByIds", () => {
  it("returns vendors in the order requested", async () => {
    const out = await getVendorsByIds(["v5", "v1"]);
    expect(out.map((v) => v.id)).toEqual(["v5", "v1"]);
  });

  it("ignores ids that don't exist", async () => {
    const out = await getVendorsByIds(["v5", "missing"]);
    expect(out.length).toBe(1);
    expect(out[0].id).toBe("v5");
  });

  it("returns [] for empty input", async () => {
    const out = await getVendorsByIds([]);
    expect(out).toEqual([]);
  });
});

describe("getCategoryVendorCounts", () => {
  it("returns a count for every category", async () => {
    const counts = await getCategoryVendorCounts();
    expect(counts.photography).toBeGreaterThan(0);
    expect(counts.venues).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm run test:int -- src/lib/queries/vendors.int.test.ts
```

Expected: 4 new failures.

- [ ] **Step 3: Append the queries to `src/lib/queries/vendors.ts`**

```ts
export async function getVendorsByIds(ids: string[]): Promise<Vendor[]> {
  if (ids.length === 0) return [];
  const rows = await db.vendor.findMany({ where: { id: { in: ids } } });
  // Preserve caller-supplied order.
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id)).filter((v): v is Vendor => Boolean(v));
}

export async function getCategoryVendorCounts(): Promise<Record<string, number>> {
  const grouped = await db.vendor.groupBy({
    by: ["categoryId"],
    _count: { _all: true },
  });
  const out: Record<string, number> = {};
  for (const g of grouped) out[g.categoryId] = g._count._all;
  return out;
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm run test:int -- src/lib/queries/vendors.int.test.ts
```

Expected: 8/8 pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/queries/vendors.ts src/lib/queries/vendors.int.test.ts
git commit -m "feat(queries): add getVendorsByIds + getCategoryVendorCounts"
```

---

### Task 12: `createEnquiry` query + integration test

**Files:**
- Create: `src/lib/queries/enquiries.ts`
- Create: `src/lib/queries/enquiries.int.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/queries/enquiries.int.test.ts
import { describe, it, expect, afterAll } from "vitest";
import { db } from "@/lib/db";
import { createEnquiry } from "./enquiries";

describe("createEnquiry", () => {
  const created: string[] = [];
  afterAll(async () => {
    if (created.length) await db.enquiry.deleteMany({ where: { id: { in: created } } });
  });

  it("inserts a row and returns the id", async () => {
    const out = await createEnquiry({
      vendorId: "v5",
      name: "Priya",
      phone: "9876543210",
      eventDate: "2099-12-31",
      eventType: "wedding",
      requirements: "Need cinematic photography for our 2-day wedding.",
    });
    expect(typeof out.id).toBe("string");
    created.push(out.id);

    const row = await db.enquiry.findUnique({ where: { id: out.id } });
    expect(row).not.toBeNull();
    expect(row!.name).toBe("Priya");
    expect(row!.status).toBe("new");
  });

  it("rejects unknown vendorId with FK error", async () => {
    await expect(
      createEnquiry({
        vendorId: "vendor-does-not-exist",
        name: "X",
        phone: "9876543210",
        eventDate: "2099-12-31",
        eventType: "wedding",
        requirements: "x",
      }),
    ).rejects.toThrow();
  });
});
```

We delete created rows in `afterAll` rather than using a transaction wrapper because Prisma's `create` doesn't share the test's transaction in a clean way; explicit cleanup is simpler and equally reliable.

- [ ] **Step 2: Run — expect FAIL**

```bash
npm run test:int -- src/lib/queries/enquiries.int.test.ts
```

Expected: import error.

- [ ] **Step 3: Create `src/lib/queries/enquiries.ts`**

```ts
import { db } from "@/lib/db";

export interface CreateEnquiryInput {
  vendorId: string;
  name: string;
  phone: string;
  eventDate: string;
  eventType: string;
  requirements: string;
}

export async function createEnquiry(input: CreateEnquiryInput): Promise<{ id: string }> {
  const row = await db.enquiry.create({
    data: {
      vendorId: input.vendorId,
      name: input.name,
      phone: input.phone,
      eventDate: input.eventDate,
      eventType: input.eventType,
      requirements: input.requirements,
    },
    select: { id: true },
  });
  return { id: row.id };
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm run test:int -- src/lib/queries/enquiries.int.test.ts
```

Expected: 2/2 pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/queries/enquiries.ts src/lib/queries/enquiries.int.test.ts
git commit -m "feat(queries): add createEnquiry"
```

---

### Task 13: Switch listing page to use queries

**Files:**
- Modify: `src/app/vendors/[city]/[category]/page.tsx`

- [ ] **Step 1: Replace contents with**

```tsx
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getVendorsForListing } from "@/lib/queries/vendors";
import { VendorListingFilters } from "@/components/vendor/VendorListingFilters";
import { VendorListingResults } from "@/components/vendor/VendorListingResults";

interface Params {
  city: string;
  category: string;
}

export default async function VendorListing({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city, category } = await params;
  const cityRow = await db.city.findUnique({ where: { slug: city } });
  const categoryRow = await db.category.findUnique({ where: { id: category } });
  if (!cityRow || !categoryRow) notFound();

  const vendors = await getVendorsForListing({
    cityId: cityRow.id,
    categoryId: categoryRow.id,
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <header className="mb-3">
        <h1 className="text-2xl font-semibold text-slate-900">
          {categoryRow.name} in {cityRow.name}
        </h1>
        <p className="text-sm text-slate-600">{vendors.length} vendors</p>
      </header>

      <VendorListingFilters cityName={cityRow.name} categoryName={categoryRow.name} />
      <VendorListingResults vendors={vendors} />
    </main>
  );
}
```

The route param `city` is the city slug (matching `City.slug`); `category` is the slug-as-id (matching `Category.id`).

- [ ] **Step 2: Update `VendorListingResults` to accept the new `Vendor` type**

The component already takes `vendors: Vendor[]`; the type alias just needs to point at Prisma. Edit `src/components/vendor/VendorListingResults.tsx`:

Change the import `import type { Vendor } from "@/data/vendors"` to `import type { Vendor } from "@/types/vendor"`.

- [ ] **Step 3: Update `VendorRowCard` import too**

In `src/components/vendor/VendorRowCard.tsx`:

Change `import type { Vendor } from "@/data/vendors"` to `import type { Vendor } from "@/types/vendor"`.

Also: replace the `import { isBooked } from "@/data/availability"` with a local stub that the page will pass via props. Specifically, change the file's behavior:

The mock `isBooked` won't exist after Task 20. Today the listing passes `filterDate` and the card calls `isBooked(vendor.id, filterDate)`. The DB has the booked dates per vendor, but the listing doesn't include them in the row query (would balloon payload). For Slice B v1, we keep the `Available` text always on listings — booked-state on listings is a UX nicety, not a correctness requirement. The profile-page calendar (Task 14) shows the full booked dates.

Edit `src/components/vendor/VendorRowCard.tsx`. Remove the `import { isBooked } from "@/data/availability"` line. Change the `booked` line to:

```tsx
const booked = false; // listing does not surface booked state in Slice B; use profile calendar
```

(The component already supports the always-`false` case; the badge will read "Available" for everyone.)

- [ ] **Step 4: Run typecheck and unit tests**

```bash
npx tsc --noEmit
npm run test
```

Expected: tsc clean. Vitest may fail on `VendorRowCard.test.tsx` if the test imports `sampleVendors[0]` — that's still present, so should pass. The "Available" assertion still holds. Expect 55/55 still pass.

- [ ] **Step 5: Smoke test with dev server**

```bash
npm run db:up
npm run db:seed   # if not already seeded
npm run dev
# Visit http://localhost:3000/vendors/mumbai/photography — should render listing with rows
```

- [ ] **Step 6: Commit**

```bash
git add src/app/vendors/\[city\]/\[category\]/page.tsx \
        src/components/vendor/VendorListingResults.tsx \
        src/components/vendor/VendorRowCard.tsx
git commit -m "feat(listing): switch listing page + row card to DB"
```

---

### Task 14: Switch profile page to use queries

**Files:**
- Modify: `src/app/vendors/v/[id]/page.tsx`

- [ ] **Step 1: Replace contents with**

```tsx
import { notFound } from "next/navigation";
import { getVendorProfile } from "@/lib/queries/vendors";
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
  const vendor = await getVendorProfile(id);
  if (!vendor) notFound();

  const bookedDates = vendor.bookedDates.map((b) => b.date);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <div className="space-y-8 min-w-0">
        <VendorProfileHero vendor={vendor} stats={vendor.stats} />
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">About</h2>
          <p className="text-slate-700">{vendor.description}</p>
        </section>
        <VendorPortfolio images={vendor.portfolio} />
        <VendorServicesList vendor={vendor} />
        <VendorPackages packages={vendor.packages} />
        <VendorAvailabilityCalendar bookedDates={bookedDates} />
        <VendorReviews reviews={vendor.reviews} />
      </div>
      <VendorEnquiryRail vendor={vendor} />
    </main>
  );
}
```

- [ ] **Step 2: Update `VendorProfileHero` to receive stats as a prop**

Edit `src/components/vendor/VendorProfileHero.tsx`. Replace contents:

```tsx
import type { Vendor, VendorStats } from "@/types/vendor";

export function VendorProfileHero({
  vendor,
  stats,
}: {
  vendor: Vendor;
  stats: VendorStats | null;
}) {
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
            ⭐ {vendor.rating} ({vendor.reviewCount}) ·{" "}
            <CityLabel cityId={vendor.cityId} /> · {vendor.yearsExperience} yrs
          </p>
        </div>
      </div>
      {stats && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Stat label="Weddings" value={stats.weddingsCompleted.toLocaleString()} />
          <Stat label="Customers" value={stats.customersServed.toLocaleString()} />
          <Stat label="Response" value={stats.responseTime} />
        </div>
      )}
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

// We don't have city.name on this prop. Render a small server component that fetches it.
import { db } from "@/lib/db";
async function CityLabel({ cityId }: { cityId: string }) {
  const c = await db.city.findUnique({ where: { id: cityId }, select: { name: true } });
  return <>{c?.name ?? ""}</>;
}
```

Wait — `VendorProfileHero` is currently rendered inside an async server component, so `CityLabel` works. But the file isn't marked as a server component module. Confirm: `VendorProfileHero` has no `"use client"` directive — keep it that way.

- [ ] **Step 3: Update `VendorServicesList` import path**

Edit `src/components/vendor/VendorServicesList.tsx`. Change `import { findCategoryBySlug } from "@/lib/slugs"` to use the DB:

```tsx
import { db } from "@/lib/db";
import type { Vendor } from "@/types/vendor";

export async function VendorServicesList({ vendor }: { vendor: Vendor }) {
  const subs = await db.subcategory.findMany({
    where: { categoryId: vendor.categoryId },
    orderBy: { name: "asc" },
  });

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Services Offered</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
        {subs.map((s) => (
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

- [ ] **Step 4: Update `VendorEnquiryRail` to use Prisma's `Vendor` type**

Edit `src/components/vendor/VendorEnquiryRail.tsx`. Change `import type { Vendor } from "@/data/vendors"` to `import type { Vendor } from "@/types/vendor"`. Also remove `import { isBooked } from "@/data/availability"`. Replace `dateBookedWarning` derivation with a prop-driven version: the rail currently calls `isBooked(vendor.id, form.eventDate)`. Replace that line with:

```tsx
const dateBookedWarning = false; // booked-state warning will be re-introduced when listing exposes it
```

(Keeping the warning UI dormant for Slice B; Slice C will re-introduce it via the calendar's bookedDates prop.)

- [ ] **Step 5: Update `VendorPackages`, `VendorReviews`, `VendorPortfolio`, `VendorAvailabilityCalendar` type imports**

For each of those four files, replace `import type { Package } from "@/data/packages"` (etc.) with the corresponding `@/types/vendor` import. The shapes match.

Specifically:
- `VendorPackages.tsx`: `import type { Package } from "@/types/vendor";`
- `VendorReviews.tsx`: `import type { Review } from "@/types/vendor";`
- `VendorPortfolio.tsx`: `import type { PortfolioImage } from "@/types/vendor";`
- `VendorAvailabilityCalendar.tsx` already takes `bookedDates: string[]` — no type-import change.

- [ ] **Step 6: Run**

```bash
npx tsc --noEmit
npm run test
npm run dev
# Visit http://localhost:3000/vendors/v/v5
```

Expected: tsc clean, 55/55 vitest pass, profile renders.

- [ ] **Step 7: Commit**

```bash
git add src/app/vendors/v/\[id\]/page.tsx \
        src/components/vendor/VendorProfileHero.tsx \
        src/components/vendor/VendorServicesList.tsx \
        src/components/vendor/VendorEnquiryRail.tsx \
        src/components/vendor/VendorPackages.tsx \
        src/components/vendor/VendorReviews.tsx \
        src/components/vendor/VendorPortfolio.tsx
git commit -m "feat(profile): switch profile page + sub-components to DB"
```

---

### Task 15: Switch `/vendors` browse-all page to use queries

**Files:**
- Modify: `src/app/vendors/page.tsx`

- [ ] **Step 1: Replace contents with**

```tsx
import Link from "next/link";
import { db } from "@/lib/db";
import { getCategoryVendorCounts } from "@/lib/queries/vendors";

const HIGHLIGHT_CITIES = ["Mumbai", "New Delhi", "Jaipur", "Bangalore", "Lucknow", "Udaipur"];

export default async function BrowseVendors() {
  const [categories, cities, counts] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.city.findMany({ where: { name: { in: HIGHLIGHT_CITIES } } }),
    getCategoryVendorCounts(),
  ]);

  const firstCategory = categories[0];
  const firstCity = cities[0];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Browse Vendors</h1>
        <p className="text-slate-600 mt-1">Pick a city and a category to start exploring.</p>
      </header>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Popular cities</h2>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <Link
              key={c.id}
              href={`/vendors/${c.slug}/${firstCategory?.id ?? ""}`}
              className="px-4 py-1.5 rounded-full bg-shaadi-light text-shaadi-deep text-sm hover:bg-shaadi-rose hover:text-white transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">All categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/vendors/${firstCity?.slug ?? ""}/${cat.id}`}
              className="p-4 bg-white border border-gray-200 rounded-xl hover:border-shaadi-deep transition-colors block"
            >
              <div className="text-2xl">{cat.emoji}</div>
              <h3 className="font-medium text-slate-900 mt-1">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{counts[cat.id] ?? 0} vendors</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Run**

```bash
npx tsc --noEmit
npm run dev
# Visit http://localhost:3000/vendors
```

- [ ] **Step 3: Commit**

```bash
git add src/app/vendors/page.tsx
git commit -m "feat(browse): switch /vendors landing page to DB"
```

---

### Task 16: Switch `CompareContext` to store previews + update `CompareTray`

**Files:**
- Modify: `src/context/CompareContext.tsx`
- Modify: `src/components/compare/CompareTray.tsx`
- Modify: `src/components/vendor/VendorRowCard.tsx`
- Modify: `src/context/CompareContext.test.tsx` (if it exists)

- [ ] **Step 1: Update `CompareContext.tsx`**

Replace contents with:

```tsx
"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { VendorPreview } from "@/types/vendor";

const STORAGE_KEY = "shaadisetu.compare";
const MAX = 3;

interface Ctx {
  previews: VendorPreview[];
  ids: string[];
  add: (preview: VendorPreview) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const CompareCtx = createContext<Ctx | null>(null);

function safeRead(): VendorPreview[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is VendorPreview =>
        x && typeof x === "object" && typeof x.id === "string" && typeof x.name === "string",
    );
  } catch {
    return [];
  }
}

function safeWrite(previews: VendorPreview[]) {
  try {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(previews));
  } catch {
    /* private mode etc. */
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [previews, setPreviews] = useState<VendorPreview[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPreviews(safeRead());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) safeWrite(previews);
  }, [previews, hydrated]);

  const add = useCallback((preview: VendorPreview): boolean => {
    let added = false;
    setPreviews((curr) => {
      if (curr.some((p) => p.id === preview.id) || curr.length >= MAX) return curr;
      added = true;
      return [...curr, preview];
    });
    return added;
  }, []);

  const remove = useCallback(
    (id: string) => setPreviews((curr) => curr.filter((p) => p.id !== id)),
    [],
  );
  const clear = useCallback(() => setPreviews([]), []);
  const has = useCallback((id: string) => previews.some((p) => p.id === id), [previews]);

  const ids = previews.map((p) => p.id);

  return (
    <CompareCtx.Provider value={{ previews, ids, add, remove, clear, has }}>
      {children}
    </CompareCtx.Provider>
  );
}

export function useCompare(): Ctx {
  const ctx = useContext(CompareCtx);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
```

- [ ] **Step 2: Update `CompareTray.tsx`**

Replace contents with:

```tsx
"use client";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";

export function CompareTray() {
  const { previews, remove, clear } = useCompare();
  if (previews.length === 0) return null;

  const idsParam = previews.map((p) => p.id).join(",");

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white border border-shaadi-light rounded-xl shadow-lg p-3 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-shaadi-deep">Compare ({previews.length}/3)</span>
        <button onClick={clear} className="text-xs text-slate-500 hover:underline">Clear</button>
      </div>
      <ul className="space-y-1 mb-2">
        {previews.map((p) => (
          <li key={p.id} className="flex items-center justify-between text-xs">
            <span className="truncate">{p.name}</span>
            <button onClick={() => remove(p.id)} className="text-slate-400 hover:text-red-700 ml-2" aria-label={`Remove ${p.name}`}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <Link
        href={`/compare?ids=${idsParam}`}
        className="block w-full text-center bg-shaadi-deep text-white text-sm py-1.5 rounded-lg"
      >
        Compare →
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Update `VendorRowCard.tsx` to pass a preview**

The card currently calls `add(vendor.id)`. Change to `add({ id: vendor.id, name: vendor.name })`. Replace the onClick line in `VendorRowCard.tsx`:

```tsx
onClick={() => (inCompare ? remove(vendor.id) : add({ id: vendor.id, name: vendor.name }))}
```

- [ ] **Step 4: Fix existing CompareContext test if it exists**

Check `src/context/CompareContext.test.tsx`. If the test calls `add("v1")` (passing a bare id), update it to `add({ id: "v1", name: "Test Vendor" })`. The test setup mock-stores still work because the underlying value is now `VendorPreview[]` not `string[]`.

If the file does not exist, skip this step.

- [ ] **Step 5: Run**

```bash
npx tsc --noEmit
npm run test
```

Expected: 55/55 pass (test count unchanged).

- [ ] **Step 6: Commit**

```bash
git add src/context/CompareContext.tsx \
        src/components/compare/CompareTray.tsx \
        src/components/vendor/VendorRowCard.tsx
# Only add the test if it exists & was modified:
git add src/context/CompareContext.test.tsx 2>/dev/null || true
git commit -m "feat(compare): store vendor previews + send ids in tray link"
```

---

### Task 17: Switch `/compare` page to read `?ids=` and server-fetch

**Files:**
- Modify: `src/app/compare/page.tsx`
- Modify: `src/components/compare/ComparisonTable.tsx`

- [ ] **Step 1: Replace `src/app/compare/page.tsx`**

```tsx
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { getVendorsByIds } from "@/lib/queries/vendors";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const idList = ids ? ids.split(",").filter(Boolean) : [];
  const vendors = await getVendorsByIds(idList);

  // Fetch packages + stats in parallel for the rows that need them.
  const { db } = await import("@/lib/db");
  const [packagesByVendor, statsByVendor] = await Promise.all([
    Promise.all(
      vendors.map((v) =>
        db.package.findMany({
          where: { vendorId: v.id },
          orderBy: { price: "asc" },
          take: 1,
        }),
      ),
    ),
    Promise.all(
      vendors.map((v) =>
        db.vendorStats.findUnique({ where: { vendorId: v.id } }),
      ),
    ),
  ]);

  const startingPriceByVendor: Record<string, number> = {};
  vendors.forEach((v, i) => {
    startingPriceByVendor[v.id] = packagesByVendor[i][0]?.price ?? 0;
  });
  const responseTimeByVendor: Record<string, string> = {};
  vendors.forEach((v, i) => {
    responseTimeByVendor[v.id] = statsByVendor[i]?.responseTime ?? "—";
  });
  const cityNameById: Record<string, string> = {};
  const cities = await db.city.findMany({
    where: { id: { in: vendors.map((v) => v.cityId) } },
    select: { id: true, name: true },
  });
  cities.forEach((c) => { cityNameById[c.id] = c.name; });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">Compare Vendors</h1>
      <ComparisonTable
        vendors={vendors}
        startingPriceByVendor={startingPriceByVendor}
        responseTimeByVendor={responseTimeByVendor}
        cityNameById={cityNameById}
      />
    </main>
  );
}
```

- [ ] **Step 2: Replace `src/components/compare/ComparisonTable.tsx`**

```tsx
"use client";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import type { Vendor } from "@/types/vendor";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

interface Props {
  vendors: Vendor[];
  startingPriceByVendor: Record<string, number>;
  responseTimeByVendor: Record<string, string>;
  cityNameById: Record<string, string>;
}

export function ComparisonTable({
  vendors,
  startingPriceByVendor,
  responseTimeByVendor,
  cityNameById,
}: Props) {
  const { remove } = useCompare();

  if (vendors.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600 mb-4">No vendors selected.</p>
        <Link href="/vendors" className="text-shaadi-deep underline">Browse vendors</Link>
      </div>
    );
  }

  const cols = `200px repeat(${vendors.length}, minmax(220px, 1fr))`;

  const Row = ({
    label,
    render,
  }: {
    label: string;
    render: (v: Vendor) => React.ReactNode;
  }) => (
    <div className="grid items-start gap-3 py-3 border-b border-gray-100" style={{ gridTemplateColumns: cols }}>
      <div className="text-xs uppercase text-slate-500">{label}</div>
      {vendors.map((v) => <div key={v.id} className="text-sm text-slate-800">{render(v)}</div>)}
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <div className="grid items-end gap-3 pb-3 border-b border-gray-200 sticky top-0 bg-white" style={{ gridTemplateColumns: cols }}>
        <div />
        {vendors.map((v) => (
          <div key={v.id} className="space-y-1">
            <div className="aspect-[4/3] bg-gradient-to-br from-shaadi-light to-shaadi-rose rounded-lg" aria-hidden />
            <h3 className="font-semibold text-slate-900 truncate">{v.name}</h3>
            <button onClick={() => remove(v.id)} className="text-xs text-slate-500 hover:text-red-700">Remove</button>
          </div>
        ))}
      </div>

      <Row label="Rating" render={(v) => <>⭐ {v.rating} ({v.reviewCount})</>} />
      <Row label="Starting price" render={(v) => formatINR(startingPriceByVendor[v.id] ?? 0)} />
      <Row label="City" render={(v) => cityNameById[v.cityId] ?? ""} />
      <Row label="Experience" render={(v) => `${v.yearsExperience} yrs`} />
      <Row label="Verified" render={(v) => (v.verified ? "✓ Yes" : "—")} />
      <Row label="Response time" render={(v) => responseTimeByVendor[v.id] ?? "—"} />
      <Row label="Tags" render={(v) => v.tags.join(", ")} />

      <div className="grid items-stretch gap-3 pt-4" style={{ gridTemplateColumns: cols }}>
        <div />
        {vendors.map((v) => (
          <Link key={v.id} href={`/vendors/v/${v.id}`} className="text-center bg-shaadi-deep text-white py-2 rounded-lg text-sm">
            View profile & enquire
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run**

```bash
npx tsc --noEmit
npm run test
npm run dev
# 1. Visit /vendors/mumbai/photography
# 2. Click "+ Compare" on two cards
# 3. Click "Compare →" in the floating tray
# 4. URL should be /compare?ids=v5,v6 (or similar)
# 5. Page should render side-by-side table
```

- [ ] **Step 4: Commit**

```bash
git add src/app/compare/page.tsx src/components/compare/ComparisonTable.tsx
git commit -m "feat(compare): server-fetch vendors by ?ids= and pass derived data to table"
```

---

### Task 18: Switch `/api/enquiries` route to persist to DB

**Files:**
- Modify: `src/app/api/enquiries/route.ts`
- Create: `src/app/api/enquiries/route.int.test.ts`

- [ ] **Step 1: Replace `src/app/api/enquiries/route.ts`**

```ts
import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validators";
import { createEnquiry } from "@/lib/queries/enquiries";
import { Prisma } from "@/generated/prisma";

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

  try {
    const { id } = await createEnquiry(parsed.data);
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
      return NextResponse.json(
        { ok: false, error: "Vendor not found" },
        { status: 400 },
      );
    }
    console.error("[/api/enquiries] DB error:", e);
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Write integration test**

```ts
// src/app/api/enquiries/route.int.test.ts
import { describe, it, expect, afterAll } from "vitest";
import { db } from "@/lib/db";
import { POST } from "./route";

const ids: string[] = [];
afterAll(async () => {
  if (ids.length) await db.enquiry.deleteMany({ where: { id: { in: ids } } });
});

function req(body: unknown): Request {
  return new Request("http://test/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/enquiries", () => {
  it("returns 201 + id on valid body, persists row", async () => {
    const res = await POST(
      req({
        vendorId: "v5",
        name: "Priya",
        phone: "9876543210",
        eventDate: "2099-12-31",
        eventType: "wedding",
        requirements: "Need cinematic photography for our 2-day wedding.",
      }),
    );
    expect(res.status).toBe(201);
    const data = (await res.json()) as { ok: boolean; id: string };
    expect(data.ok).toBe(true);
    expect(typeof data.id).toBe("string");
    ids.push(data.id);

    const row = await db.enquiry.findUnique({ where: { id: data.id } });
    expect(row).not.toBeNull();
  });

  it("returns 400 on Zod failure (bad phone)", async () => {
    const res = await POST(
      req({
        vendorId: "v5",
        name: "X",
        phone: "12345",
        eventDate: "2099-12-31",
        eventType: "wedding",
        requirements: "x",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 on unknown vendorId (FK)", async () => {
    const res = await POST(
      req({
        vendorId: "vendor-does-not-exist",
        name: "Priya",
        phone: "9876543210",
        eventDate: "2099-12-31",
        eventType: "wedding",
        requirements: "Need cinematic photography for our 2-day wedding.",
      }),
    );
    expect(res.status).toBe(400);
    const data = (await res.json()) as { ok: boolean; error: string };
    expect(data.error).toMatch(/vendor not found/i);
  });

  it("returns 400 on invalid JSON body", async () => {
    const r = new Request("http://test/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not-json",
    });
    const res = await POST(r);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 3: Run**

```bash
npm run test:int -- src/app/api/enquiries/route.int.test.ts
```

Expected: 4/4 pass.

- [ ] **Step 4: Update existing component test if it references the old behavior**

Check `src/components/vendor/VendorEnquiryRail.test.tsx`. The test stubs `fetch` to return `{ok: true, id: "abc"}` — that still works because the route's success shape is unchanged. Run:

```bash
npm run test
```

Expected: 55/55 still pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/enquiries/route.ts src/app/api/enquiries/route.int.test.ts
git commit -m "feat(api): persist enquiries to DB with FK + Zod error mapping"
```

---

### Task 19: Add `src/app/vendors/error.tsx`

**Files:**
- Create: `src/app/vendors/error.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";
import { useEffect } from "react";

export default function VendorsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[vendors] error boundary caught:", error);
  }, [error]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">Couldn&apos;t load vendors right now</h1>
      <p className="text-slate-600 mt-2">
        We&apos;re having trouble reaching the database. Please try again in a moment.
      </p>
      <button
        onClick={reset}
        className="inline-block mt-6 bg-shaadi-deep text-white px-5 py-2 rounded-lg"
      >
        Try again
      </button>
    </main>
  );
}
```

- [ ] **Step 2: Smoke test**

Stop Postgres briefly to confirm the boundary works:

```bash
npm run db:down
# In another terminal: npm run dev
# Visit /vendors/mumbai/photography — should render the error boundary
npm run db:up
# Click "Try again" — page recovers
```

- [ ] **Step 3: Commit**

```bash
git add src/app/vendors/error.tsx
git commit -m "feat(vendors): add error boundary"
```

---

### Task 20: Delete `src/data/*.ts` mock files + their tests + update imports

**Files:**
- Delete: `src/data/availability.ts`, `src/data/availability.test.ts`
- Delete: `src/data/blogs.ts`
- Delete: `src/data/categories.ts`
- Delete: `src/data/cities.ts`
- Delete: `src/data/functions.ts`
- Delete: `src/data/packages.ts`, `src/data/packages.test.ts`
- Delete: `src/data/portfolio.ts`, `src/data/portfolio.test.ts`
- Delete: `src/data/reviews.ts`, `src/data/reviews.test.ts`
- Delete: `src/data/stats.ts`, `src/data/stats.test.ts`
- Delete: `src/data/vendors.ts`
- Modify: `prisma/seed.ts` — paths to mock data won't exist anymore; this is a one-shot file
- Modify: `src/lib/slugs.ts` — remove imports of `cities`/`categories`
- Modify: any remaining importer of `@/data/*` not yet covered

- [ ] **Step 1: Make `prisma/seed.ts` self-contained**

Before deleting the mock files, the seed needs to inline its data sources. Move the mock files into `prisma/seed-data/` (committed alongside the seed) so the seed remains runnable for re-bootstraps.

```bash
mkdir -p prisma/seed-data
git mv src/data/cities.ts prisma/seed-data/cities.ts
git mv src/data/categories.ts prisma/seed-data/categories.ts
git mv src/data/vendors.ts prisma/seed-data/vendors.ts
git mv src/data/packages.ts prisma/seed-data/packages.ts
git mv src/data/portfolio.ts prisma/seed-data/portfolio.ts
git mv src/data/reviews.ts prisma/seed-data/reviews.ts
git mv src/data/availability.ts prisma/seed-data/availability.ts
git mv src/data/stats.ts prisma/seed-data/stats.ts
```

- [ ] **Step 2: Update `prisma/seed.ts` import paths**

Change every `from "../src/data/<file>"` to `from "./seed-data/<file>"`.

For example:
```ts
import { cities } from "./seed-data/cities";
import { categories } from "./seed-data/categories";
import { sampleVendors } from "./seed-data/vendors";
import { packagesByVendor } from "./seed-data/packages";
import { portfolioByVendor } from "./seed-data/portfolio";
import { reviewsByVendor } from "./seed-data/reviews";
import { bookedDatesByVendor } from "./seed-data/availability";
import { statsByVendor } from "./seed-data/stats";
```

The `cityToSlug` import stays from `@/lib/slugs` — but the slug helper itself currently imports `@/data/cities`. We need to fix that next.

- [ ] **Step 3: Make `src/lib/slugs.ts` standalone**

`slugs.ts` currently imports `cities` and `categories` from `@/data/*` to build collision tables. We no longer need that runtime data — the helper is now used only for *display* of route segments and a few seeding cases. Replace with a pure function set:

```ts
// src/lib/slugs.ts
import type { City } from "@/types/vendor";

/** Convert a string to a kebab-case slug (ASCII-only by design). */
export function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Display-only; not safe for round-tripping to data. */
export function fromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Canonical URL slug for a city. Disambiguates collisions by appending the
 * state slug. The disambiguation logic now lives at seed time — the seeded
 * `City.slug` column is authoritative — but this helper is still useful for
 * building hrefs from a City object passed to a client component.
 */
export function cityToSlug(city: Pick<City, "name" | "state">): string {
  return `${toSlug(city.name)}-${toSlug(city.state)}`;
}
```

**Note:** the seed now collides on cities sharing a name (e.g., the two Bilaspurs). Mitigate by always-suffixing `-${state}` in `cityToSlug`. This produces slugs like `bilaspur-chhattisgarh` and `bilaspur-himachal-pradesh`, which are unambiguous and stable.

- [ ] **Step 4: Update the seed to use the always-suffixing slug**

`prisma/seed.ts`'s `seedCities` already calls `cityToSlug(c)` — no change needed. The seeded slug is now always `name-state`, so `/vendors/<slug>/...` URLs become `/vendors/mumbai-maharashtra/...` etc. This is a URL change for end users.

If you want shorter URLs for highlight cities (e.g., `/vendors/mumbai/photography`), revert to a name-only slug for non-colliding cities by inspecting `cities` at seed time:

```ts
// In prisma/seed.ts, replace seedCities() with:
import { cities as cityList } from "./seed-data/cities";

function buildCitySlugs(): Map<string, string> {
  const counts = new Map<string, number>();
  for (const c of cityList) {
    const ns = toSlug(c.name);
    counts.set(ns, (counts.get(ns) ?? 0) + 1);
  }
  const out = new Map<string, string>();
  for (const c of cityList) {
    const ns = toSlug(c.name);
    const slug = (counts.get(ns) ?? 0) > 1 ? `${ns}-${toSlug(c.state)}` : ns;
    out.set(`${c.name}|${c.state}`, slug);
  }
  return out;
}

async function seedCities() {
  console.log(`[seed] cities: ${cityList.length}`);
  const slugs = buildCitySlugs();
  for (const c of cityList) {
    const slug = slugs.get(`${c.name}|${c.state}`)!;
    await prisma.city.upsert({
      where: { slug },
      update: { name: c.name, state: c.state },
      create: { slug, name: c.name, state: c.state },
    });
  }
}
```

Add `import { toSlug } from "../src/lib/slugs";` to the seed if not already present. **Re-seed** to replace any previously-seeded slugs:

```bash
docker exec -i shaadisetu-pg psql -U shaadisetu -d shaadisetu -c 'TRUNCATE "City" CASCADE;'
npm run db:seed
```

- [ ] **Step 5: Delete remaining mock files**

```bash
git rm src/data/blogs.ts src/data/functions.ts
git rm src/data/availability.test.ts src/data/packages.test.ts \
       src/data/portfolio.test.ts src/data/reviews.test.ts src/data/stats.test.ts
rmdir src/data 2>/dev/null || true
```

- [ ] **Step 6: Find and fix any remaining imports**

```bash
grep -rn "from \"@/data/" src/ || echo "no remaining imports"
```

If `@/data/blogs` or `@/data/functions` is referenced by `/blog`, `/functions`, etc., either:
- Re-create the file at its new location (e.g., `src/content/blogs.ts`) — these are static content, not vendor data, so the DB doesn't need them.
- Or leave the page broken and skip it for this slice (documented in commit message).

For Slice B's purpose, **content pages (`/blog`, `/functions`, `/categories`) are out of scope** — only vendor-data dependencies need to migrate. Move static content files to `src/content/`:

```bash
git mv prisma/seed-data/blogs.ts src/content/blogs.ts 2>/dev/null || true
git mv prisma/seed-data/functions.ts src/content/functions.ts 2>/dev/null || true
```

(If they were already deleted in Step 5, restore them via `git checkout HEAD~1 -- src/data/blogs.ts src/data/functions.ts && git mv src/data/blogs.ts src/content/blogs.ts` etc.)

Update each page that imports them: `grep -rn '"@/data/blogs"\|"@/data/functions"' src/app | cut -d: -f1 | sort -u | xargs -I {} sed -i '' 's|@/data/blogs|@/content/blogs|g; s|@/data/functions|@/content/functions|g' {}`.

- [ ] **Step 7: Run all checks**

```bash
npx tsc --noEmit
npm run test
npm run test:int
npm run dev
# Visit /vendors, /vendors/mumbai/photography, /vendors/v/v5, /compare?ids=v5,v6 — all should work.
```

Expected: tsc clean, all unit + integration tests pass.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: delete src/data mocks; move static content; DB is source of truth"
```

---

### Task 21: `vercel.ts` + Vercel Postgres provisioning + first deploy

**Files:**
- Create: `vercel.ts`
- Modify: `package.json` (devDependency `@vercel/config`)

This task is **partially manual** — provisioning a Vercel Postgres instance requires dashboard access. The agent should write the config + push, then the human user (or a follow-up agent with Vercel MCP access) provisions the DB.

- [ ] **Step 1: Install `@vercel/config`**

```bash
npm install -D @vercel/config
```

- [ ] **Step 2: Create `vercel.ts`**

```ts
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "prisma generate && prisma migrate deploy && next build",
};
```

- [ ] **Step 3: Verify `package.json` has `prisma migrate deploy` callable from build**

The build command above invokes `prisma` from `node_modules/.bin/prisma` automatically when run by Vercel. No change needed if `prisma` is in `devDependencies`.

- [ ] **Step 4: Commit**

```bash
git add vercel.ts package.json package-lock.json
git commit -m "chore(deploy): add vercel.ts with prisma migrate in build"
```

- [ ] **Step 5: Push and deploy**

```bash
git push origin main
```

Then in the Vercel dashboard (or via the Vercel CLI / MCP):
1. Connect the repo if not already linked.
2. Add Vercel Postgres (Neon) integration: Project → Storage → Create → Postgres. Vercel auto-injects `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`.
3. Trigger a deploy. The build will run `prisma migrate deploy`, applying the local migration history.

- [ ] **Step 6: Document Vercel env in README**

Edit `README.md`'s Architecture section (added in Slice A) — append:

```markdown
## Production deployment

- Hosted on Vercel.
- Postgres via Vercel Postgres (Neon) integration.
- Required env vars (auto-injected by Vercel):
  - `POSTGRES_PRISMA_URL` — pooled, used by the app at runtime.
  - `POSTGRES_URL_NON_POOLING` — direct, used by `prisma migrate`.
- Build command: `prisma generate && prisma migrate deploy && next build`.
- Local dev uses Docker Postgres on port 5433; see Development above.
```

- [ ] **Step 7: Commit doc update**

```bash
git add README.md
git commit -m "docs: production deploy notes"
```

---

### Task 22: Run seed against production DB + smoke

**Files:** none (operational task)

- [ ] **Step 1: Pull production env locally**

```bash
npx vercel env pull .env.production.local
```

This populates `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` from Vercel into a local file (which is git-ignored).

- [ ] **Step 2: Apply migrations + seed against production**

```bash
# Migrations should already have applied during Vercel build, but double-check:
DATABASE_URL=$(grep POSTGRES_URL_NON_POOLING .env.production.local | cut -d= -f2-) \
  POSTGRES_PRISMA_URL=$(grep POSTGRES_PRISMA_URL .env.production.local | cut -d= -f2-) \
  POSTGRES_URL_NON_POOLING=$(grep POSTGRES_URL_NON_POOLING .env.production.local | cut -d= -f2-) \
  npx prisma migrate deploy

# Seed once:
DATABASE_URL=$(grep POSTGRES_URL_NON_POOLING .env.production.local | cut -d= -f2-) \
  POSTGRES_PRISMA_URL=$(grep POSTGRES_PRISMA_URL .env.production.local | cut -d= -f2-) \
  POSTGRES_URL_NON_POOLING=$(grep POSTGRES_URL_NON_POOLING .env.production.local | cut -d= -f2-) \
  npx prisma db seed
```

Expected: row counts identical to local (cities ~450, vendors 90, packages 270, etc.).

- [ ] **Step 3: Smoke the deployed URL**

Find the production URL from the Vercel dashboard (e.g., `https://shaadisetu.vercel.app`).

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://shaadisetu.vercel.app/vendors/mumbai/photography
curl -s -o /dev/null -w "%{http_code}\n" https://shaadisetu.vercel.app/vendors/v/v5
curl -s -o /dev/null -w "%{http_code}\n" https://shaadisetu.vercel.app/compare?ids=v5,v6
curl -s -X POST https://shaadisetu.vercel.app/api/enquiries \
  -H 'Content-Type: application/json' \
  -d '{"vendorId":"v5","name":"Test","phone":"9876543210","eventDate":"2099-12-31","eventType":"wedding","requirements":"Production smoke."}'
```

Expected: three 200s and a JSON `{"ok":true,"id":"..."}` from the enquiry endpoint.

- [ ] **Step 4: Verify enquiry persisted in production**

```bash
DATABASE_URL=$(grep POSTGRES_URL_NON_POOLING .env.production.local | cut -d= -f2-) \
  npx prisma studio --browser none &
# Open http://localhost:5555, navigate to Enquiry, confirm the smoke-test row exists.
# kill %1
```

- [ ] **Step 5: Document the smoke test in commit**

No code changes — just record the result. (Skip commit if no files changed; if you wrote a quick note to `docs/`, commit that.)

---

### Task 23: README updates + final cleanup

**Files:**
- Modify: `README.md`
- Modify: `package.json` (verify scripts coherent)

- [ ] **Step 1: Update Development section in `README.md`**

Replace the existing `## Development` section with:

````markdown
## Development

```bash
# 1. Start Postgres
npm run db:up

# 2. (First time only) sync env from Vercel or copy .env.example -> .env.local
cp .env.example .env.local   # then fill in DATABASE_URL etc.

# 3. Apply migrations + seed
npm run db:migrate
npm run db:seed

# 4. Run the app
npm run dev          # http://localhost:3000

# Tests
npm run test         # unit/component (Vitest, jsdom)
npm run test:int     # integration (Vitest + Postgres on 5433)
npx playwright test  # E2E (run `npx playwright install chromium` first)
```

### Common DB tasks

```bash
npm run db:up         # docker compose up -d
npm run db:down       # docker compose down
npm run db:migrate    # prisma migrate dev
npm run db:generate   # prisma generate (after schema edits)
npm run db:seed       # prisma db seed
npx prisma studio     # http://localhost:5555 — visual DB inspector
```
````

- [ ] **Step 2: Update Architecture section**

Replace the existing `## Architecture` section with:

```markdown
## Architecture

- **Slice A — Vendor Browsing v1** (shipped)
  - Listing, profile, compare, enquiry flows.
- **Slice B — Vendor Backend v1** (shipped)
  - Postgres + Prisma replaces `src/data/*.ts` mocks.
  - Server Components query Prisma via wrappers in `src/lib/queries/`.
  - `POST /api/enquiries` persists rows; `useEnquiry` hook still keeps a
    local copy in `localStorage["shaadisetu.enquiries"]` for the user.
  - Compare uses `CompareContext` (localStorage-backed previews,
    max 3 vendors). The `/compare` page server-fetches by `?ids=` query.
- See `docs/superpowers/specs/2026-04-28-vendor-backend-v1-design.md` for the full design.
```

- [ ] **Step 3: Run final verification**

```bash
npx tsc --noEmit
npm run test
npm run test:int
npm run build
```

Expected: all clean.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: update README for Slice B (Postgres + Prisma + Vercel)"
```

- [ ] **Step 5: Final push**

```bash
git push origin main
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Prisma + Vercel Postgres + Docker → Tasks 1, 21
- ✅ Schema (10 models + enum) → Tasks 2, 3
- ✅ Singleton `db.ts` + type re-exports → Task 4
- ✅ Seed from existing mocks → Tasks 5, 6, 7
- ✅ Integration test infra → Task 8
- ✅ Query wrappers + tests → Tasks 9–12
- ✅ Listing/profile/browse pages on DB → Tasks 13, 14, 15
- ✅ Compare flow with previews + ?ids= → Tasks 16, 17
- ✅ /api/enquiries persists → Task 18
- ✅ Error boundary → Task 19
- ✅ Mock files deleted → Task 20
- ✅ Vercel deploy + production seed → Tasks 21, 22
- ✅ README + final cleanup → Task 23

**Type-consistency check:**
- `Vendor`, `Package`, `Review`, etc. originate from `@/types/vendor` (which re-exports from Prisma). Every component import was updated in Tasks 13, 14.
- `VendorWithProfile` type defined in Task 4 is the contract for `getVendorProfile` in Task 10. Profile page in Task 14 uses it.
- `VendorPreview` type in Task 4 is the contract for `CompareContext.add` in Task 16.
- `CreateEnquiryInput` type in Task 12 matches the Zod-parsed `EnquiryInput` from Slice A (`src/lib/validators.ts`). Field names align: vendorId, name, phone, eventDate, eventType, requirements.

**Placeholder scan:**
- No "TBD", "TODO", or "implement later" markers in code blocks.
- Manual steps in Tasks 21–22 are unavoidable (Vercel dashboard provisioning) and explicitly marked.
- `prisma/seed-data/` is an intentional location for re-runnable seeds; not a placeholder.

**Known sequencing risk:**
- Task 13 changes `VendorRowCard` to drop the `isBooked` import. If anything else still imports `@/data/availability` after Task 13, tsc fails. Task 20's grep guard catches this — but if the engineer skips ahead, they'll see a tsc error on `VendorEnquiryRail` (Task 14 fixes that). Recommend running tasks in order.
