# ShaadiSetu

ShaadiSetu — *Shaadi ki har zaroorat, ek hi jagah* — is a wedding planning platform that helps Indian couples discover, compare, and book vendors for every aspect of their wedding. Built with Next.js (App Router), TypeScript, and Tailwind CSS.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm vitest run   # unit/component tests
pnpm playwright test   # E2E (requires `npx playwright install chromium` first)
```

## Architecture

- **Slice A — Vendor Browsing v1** (current)
  - All vendor data is mock (`src/data/*.ts`); no DB yet.
  - Enquiry POSTs to `/api/enquiries` — currently logs only; persisted to `localStorage` for the user.
  - Compare uses `CompareContext` (localStorage-backed, max 3 vendors).
  - Filters synced to URL via `useVendorFilters` (`?rating=4&sort=rating&date=YYYY-MM-DD`).
- See `docs/superpowers/specs/2026-04-28-vendor-browsing-v1-design.md` for the full design.
