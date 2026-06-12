# Implementation Plan: Jemeka Tours Codebase Hardening

## Overview

This implementation plan covers 32 tasks across 5 phases: Pre-Production Blockers, Security Hardening, Quality/Performance/CI, Business Features & Observability, and Accessibility. Tasks are organized by dependency so that foundational fixes (build config, types, tests) land before features that depend on them.

## Tasks

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["T01", "T04", "T08", "T09"]
    },
    {
      "wave": 2,
      "tasks": ["T02", "T05", "T06", "T07"]
    },
    {
      "wave": 3,
      "tasks": ["T03", "T10", "T11", "T12", "T13"]
    },
    {
      "wave": 4,
      "tasks": ["T14", "T15", "T17", "T18", "T19", "T20", "T21"]
    },
    {
      "wave": 5,
      "tasks": ["T16", "T22", "T23", "T24", "T25", "T26"]
    },
    {
      "wave": 6,
      "tasks": ["T27", "T28", "T29", "T30", "T31", "T32"]
    }
  ]
}
```

---

## Phase 1 — Pre-Production Blockers

### T01 · Re-enable TypeScript and ESLint in builds
- [ ] Open `apps/web/next.config.ts`
- [ ] Remove `typescript: { ignoreBuildErrors: true }`
- [ ] Remove `eslint: { ignoreDuringBuilds: true }`
- [ ] Run `npm run build --workspace=apps/web` and capture all errors
- [ ] Document the list of type errors to fix (baseline for T02 and T19)

### T02 · Add proper types for component props
- [ ] In `packages/db/src/schema.ts`, verify `Package`, `Destination`, `Booking`, `Testimonial`, `Enquiry` types are exported
- [ ] Create `apps/api/src/types.ts` with `PackageWithDestination = Package & { destination?: Destination | null }`
- [ ] Update `PackageDetailClient.tsx` prop: `pkg: PackageWithDestination`
- [ ] Update `DestinationDetailClient.tsx` prop: `destination: Destination & { packages?: Package[] }`
- [ ] Update `DestinationsList.tsx` prop: `destinations: Destination[]`
- [ ] Update `PackagesList.tsx` prop: `packages: Package[]`
- [ ] Remove all `as any` casts from `admin/page.tsx` tRPC calls (after T10 converts it to a Server Component)
- [ ] Fix Drizzle order-by callbacks in `destination-router.ts` and `package-router.ts` to use proper column references
- [ ] Fix `const updates: any` in `booking-router.ts` and `testimonial-router.ts`
- [ ] Verify `npm run build --workspace=apps/web` passes without type errors

### T03 · Secure booking creation
- [ ] Open `apps/api/src/booking-router.ts`
- [ ] Change `create: publicQuery` to `create: authedQuery`
- [ ] Add `userId: ctx.user.id` to the `db.insert(bookings).values(...)` call
- [ ] Change `getByReference: publicQuery` to `getByReference: authedQuery`
- [ ] Add ownership check: if `booking.userId !== ctx.user.id && ctx.user.role !== "admin"` then throw `TRPCError({ code: "FORBIDDEN" })`
- [ ] Update `PackageDetailClient.tsx` to handle the case where the user is not authenticated (show "Sign in to book" message with link to `/login?callbackUrl=...`)
- [ ] Test: verify unauthenticated POST to `booking.create` returns 401
- [ ] Test: verify authenticated user can create and retrieve their own booking
- [ ] Test: verify user cannot retrieve another user's booking by reference

### T04 · Fix schema timestamp defaults
- [ ] Open `packages/db/src/schema.ts`
- [ ] Replace ALL occurrences of `.default(new Date())` with `.$defaultFn(() => new Date())` on `createdAt` columns
- [ ] Replace ALL occurrences of `.default(new Date())` with `.$defaultFn(() => new Date())` on `updatedAt` columns (verify: users, destinations, packages, bookings)
- [ ] Create `packages/db/src/utils.ts` exporting `export const withUpdatedAt = { updatedAt: new Date() }` as a function `() => ({ updatedAt: new Date() })`
- [ ] Update `booking-router.ts` `updateStatus` to include `...withUpdatedAt()` in the `.set()` call
- [ ] Update `enquiry-router.ts` `updateStatus` to include `...withUpdatedAt()` in the `.set()` call
- [ ] Update `testimonial-router.ts` `updateStatus` to include `...withUpdatedAt()` in the `.set()` call
- [ ] Run `npm run db:generate --workspace=apps/api` to generate a new migration
- [ ] Verify the migration file is created and committed
- [ ] Run `npm run db:push --workspace=apps/api` to apply locally
- [ ] Test: insert a new record and verify `createdAt` is approximately `Date.now()`
- [ ] Test: update a record and verify `updatedAt` is approximately `Date.now()`

### T05 · Create shared booking reference module
- [ ] Create `apps/api/src/lib/booking-ref.ts`
- [ ] Move `generateBookingRef()` function into this file and export it
- [ ] Update `apps/api/src/booking-router.ts` to import from `"./lib/booking-ref"`
- [ ] Update `apps/api/src/booking.test.ts` to import from `"../lib/booking-ref"` (remove local definition)
- [ ] Verify both files compile and `vitest run` passes

### T06 · Fix integration test imports
- [ ] Open `apps/api/src/booking.integration.test.ts`
- [ ] Replace `import { getDb } from './queries/connection'` with `import { getDb } from '@jemeka/db'`
- [ ] Replace `import { destinations, packages, bookings } from '@db/schema'` with `import { destinations, packages, bookings } from '@jemeka/db'`
- [ ] Run `npx tsc --noEmit` in `apps/api` to confirm no compile errors
- [ ] Run `vitest run` in `apps/api` to confirm all tests pass

### T07 · Expand test coverage for critical paths
- [ ] Add test: `booking.create` returns 401 when called without session (after T03)
- [ ] Add test: `booking.list` returns 403 when called by non-admin user
- [ ] Add test: `enquiry.create` stores record with correct status `"new"`
- [ ] Add test: `enquiry.list` returns 403 when called by non-admin user
- [ ] Add test: `destination.list` returns only active destinations
- [ ] Add test: `package.getBySlug` throws when slug does not exist
- [ ] Verify all new tests pass with `vitest run`

### T08 · Remove dead code
- [ ] Delete `apps/api/src/kimi/auth.ts`
- [ ] Delete `apps/api/src/kimi/platform.ts`
- [ ] Delete `apps/api/src/kimi/session.ts`
- [ ] Delete `apps/api/src/kimi/types.ts`
- [ ] Delete `apps/api/src/kimi/` directory
- [ ] Delete `apps/api/src/queries/users.ts`
- [ ] Delete `packages/ui/src/components/AuthLayout.tsx`
- [ ] Delete `packages/ui/src/components/AuthLayoutSkeleton.tsx`
- [ ] Open `apps/api/src/lib/env.ts` and remove: `appId`, `appSecret`, `kimiAuthUrl`, `kimiOpenUrl`, `ownerUnionId`
- [ ] Add `frontendUrl: required("FRONTEND_URL")` to `env` in `apps/api/src/lib/env.ts`
- [ ] Run `npm run build --workspace=apps/api` and verify no import errors
- [ ] Search for any remaining imports of deleted files and remove them

### T09 · Resolve broken image paths
- [ ] Audit all `Image src=` and `img src=` attributes across `apps/web/src/`
- [ ] Create directory structure: `apps/web/public/images/destinations/` and `apps/web/public/images/packages/`
- [ ] For each missing image path, create a placeholder SVG (solid color with destination/package name as text) at the expected path
- [ ] Required destination images: `serengeti.jpg`, `masai-mara.jpg`, `zanzibar.jpg`, `victoria-falls.jpg`, `cape-town.jpg`, `kruger.jpg`, `marrakech.jpg`, `santorini.jpg`
- [ ] Required package images: `serengeti-classic.jpg`, `mara-migration.jpg`, `zanzibar-beach.jpg`, `kruger-safari.jpg`, `santorini-escape.jpg`, `east-africa-circuit.jpg`, `vicfalls-adventure.jpg`, `cape-town.jpg`, `morocco-culture.jpg`, `family-safari.jpg`
- [ ] Required page hero images: `about-hero.jpg`, `packages-hero.jpg`
- [ ] Replace the `login/page.tsx` Google favicon URL with a local SVG file at `public/google-icon.svg`
- [ ] Verify all pages render images without 404s

---

## Phase 2 — Security Hardening

### T10 · Convert admin page to Server Component with middleware guard
- [ ] Create `apps/web/src/middleware.ts` with the auth guard from the design doc
- [ ] Add `export const config = { matcher: ["/admin/:path*"] }` to the middleware
- [ ] Open `apps/web/src/app/admin/page.tsx`
- [ ] Remove `"use client"` directive
- [ ] Import `auth` from `@/auth` and `redirect` from `next/navigation`
- [ ] Add `const session = await auth()` at the top of the component
- [ ] Add redirect if `!session || session.user?.role !== "admin"`
- [ ] Replace `trpc.*` hooks with `trpcServer.*` query calls
- [ ] Replace `useMutation` for status updates with Server Actions or a dedicated form component
- [ ] Remove `useSession` and `status === "loading"` guard
- [ ] Verify admin page requires login before rendering any content

### T11 · Add rate limiting
- [ ] Install `hono-rate-limiter` in `apps/api`: `npm install hono-rate-limiter --workspace=apps/api`
- [ ] Open `apps/api/src/index.ts`
- [ ] Import and configure `rateLimiter` middleware (10 requests per 60 seconds per IP)
- [ ] Apply limiter to `/api/trpc/*` route before the tRPC handler
- [ ] Test: send 11 rapid requests and verify the 11th returns 429
- [ ] Verify `Retry-After` header is present in 429 response

### T12 · Harden CORS configuration
- [ ] Open `apps/api/src/index.ts`
- [ ] Replace `process.env.FRONTEND_URL ?? ""` with `env.frontendUrl` (after T08 adds it to env)
- [ ] Verify the server throws at startup if `FRONTEND_URL` is not set in production
- [ ] Test: send a request from a non-allowed origin and verify it is rejected

### T13 · Add HTTP security headers
- [ ] Open `apps/api/src/index.ts`
- [ ] Import `secureHeaders` from `hono/secure-headers`
- [ ] Add `app.use("*", secureHeaders({ ... }))` before the CORS middleware with the headers from the design doc
- [ ] Verify headers appear on responses using `curl -I http://localhost:4000/health`
- [ ] Remove the unused `jwtVerify` import from `apps/api/src/middleware.ts`
- [ ] Remove the `const AUTH_SECRET = process.env.AUTH_SECRET` line from `middleware.ts` since it is not used

---

## Phase 3 — Quality, Performance & CI

### T14 · Fix CI pipeline
- [ ] Update `.github/workflows/ci.yml` with the revised workflow from the design doc
- [ ] Add separate `quality` and `e2e` jobs
- [ ] Replace `npm install` with `npm ci`
- [ ] Add `tsc --noEmit` steps for both `apps/api` and `apps/web`
- [ ] Add Drizzle migration check step using `drizzle-kit check`
- [ ] Fix Playwright `webServer` to use `npm run start` (production build) with `reuseExistingServer: false` in CI
- [ ] Replace root `test` script: use `npm-run-all --parallel test:api test:web` or a sequential script that propagates failures
- [ ] Add `fail-fast: false` to matrix if used, or ensure individual job failures block the overall run
- [ ] Test: create a PR with a deliberate type error and verify CI blocks the merge

### T15 · Add server-side caching
- [ ] Open `apps/web/src/app/destinations/page.tsx`
- [ ] Wrap the `trpcServer.destination.list.query(...)` call with `unstable_cache`
- [ ] Set `revalidate: 3600` and `tags: ["destinations"]`
- [ ] Open `apps/web/src/app/packages/page.tsx`
- [ ] Wrap both `trpcServer.package.list.query(...)` and `trpcServer.package.categories.query()` with `unstable_cache`
- [ ] Open `apps/web/src/app/page.tsx`
- [ ] Wrap `destination.featured.query()` and `package.featured.query()` with `unstable_cache`
- [ ] Test: verify the second page load is served from cache (no DB queries) using Pino logs

### T16 · Add pagination to admin list endpoints
- [ ] Update `booking-router.ts` `list` to accept `limit` (default 20, max 100) and `cursor` inputs
- [ ] Return `{ items, nextCursor }` from `booking.list`
- [ ] Update `enquiry-router.ts` `list` with same pagination pattern
- [ ] Update `admin/page.tsx` (after T10) to handle `{ items, nextCursor }` response shape
- [ ] Add "Load More" button in the admin bookings and enquiries tables
- [ ] Bound `testimonial.list` and `blog.list` limits to a maximum of 100

### T17 · Configure Next.js image optimization
- [ ] Open `apps/web/next.config.ts`
- [ ] Add `images: { remotePatterns: [{ protocol: "https", hostname: "**.strapi.io" }, { protocol: "https", hostname: "res.cloudinary.com" }] }` 
- [ ] Verify `npm run build --workspace=apps/web` passes

### T18 · Migrate to design tokens
- [ ] Open `packages/config/tailwind.config.js`
- [ ] Add `brand` colors: `navy: "#0F4C75"`, `teal: "#2A9D8F"`, `orange: "#F4A261"`, `dark: "#264653"`, `coral: "#E76F51"`
- [ ] Verify `fontFamily.heading` already exists; if not, add it
- [ ] In ALL `apps/web/src/` files: replace `bg-[#0F4C75]` with `bg-brand-navy`
- [ ] Replace `text-[#264653]` with `text-brand-dark`
- [ ] Replace `text-[#F4A261]` with `text-brand-orange`
- [ ] Replace `text-[#2A9D8F]` with `text-brand-teal`
- [ ] Replace `text-[#E76F51]` with `text-brand-coral`
- [ ] In ALL heading elements: replace `style={{ fontFamily: 'var(--font-heading)' }}` with `className` that includes `font-heading`
- [ ] In `packages/ui/src/` files: apply the same token replacements
- [ ] Verify visual appearance is unchanged after the refactor

### T19 · Complete any remaining `any` type cleanup
- [ ] Run `grep -r ": any" apps/web/src apps/api/src packages/ui/src` and record all remaining instances
- [ ] Resolve each remaining `any` with proper types
- [ ] Ensure `vitest run` and `npm run build` both pass after cleanup

### T20 · Wire authentication state into Navbar
- [ ] Open `packages/ui/src/components/Navbar.tsx`
- [ ] Replace mock auth state with `useSession()` from `next-auth/react`
- [ ] Show user name and "Logout" button when `status === "authenticated"`
- [ ] Show "Sign In" button when `status === "unauthenticated"`
- [ ] Show skeleton when `status === "loading"`
- [ ] Show "Admin" link when `session.user.role === "admin"`
- [ ] Wire logout to `signOut()` from `next-auth/react`
- [ ] Test: log in, verify name and logout appear; log out, verify "Sign In" returns

### T21 · Add error boundaries
- [ ] Create `apps/web/src/app/error.tsx` (global error boundary) per design doc
- [ ] Create `apps/web/src/app/destinations/[slug]/error.tsx` with "Back to Destinations" link
- [ ] Create `apps/web/src/app/packages/[slug]/error.tsx` with "Back to Packages" link
- [ ] Test: trigger an intentional error in a page component and verify the boundary catches it

---

## Phase 4 — Business Features & Observability

### T22 · Booking confirmation email
- [ ] Create `apps/api/src/emails/BookingConfirmationEmail.tsx` as a React Email component
- [ ] Component props: `bookingReference: string`, `packageTitle: string`, `travelDate: string`, `adults: number`, `children: number`, `totalPrice: string`, `customerName: string`
- [ ] Style consistently with `MagicLinkEmail.tsx` (brand colors, same header)
- [ ] Open `apps/api/src/booking-router.ts`
- [ ] After successful `db.insert(bookings)`, add fire-and-forget Resend email call
- [ ] Wrap in try/catch; log failures via `logger.error` but do NOT rethrow
- [ ] Add `AUTH_RESEND_KEY` to `apps/api/.env.example`
- [ ] Test: submit a booking and verify confirmation email is received

### T23 · Improve health check endpoint
- [ ] Open `apps/api/src/index.ts`
- [ ] Update `GET /health` handler to run `db.run(sql`SELECT 1`)` (or equivalent)
- [ ] Return `200 { ok: true, db: "connected", ts: Date.now() }` on success
- [ ] Return `503 { ok: false, db: "disconnected", error: string }` on failure
- [ ] Add a 2000ms timeout to the database probe
- [ ] Test: `curl http://localhost:4000/health` returns connected status
- [ ] Test: with invalid `DATABASE_URL`, verify `/health` returns 503

### T24 · Environment validation for web app
- [ ] Install `@t3-oss/env-nextjs` in `apps/web`
- [ ] Create `apps/web/src/env.ts` validating: `NEXT_PUBLIC_API_URL`, `AUTH_RESEND_KEY`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `NEXT_PUBLIC_APP_URL`
- [ ] Import `env` from `@/env` in any file that currently reads these variables directly from `process.env`
- [ ] Verify the app throws a clear error at startup when a required variable is missing

### T25 · Turso production database configuration
- [ ] Add `DATABASE_AUTH_TOKEN: required("DATABASE_AUTH_TOKEN")` to `apps/api/src/lib/env.ts`
- [ ] Update `packages/db/src/index.ts` `getDb()` to pass `authToken` when `DATABASE_URL` starts with `libsql://`
- [ ] Add `DATABASE_AUTH_TOKEN=` to `apps/api/.env.example`
- [ ] Update `README.md` with instructions for connecting to Turso in production

### T26 · Move hardcoded contact details to config
- [ ] Create `apps/web/src/config/contact.ts` exporting phone number and email from environment variables with fallback
- [ ] Update `packages/ui/src/components/Footer.tsx` to import from contact config
- [ ] Update `apps/web/src/app/contact/page.tsx` to import from contact config
- [ ] Add `NEXT_PUBLIC_CONTACT_EMAIL` and `NEXT_PUBLIC_CONTACT_PHONE` to `.env.example`

---

## Phase 5 — Accessibility

### T27 · Add skip-navigation link
- [ ] Open `apps/web/src/app/layout.tsx`
- [ ] Add skip link as the first child inside `<body>` (see design doc for exact markup)
- [ ] Open `packages/ui/src/components/Layout.tsx`
- [ ] Add `id="main-content"` to the `<main>` element
- [ ] Test with keyboard: press Tab immediately after page load, verify skip link appears and activates

### T28 · Fix Navbar hamburger ARIA
- [ ] Open `packages/ui/src/components/Navbar.tsx`
- [ ] Add `aria-label="Open menu"` to the `<SheetTrigger>` button
- [ ] Add `aria-expanded` state that mirrors the sheet open state
- [ ] When the sheet is open, update `aria-label` to `"Close menu"`
- [ ] Test with screen reader: verify button is announced as "Open menu, button"

### T29 · Fix focus management in booking form
- [ ] Open `apps/web/src/app/packages/[slug]/PackageDetailClient.tsx`
- [ ] Create `const travelDateRef = useRef<HTMLInputElement>(null)`
- [ ] Attach `ref={travelDateRef}` to the travel date `<Input>`
- [ ] Replace `onClick={() => setShowBookingForm(true)}` with a handler that sets state AND calls `setTimeout(() => travelDateRef.current?.focus(), 50)`
- [ ] Test: open booking form with keyboard only, verify focus moves to travel date field

### T30 · Fix star rating button accessibility
- [ ] Open `apps/web/src/app/testimonials/page.tsx`
- [ ] Add `aria-label={`Rate ${star} out of 5 stars`}` to each star rating `<button>`
- [ ] Add `aria-pressed={star <= formData.rating}` to indicate current selection
- [ ] Test with screen reader: verify each button is announced with its label

### T31 · Add `prefers-reduced-motion` support
- [ ] Open `apps/web/src/app/HomeClient.tsx`
- [ ] Import `useReducedMotion` from `framer-motion`
- [ ] Call `const prefersReducedMotion = useReducedMotion()` at the top of the component
- [ ] Update `containerVariants` and `itemVariants` to use `transition: { duration: 0 }` when `prefersReducedMotion` is true
- [ ] Apply the same pattern to `PackageDetailClient.tsx`, `DestinationDetailClient.tsx`, and `about/page.tsx`
- [ ] Test: enable "Reduce Motion" in OS accessibility settings and verify animations do not play

### T32 · Form error accessibility
- [ ] Create a reusable `<FormError id="..." message="...">` component that renders an `aria-live="polite"` region
- [ ] Update the booking form in `PackageDetailClient.tsx` to display field-level errors with `aria-describedby` linked to the error component id
- [ ] Update the contact form in `contact/page.tsx` with the same pattern
- [ ] Update the testimonial form in `testimonials/page.tsx` with the same pattern

---

## Completion Checklist

Before marking this spec complete, verify:

- [ ] `npm run build --workspace=apps/web` passes with zero type errors and zero lint errors
- [ ] `npm run build --workspace=apps/api` passes
- [ ] `vitest run` in `apps/api` passes (all tests green)
- [ ] All referenced image paths in `public/` exist
- [ ] Unauthenticated POST to `booking.create` returns 401
- [ ] Requesting `/admin` without a session redirects to `/login`
- [ ] All timestamp columns contain accurate per-row timestamps
- [ ] No `kimi/` directory exists in `apps/api/src/`
- [ ] No `import ... from './queries/connection'` remains
- [ ] No `style={{ fontFamily: 'var(--font-heading)' }}` inline styles remain
- [ ] No `bg-[#0F4C75]` arbitrary color classes remain
- [ ] `/health` endpoint returns `{ db: "connected" }` when database is reachable
- [ ] Skip navigation link is the first focusable element on every page
- [ ] All Framer Motion animations are disabled when OS reduced-motion is enabled
- [ ] CI pipeline blocks PRs on type errors, lint errors, and test failures

## Notes

- Tasks within the same wave can be executed in parallel.
- Wave 1 tasks (T01, T04, T08, T09) are fully independent and should be completed first as they unblock later phases.
- T03 (secure booking) must complete before T22 (booking email) since the email flow depends on the authenticated booking creation path.
- T10 (admin page Server Component conversion) must complete before T16 (pagination) since T16 updates the admin page UI.
- All type-related tasks (T02, T19) depend on T01 (re-enabling the build checks) to surface the full list of errors.
- The accessibility wave (T27–T32) is intentionally last since it requires a stable, feature-complete UI to test against.
