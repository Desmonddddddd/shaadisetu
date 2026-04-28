# Slice C — Vendor Auth + Dashboard

**Status:** Approved
**Date:** 2026-04-28
**Predecessors:** Slice A (browsing), Slice B (real backend)
**Successors:** Slice D (real images), Slice E (couple accounts), Slice F (search)

## Goal

Close the marketplace loop: vendors sign up, claim a seeded profile by email, log in, see their incoming enquiries, respond to them, and self-edit their profile and packages. New (unseeded) signups are gated behind admin promotion. Vendors get an email when an enquiry arrives.

## Non-goals (deferred)

- Image uploads (Slice D)
- Couple accounts and saved-vendor lists (Slice E)
- Search and faceted filters (Slice F)
- Admin UI to promote pending vendors (Slice C uses a manual SQL/CLI step; admin UI later)
- Playwright E2E coverage (deferred to a polish slice)
- Password reset / email verification (deferred — assumes vendors remember their password; revisit before public launch)

## Architecture

### Stack additions

| Concern | Choice | Reason |
|---|---|---|
| Auth library | NextAuth v5 (Auth.js) | Best docs for our exact stack (Next App Router + Prisma); JWT sessions avoid per-request DB lookups |
| Adapter | `@auth/prisma-adapter` | Native to our Prisma client |
| Password hash | `bcryptjs` | Pure JS, works on Vercel serverless without native compile |
| Transactional email | Resend + `resend` SDK | One API key, generous free tier, simple typed client |
| Mutation API | Next.js Server Actions | Co-located, type-safe, free CSRF, no extra REST surface |

### Data model changes

**New tables:**

```prisma
model VendorAccount {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  vendorId     String?  @unique
  vendor       Vendor?  @relation(fields: [vendorId], references: [id])
  status       String   @default("pending") // "pending" | "active"
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

NextAuth's standard `Session`, `Account`, `VerificationToken` tables are also added via the Prisma adapter — required even with JWT sessions for OAuth account-linking forward-compat.

**Existing-table additions:**

```prisma
model Vendor {
  // ...existing fields...
  email           String?         @unique     // claim key
  moderationState String          @default("live") // "live" | "pending"
  account         VendorAccount?
}

model Enquiry {
  // ...existing fields...
  readAt    DateTime?
  // status already exists; valid values constrained in app code:
  //   "new" | "contacted" | "booked" | "declined"
}
```

### Auth flow

- **Login** (`/login`): email + password form → NextAuth Credentials provider → bcrypt compare against `VendorAccount.passwordHash` → JWT cookie. Generic error message on any failure (no user enumeration).
- **Signup** (`/signup/vendor`): email + password + confirm. On submit:
  1. Reject if `VendorAccount.email` already exists.
  2. Look up `Vendor.email`. If match: create `VendorAccount` with `vendorId = vendor.id`, `status = "active"`. Sign user in.
  3. If no match: create `VendorAccount` with `vendorId = null`, `status = "pending"`. Show "we'll review your account" page; do not auto-login.
- **Middleware** (`src/middleware.ts`): protect `/vendor/dashboard/*`. No session → redirect to `/login?next=<path>`. Session with `status === "pending"` → redirect to `/vendor/pending`.

### Routes

| Path | Type | Purpose |
|---|---|---|
| `/login` | client form + NextAuth | Vendor login |
| `/signup/vendor` | client form + server action | Vendor signup with claim |
| `/vendor/pending` | server | Holding page for unclaimed signups |
| `/api/auth/[...nextauth]` | NextAuth handler | OAuth/credentials surface |
| `/vendor/dashboard` | server | Overview: unread count, edit links |
| `/vendor/dashboard/enquiries` | server | Inbox list |
| `/vendor/dashboard/enquiries/[id]` | server | Single enquiry + status actions |
| `/vendor/dashboard/profile` | server (form) | Edit name/description/priceRange/tags/city |
| `/vendor/dashboard/packages` | server (form) | List/add/edit/delete packages |

Middleware gates all `/vendor/dashboard/*` routes.

### Server actions

All mutations go through Server Actions, not REST. Each calls `requireVendorSession()` first.

**`src/lib/actions/enquiries.ts`:**
- `markEnquiryStatus(enquiryId, status)` — owner check, update `status`, set `readAt` if null, `revalidatePath('/vendor/dashboard/enquiries')`
- `markEnquiryRead(enquiryId)` — owner check, set `readAt = now()` if null

**`src/lib/actions/profile.ts`:**
- `updateVendorProfile(input)` — Zod schema: `{ name, description, priceRange, tags: string[], cityId }`. Owner: `session.vendorId === input.vendorId`. Update, revalidate the public profile path.

**`src/lib/actions/packages.ts`:**
- `createPackage(input)` — Zod, owner check, insert
- `updatePackage(id, input)` — Zod, owner check via `db.package.findUnique({where: {id}}).vendorId === session.vendorId`, update
- `deletePackage(id)` — owner check, delete

**Auth helper** (`src/lib/auth/session.ts`):

```ts
export async function requireVendorSession(): Promise<{ accountId: string; vendorId: string }> {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");
  const account = await db.vendorAccount.findUnique({ where: { id: session.user.id } });
  if (!account) throw new Error("UNAUTHORIZED");
  if (account.status !== "active" || !account.vendorId) throw new Error("FORBIDDEN");
  return { accountId: account.id, vendorId: account.vendorId };
}
```

### Read queries

Add to `src/lib/queries/enquiries.ts`:

- `getInboxForVendor(vendorId): Promise<EnquiryListItem[]>` — sorted `createdAt desc`, includes computed `unread: readAt === null`
- `getEnquiryForVendor(enquiryId, vendorId): Promise<Enquiry | null>` — `findFirst` with `{ id, vendorId }` so unauthorized access returns null (route renders 404)

### Email side effect

`src/lib/email.ts`:

```ts
export async function sendNewEnquiryEmail(
  vendor: { email: string | null; name: string },
  enquiry: { name: string; phone: string; eventDate: string; eventType: string; requirements: string },
): Promise<void> {
  if (!vendor.email) return;
  if (!process.env.RESEND_API_KEY) return; // dev/test no-op
  // ...resend.emails.send({ from, to: vendor.email, subject, html })
}
```

Hooked into `/api/enquiries` after `createEnquiry()` succeeds; called with `.catch()` so a Resend failure never fails the enquiry write.

## Error handling & edge cases

**Auth:**
- Wrong password / unknown email → generic "Invalid credentials" (no user enumeration)
- Pending account logs in successfully → middleware redirects to `/vendor/pending` on dashboard access
- Session expired during a server action → action throws; client shows toast "Session expired, please log in again"

**Signup:**
- Existing `VendorAccount.email` → "Account exists, please log in" (form-level error)
- Weak password (< 8 chars or no number) → Zod field error
- Password / confirm mismatch → field error

**Dashboard:**
- Account with `vendorId === null` somehow reaches a dashboard route → middleware catches via pending state, page never renders
- Enquiry already in a terminal state (`booked` / `declined`) → status buttons still work to allow corrections; no special UI
- Concurrent edits in two tabs → last write wins; no optimistic locking in Slice C

**Email:**
- Resend down or API key missing → caught, logged, enquiry still persisted, user sees success
- Seeded vendor with `email: null` → skip silently

**Public flow regression-proofing:**
- Existing `/api/enquiries` integration tests must keep passing
- Email helper is a no-op when `RESEND_API_KEY` is unset (default in dev/test)

## Testing

**Unit (vitest + jsdom):**
- Login form: invalid email → inline error; valid submit → fetch called
- Signup form: password mismatch / weak password → inline errors
- Dashboard inbox: renders unread badge; status buttons render the correct state given current `status`
- Profile form: tag chip add/remove; field validation errors

**Integration (vitest + real Postgres, gated by local `DATABASE_URL`):**
- `signupVendor()`: matching email → linked + active; no match → pending
- `requireVendorSession()`: no session throws; pending throws; active passes
- `markEnquiryStatus()`: own enquiry passes; other vendor's enquiry throws
- `updateVendorProfile()` / `createPackage()` / `deletePackage()`: same owner-check pattern
- `/api/enquiries`: still returns 201; email helper is mocked to a no-op

**Out of scope:**
- Playwright E2E (deferred to polish slice — Playwright + Neon plumbing not worth it yet)
- NextAuth internals (it's a library)
- Resend delivery (mock at boundary)

## Migration / deploy notes

1. New Prisma migration adds `VendorAccount`, NextAuth tables, and `Vendor.email` / `Vendor.moderationState` / `Enquiry.readAt`.
2. Seed update: assign synthetic emails to seeded vendors (`<slug>@vendors.shaadisetu.test`) so claim-by-email works against the existing 90 vendors. `moderationState` defaults to `"live"` for all of them.
3. New env vars on Vercel:
   - `NEXTAUTH_SECRET` — generated via `openssl rand -base64 32`
   - `NEXTAUTH_URL` — production URL (auto-set by Vercel deploy)
   - `RESEND_API_KEY` — Resend dashboard
   - `RESEND_FROM` — verified sender like `enquiries@shaadisetu.in` (or fall back to Resend's onboarding sender for dev)
4. After deploy, smoke-test:
   - Sign up with `<seeded-vendor-email>` → land on dashboard
   - Submit an enquiry from the public flow → it appears in the dashboard inbox
   - Mark it contacted → state persists across refresh
   - If Resend is configured, verify the email arrives

## Open questions for future slices

- Admin UI for promoting pending vendor signups (Slice C uses manual DB updates; admin UI deferred)
- Email templates beyond plain text — branded HTML in Slice D alongside images
- Password reset flow — needed before genuine public launch
