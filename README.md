# ShaadiSetu

ShaadiSetu — *Shaadi ki har zaroorat, ek hi jagah* — is a wedding planning platform that helps Indian couples discover, compare, and book vendors for every aspect of their wedding. Built with Next.js (App Router), TypeScript, Tailwind, Prisma + Postgres.

## Development

```bash
npm install
cp .env.example .env.local        # then edit DATABASE_URL
npm run db:generate               # generate Prisma client (macOS-friendly via with-ca.sh wrapper)
npm run db:migrate                # apply migrations + create dev DB
npm run db:seed                   # seed cities, categories, vendors, etc.
npm run dev                       # http://localhost:3000
npm test                          # unit/component tests
npm run test:int                  # integration tests (hit real DB; require local DATABASE_URL)
npm run e2e                       # Playwright (run `npx playwright install chromium` first)
```

`DATABASE_URL` must point at a local Postgres for development. Easiest options:
- a free Neon dev branch (`postgres://...`)
- a local Docker container (`postgres:16`) bound to `localhost:5432`

The macOS `scripts/with-ca.sh` wrapper exists because Prisma's CLI downloads engine binaries over TLS and the system keychain on Apple Silicon needs an explicit CA bundle. CI/Vercel use plain `prisma` directly and don't need it.

## Architecture

- **Slice A — Vendor Browsing v1** *(shipped)*
  - Listing, profile, compare, enquiry UX, URL-synced filters, localStorage compare tray.
- **Slice B — Real backend** *(current)*
  - All vendor/package/portfolio/review/availability/stats data lives in Postgres via Prisma.
  - `src/lib/queries/` wraps every read; pages call those, never `db.*` directly (except where stated).
  - Enquiries persist to `Enquiry` table; FK violations on `vendorId` map to 400.
  - Compare context stores `{id,name}` previews so `/compare?ids=…` can server-fetch the full profiles in one round trip.
  - Specs: `docs/superpowers/specs/2026-04-28-vendor-browsing-v1-design.md`, `docs/superpowers/specs/2026-04-28-slice-b-real-backend-design.md`.

## Deploy (Vercel)

1. Provision a Postgres database (Neon via Vercel Marketplace recommended) and copy its `DATABASE_URL`.
2. In Vercel project settings, set `DATABASE_URL` for **Production** and **Preview** environments.
3. Push to `main`. The `vercel-build` script runs `prisma generate && prisma migrate deploy && next build`.
4. Seed production once: `DATABASE_URL=… npx prisma db seed` from your machine, or run `npx prisma migrate reset --force` against a fresh prod DB.
