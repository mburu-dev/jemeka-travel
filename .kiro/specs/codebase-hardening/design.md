# Design: Jemeka Tours Codebase Hardening

## Overview

This document describes the technical design for each phase of the hardening work. It maps requirements to concrete file changes, new modules, and architectural decisions.

---

## Architecture

The Jemeka Tours codebase is a monorepo with three main applications and shared packages:

- **`apps/web`** — Next.js 15 App Router frontend (React 19, Tailwind CSS 4, shadcn/ui)
- **`apps/api`** — Hono-based tRPC API server (Node.js, Drizzle ORM, Pino)
- **`apps/cms`** — Strapi 5 CMS instance (currently unused)
- **`packages/db`** — Drizzle ORM schema, migrations, and database client (libSQL/Turso)
- **`packages/ui`** — Shared React component library (Navbar, Footer, Layout)
- **`packages/config`** — Shared Tailwind and tooling configuration
- **`packages/contracts`** — Shared TypeScript constants

The hardening work operates across all layers. Changes are intentionally isolated to avoid cross-cutting regressions. The auth flow uses Auth.js v5 with a Drizzle adapter; sessions are stored in SQLite and verified on the API via database lookup.

---

## Components and Interfaces

| Component | Location | Change |
|---|---|---|
| `next.config.ts` | `apps/web` | Remove build error suppression; add image remote patterns |
| `middleware.ts` | `apps/web/src` | NEW: auth guard for `/admin` routes |
| `admin/page.tsx` | `apps/web/src/app/admin` | Convert to Server Component; use `trpcServer` |
| `booking-router.ts` | `apps/api/src` | Gate `create` and `getByReference` behind `authedQuery` |
| `lib/booking-ref.ts` | `apps/api/src/lib` | NEW: extracted `generateBookingRef()` |
| `lib/env.ts` | `apps/api/src/lib` | Remove Kimi vars; add `frontendUrl` |
| `schema.ts` | `packages/db/src` | Fix `.$defaultFn()` on all timestamp columns |
| `tailwind.config.js` | `packages/config` | Add `brand.*` color tokens and `font-heading` utility |
| `Navbar.tsx` | `packages/ui/src/components` | Wire `useSession()` for real auth state |
| `BookingConfirmationEmail.tsx` | `apps/api/src/emails` | NEW: React Email transactional template |
| `error.tsx` | `apps/web/src/app` | NEW: Global Next.js error boundary |

---

## Data Models

All tables are defined in `packages/db/src/schema.ts` using Drizzle ORM with SQLite/Turso.

**`bookings`** — After hardening, `userId` will be set from the authenticated session context at creation time. `createdAt` and `updatedAt` will use `.$defaultFn(() => new Date())`.

**`users`** — Managed by Auth.js DrizzleAdapter. Contains `id`, `email`, `name`, `role` (`"user"` | `"admin"`).

**`destinations`** — `slug` (unique), `name`, `region` (enum), `isActive`, corrected `createdAt`/`updatedAt`.

**`packages`** — `destinationId` FK, `slug` (unique), `price` (text for decimal precision), corrected `createdAt`/`updatedAt`.

**Timestamp fix** — All `createdAt`/`updatedAt` columns across all 7 tables will be updated from `.default(new Date())` (module-load constant) to `.$defaultFn(() => new Date())` (per-row factory function).

---

## Correctness Properties

### Property 1: Booking ownership is enforced

For any call to `booking.getByReference` where the caller is not an admin, the result is either the caller's own booking or a FORBIDDEN error — never another user's booking data.

**Validates: Requirements 4.4, 4.5**

### Property 2: Timestamp defaults produce per-row values

For any two rows inserted into any table, their `createdAt` values reflect the actual wall-clock time of each respective insert, not a shared constant from module load time.

**Validates: Requirements 3.1, 3.2**

### Property 3: Rate limiter enforces request cap

For any IP address, sending more than 10 requests to `/api/trpc/*` within a 60-second window results in HTTP 429 for all requests beyond the 10th, with a `Retry-After` header present.

**Validates: Requirements 8.2, 8.3**

### Property 4: Required env vars cause startup failure

For any environment variable declared via `required("VAR_NAME")`, if that variable is absent at process start in production, the server throws before accepting any connections.

**Validates: Requirement 9.2**

---

## Error Handling

- **Email send failures** are fire-and-forget: logged via `logger.error` but never thrown to the client. The booking record is always saved regardless of email outcome.
- **Database probe failures** in `/health` return HTTP 503 with `{ ok: false, db: "disconnected", error: string }`.
- **Missing required env vars** throw at startup with a descriptive message indicating which variable is absent.
- **Auth failures** on protected tRPC procedures return `TRPCError({ code: "UNAUTHORIZED" })` or `"FORBIDDEN"` as appropriate.
- **Rate limit breaches** return HTTP 429 with a `Retry-After` header.
- **Error boundaries** in Next.js catch rendering exceptions and display a user-facing recovery UI, logging the original error via `console.error`.

---

## Testing Strategy

- **Unit tests** (`vitest`) in `apps/api/src/` cover `generateBookingRef`, booking creation with auth enforcement, booking retrieval with ownership checks, and enquiry creation.
- **Integration tests** (`vitest`) use a fresh SQLite database via `test-utils.ts` to exercise the full tRPC router stack.
- **E2E tests** (`playwright`) in `apps/web/tests/` cover the booking flow end-to-end, admin login redirect, and key accessibility paths.
- **CI** runs lint → typecheck → unit tests → migration check → E2E in a two-job pipeline (`quality` then `e2e`), blocking PRs on any failure.
- **Manual accessibility testing** is required for full WCAG 2.1 AA compliance; automated axe-core checks supplement but do not replace manual review.

---

## 1. Build Configuration (Req 1, 2)

**Change:** Remove suppression flags from `apps/web/next.config.ts`.

```ts
// BEFORE
typescript: { ignoreBuildErrors: true },
eslint: { ignoreDuringBuilds: true },

// AFTER — remove both keys entirely
const nextConfig: NextConfig = {};
export default nextConfig;
```

**Type resolution strategy:**

All `any` types will be replaced by importing Drizzle inferred types directly from `@jemeka/db`:

```ts
import type { Package, Destination, Booking } from "@jemeka/db";

// Package with joined destination
type PackageWithDestination = Package & { destination?: Destination | null };
```

---

## 2. Schema Timestamp Fix (Req 3)

**Change in `packages/db/src/schema.ts`:**

```ts
// BEFORE
createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()).notNull(),
updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()).notNull(),

// AFTER
createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
```

**`updatedAt` in mutations** — add a reusable helper:

```ts
// packages/db/src/utils.ts (new file)
export const withUpdatedAt = () => ({ updatedAt: new Date() });
```

Usage in routers:
```ts
db.update(bookings).set({ ...updates, ...withUpdatedAt() }).where(eq(bookings.id, input.id));
```

After schema change: run `drizzle-kit generate` to produce the new migration, commit it.

---

## 3. Secure Booking (Req 4)

**Change in `apps/api/src/booking-router.ts`:**

```ts
create: authedQuery
  .input(z.object({ ... }))
  .mutation(async ({ input, ctx }) => {
    return db.insert(bookings).values({
      ...input,
      userId: ctx.user.id,  // associate with authenticated user
      bookingReference,
    });
  }),

getByReference: authedQuery
  .input(z.object({ reference: z.string() }))
  .query(async ({ input, ctx }) => {
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.bookingReference, input.reference),
    });
    if (!booking) return null;
    if (booking.userId !== ctx.user.id && ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return booking;
  }),
```

**Frontend change:** `PackageDetailClient.tsx` — if user is not authenticated, show "Sign in to book" prompt redirecting to `/login?callbackUrl=/packages/[slug]`.

---

## 4. Server-Side Admin Guard (Req 5)

**New file: `apps/web/src/middleware.ts`**

```ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${nextUrl.pathname}`, req.url));
    }
    if (session.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = { matcher: ["/admin/:path*"] };
```

**`admin/page.tsx`** — convert to a Server Component using `trpcServer` for data fetching.

---

## 5. Test Fixes (Req 6)

**New file: `apps/api/src/lib/booking-ref.ts`**

```ts
export function generateBookingRef(): string {
  const prefix = "JMK";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}
```

**`booking.integration.test.ts`** — fix imports:
```ts
import { getDb, destinations, packages, bookings } from "@jemeka/db";
// Remove: import { getDb } from './queries/connection';
// Remove: import { ... } from '@db/schema';
```

---

## 6. Dead Code Removal (Req 7)

Files to delete:
- `apps/api/src/kimi/` (entire directory)
- `apps/api/src/queries/users.ts`
- `packages/ui/src/components/AuthLayout.tsx`
- `packages/ui/src/components/AuthLayoutSkeleton.tsx`

`apps/api/src/lib/env.ts` — remove Kimi-specific variables; add `frontendUrl: required("FRONTEND_URL")`.

---

## 7. Rate Limiting (Req 8)

```ts
// apps/api/src/index.ts
import { rateLimiter } from "hono-rate-limiter";

app.use("/api/trpc/*", rateLimiter({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-6",
  keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "unknown",
}));
```

---

## 8. Security Headers (Req 10)

```ts
// apps/api/src/index.ts
import { secureHeaders } from "hono/secure-headers";

app.use("*", secureHeaders({
  xContentTypeOptions: "nosniff",
  xFrameOptions: "DENY",
  strictTransportSecurity: "max-age=63072000; includeSubDomains",
  contentSecurityPolicy: { defaultSrc: ["'none'"], connectSrc: ["'self'"] },
}));
```

---

## 9. CI Pipeline (Req 11)

Two-job workflow: `quality` (lint, typecheck, unit tests, migration check) then `e2e` (Playwright). Uses `npm ci`, `tsc --noEmit`, `drizzle-kit check`, and a proper `webServer` start-and-wait block.

---

## 10. Caching (Req 12)

```ts
// Wrap tRPC server calls with unstable_cache in server page components
const getCachedDestinations = unstable_cache(
  async (region?: string) => trpcServer.destination.list.query(...),
  ["destinations-list"],
  { revalidate: 3600, tags: ["destinations"] }
);
```

Apply to `destinations/page.tsx`, `packages/page.tsx`, and `page.tsx` (home).

---

## 11. Pagination (Req 13)

Return `{ items, nextCursor }` from all admin list endpoints. Use cursor-based pagination with `limit + 1` fetch pattern:

```ts
list: adminQuery
  .input(z.object({ limit: z.number().min(1).max(100).default(20), cursor: z.number().optional() }))
  .query(async ({ input }) => {
    const rows = await db.query.bookings.findMany({
      orderBy: [desc(bookings.createdAt)],
      limit: input.limit + 1,
      where: input.cursor ? lt(bookings.id, input.cursor) : undefined,
    });
    const hasMore = rows.length > input.limit;
    return { items: hasMore ? rows.slice(0, -1) : rows, nextCursor: hasMore ? rows[input.limit - 1].id : null };
  }),
```

---

## 12. Image Assets (Req 14)

Create `public/images/destinations/` and `public/images/packages/` directories. For missing images, commit solid-color SVG placeholders at the exact paths referenced in seed data and components. Configure `images.remotePatterns` in `next.config.ts`.

---

## 13. Design Tokens (Req 15)

```js
// packages/config/tailwind.config.js
extend: {
  colors: {
    brand: { navy: "#0F4C75", teal: "#2A9D8F", orange: "#F4A261", dark: "#264653", coral: "#E76F51" }
  },
  fontFamily: { heading: ["var(--font-heading)", "sans-serif"] }
}
```

Replace all arbitrary color classes and inline font styles throughout the codebase.

---

## 14. Booking Confirmation Email (Req 16)

New `apps/api/src/emails/BookingConfirmationEmail.tsx` React Email component. Triggered fire-and-forget after successful booking insert. Email send failures are caught and logged, never thrown.

---

## 15. Accessibility (Req 19)

- Skip link as first child of `<body>`; `id="main-content"` on `<main>`
- `aria-label` on hamburger button with toggle state
- `useRef` + `focus()` on booking form reveal
- `aria-label` + `aria-pressed` on star rating buttons
- `useReducedMotion()` guard on all Framer Motion components
- `aria-describedby` + `aria-live` for form validation errors

---

## 16. Error Boundaries (Req 20)

Create `error.tsx` files in `apps/web/src/app/`, `destinations/[slug]/`, and `packages/[slug]/`. Each renders a user-friendly recovery UI and logs the error.
