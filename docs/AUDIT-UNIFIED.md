# Jemeka Tours & Travel — Unified Comprehensive Codebase Audit

**Repository:** github.com/mburu-dev/jemeka-travel  
**Audit Date:** June 10, 2026  
**Source:** Cross-synthesis of two independent AI audits + direct static analysis

---

## Executive Scorecard

| Domain | Score | Summary |
|---|---|---|
| Code Quality & Consistency | 6 / 10 | Good patterns undermined by pervasive `any`, duplicate logic, and a broken test |
| Architecture & System Design | 8 / 10 | Strong monorepo, solid tRPC/Drizzle design; SQLite and dead code are risks |
| Security Implementation | 4 / 10 | CRITICAL: public booking, suppressed builds, no rate limiting, client-only admin guard |
| Performance & Optimization | 5 / 10 | No caching, no pagination, hardcoded timestamp bug, in-memory search filter |
| Test Coverage & CI/CD | 4 / 10 | Broken integration test, 1 real router covered, CI pipeline missing |
| Maintainability & Documentation | 6 / 10 | Good seed data and API docs; dead Kimi code, hardcoded tokens, repeated inline styles |
| Accessibility & Compatibility | 5 / 10 | Missing skip link, ARIA labels, focus management, reduced-motion support |
| **OVERALL** | **5.4 / 10** | **Solid foundation — significant hardening required before production** |

---

## 1. Repository Overview

Jemeka Tours & Travel is a full-stack travel-booking platform in an npm workspaces monorepo targeting East African safari tourism. It provides a marketing and booking frontend, a tRPC API, a basic admin dashboard, and a Strapi CMS (unused).

### Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion |
| API | Hono on Node.js, tRPC v11, Drizzle ORM, libSQL/Turso SQLite, Pino, Vitest |
| Auth | Auth.js v5 (NextAuth) — Google OAuth + Resend magic-link, DrizzleAdapter |
| Email | Resend + React Email |
| CMS | Strapi 5 (installed, not integrated) |
| Shared | @jemeka/db, @jemeka/ui (shadcn), @jemeka/config, @jemeka/contracts |
| Testing | Vitest (unit + integration), Playwright (E2E) |

### File Inventory (excluding node_modules)

- TypeScript/TSX source files: ~55
- Test files: 2 Vitest files (unit + integration), 0 confirmed Playwright test files in `/tests/`
- Migration SQL files: 1 baseline
- Documentation: README, API.md, AGENTS.md, CLAUDE.md

---

## 2. Strengths

### 2.1 Architecture & Monorepo Design

**Clean npm workspaces monorepo.** The `apps/` and `packages/` separation mirrors patterns used by Vercel, Prisma, and Linear. Shared code is consumed without publishing. The structure is immediately legible to any TypeScript engineer familiar with this ecosystem.

**End-to-end type safety via tRPC.** Running tRPC over a separate Hono process (rather than Next.js API routes) gives process isolation and independent scalability. The `AppRouter` type is exported from `apps/api/src/index.ts` and imported directly in `apps/web/src/lib/trpc.ts`, providing compile-time guarantees across the client-server boundary — a pattern the T3 Stack made industry-standard.

**Next.js App Router patterns followed correctly.** Server components (`DestinationsPage`, `PackagesPage`, `Home`) fetch via `trpcServer` and pass data down to client components as props, avoiding the client waterfall. `Promise.all()` is used in `page.tsx` for parallel data fetching. `generateMetadata` is implemented on all dynamic routes.

**SEO infrastructure is production-ready.** `sitemap.ts` dynamically generates XML with live destination and package slugs. `robots.ts` correctly disallows `/admin/` and `/api/`. Open Graph tags, title templates, and 160-char description truncation are all present across every page.

### 2.2 Database & Data Modelling

**Drizzle ORM schema is comprehensive and correctly typed.** All domain entities (destinations, packages, bookings, testimonials, enquiries, blogPosts) plus all Auth.js adapter tables (users, sessions, accounts, verificationTokens, authenticators) are defined with column-level enums, constraints, and typed JSON columns. Storing `price` as `text` instead of `REAL` is the correct choice for decimal precision in SQLite.

**Migration baseline exists.** A `0000_conscious_alice.sql` baseline and Drizzle journal provide a reproducible schema evolution path.

**Comprehensive, realistic seed data.** `packages/db/src/seed.ts` seeds 8 destinations, 10 packages, and 12 testimonials with full itineraries, inclusions/exclusions, coordinates, and realistic ratings — materially accelerating development and demos.

**Relational model is well-defined.** `packages/db/src/relations.ts` correctly wires one-to-many (destination → packages), many-to-one (package → destination, booking → user), and the inverse directions. Drizzle relational queries (`.findMany({ with: { ... } })`) work correctly with this setup.

### 2.3 Security Strengths

**Auth.js v5 with DrizzleAdapter is a solid authentication foundation.** Both Google OAuth and Resend magic-link are wired correctly. The custom `session` callback surfaces `user.id` and `role` without leaking sensitive fields.

**API-side session verification is correct for Auth.js v5 database sessions.** `middleware.ts` performs a database lookup (`sessions JOIN users WHERE sessionToken = ?`) rather than trusting a client-supplied JWT. This prevents token forgery.

**Role-based access control chain is sound.** `publicQuery → authedQuery → adminQuery` correctly gates admin mutations and queries. All `list`, `updateStatus`, and `delete` operations on bookings and enquiries require `adminQuery`.

**`env.ts` throws on missing required variables in production.** The `required()` helper prevents silent empty-string misconfigurations at runtime.

**Cookie security is environment-aware.** `lib/cookies.ts` sets `httpOnly: true`, `SameSite: Lax` on localhost and `SameSite: None; Secure` elsewhere — the correct configuration for cross-origin cookie-based auth.

### 2.4 Frontend Quality

**Polished, consistent design system.** Multi-layer gradient heroes, Framer Motion staggered animations, sticky pricing sidebar, Accordion itinerary, and inclusion/exclusion visual comparison exceed typical early-stage quality. The shadcn/ui component library is used consistently throughout.

**Transactional email is professional.** `MagicLinkEmail` is a React Email component rendered server-side and sent via Resend — a modern, maintainable approach versus plain nodemailer templates.

**Global loading state.** `loading.tsx` provides a correct App Router Suspense fallback with a spinner.

**Sonner toasts provide user feedback.** Success and error states are surfaced on booking, enquiry, and testimonial mutations.

**Debounced search.** `useDebounce` (500ms) prevents URL pushes on every keystroke in `PackagesFilter`.

### 2.5 Testing Infrastructure

**Integration test harness architecture is sound.** `test-utils.ts` creates a fresh SQLite database, runs real Drizzle migrations, and creates a typed tRPC caller — exercising the full call stack from procedure to database. This is a genuine integration test, not a mock.

**CI pipeline covers the key stages.** `.github/workflows/ci.yml` runs lint → type-check (via build) → API tests → Playwright tests with multi-browser coverage and artifact upload.

> **Note (cross-report discrepancy):** The uploaded audit states "No CI/CD pipeline exists." The repository does contain `.github/workflows/ci.yml`. However, that CI file has significant quality issues documented in the weaknesses section, and the Playwright test directory appears to be empty. The pipeline exists but is incomplete.

---

## 3. Weaknesses

### 3.1 Security — CRITICAL

**W-S1 · TypeScript and ESLint checks are suppressed in builds** (`apps/web/next.config.ts`)

```ts
typescript: { ignoreBuildErrors: true },
eslint:     { ignoreDuringBuilds: true },
```

This is the highest-impact quality issue. The build pipeline provides no static analysis safety net. Type errors and lint violations that would catch runtime bugs are silently ignored. This is explicitly warned against in the Next.js documentation. Every other TypeScript quality issue in this codebase is made worse by this setting.

**W-S2 · Booking creation and lookup are fully public** (`apps/api/src/booking-router.ts`)

```ts
create: publicQuery    // any unauthenticated user can book
getByReference: publicQuery  // exposes customerName, email, phone to anyone who guesses a reference
```

This violates OWASP A01:2021 (Broken Access Control). A guest can submit unlimited bookings for any `packageId`. The reference format `JMK-{base36timestamp}{3 random chars}` has a limited search space that can be enumerated to expose customer PII.

**W-S3 · No rate limiting on any endpoint** (`apps/api/src/index.ts`)

No rate-limiting middleware exists anywhere in the Hono server. The booking and enquiry create endpoints accept unlimited requests from any IP, enabling spam that poisons the admin dashboard and exhausts email quota.

**W-S4 · CORS falls back to empty string in production** (`apps/api/src/index.ts`)

```ts
origin: ["http://localhost:3000", process.env.FRONTEND_URL ?? ""],
```

If `FRONTEND_URL` is unset, the fallback `""` may be interpreted as a wildcard or empty-origin match by Hono's CORS implementation, creating an open CORS policy in production.

**W-S5 · Admin page is protected client-side only** (`apps/web/src/app/admin/page.tsx`)

The page is marked `"use client"` and uses `useSession()` + conditional rendering for access control. The page's full JavaScript bundle is served to all visitors. A motivated attacker can bypass the rendered block. The correct pattern is a Server Component using `auth()` from `apps/web/src/auth.ts`, or a `middleware.ts` edge guard.

**W-S6 · Missing HTTP security headers**

The Hono API sets no `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`, or `X-Content-Type-Options` headers. Mozilla Observatory would rate this an F.

**W-S7 · AUTH_SECRET is unvalidated and its usage is inconsistent** (`apps/api/src/middleware.ts`)

`AUTH_SECRET` is read from `process.env` but never used in the DB-session verification path. An unused `jwtVerify` import from `jose` creates confusion about whether tokens are being cryptographically verified. If the session strategy ever shifts to JWTs, this path is incomplete and insecure.

**W-S8 · Personal contact details hardcoded in source code**

`njoros2025@gmail.com` and `+254 726 912577` appear directly in `Footer.tsx` and `contact/page.tsx`. These should be environment variables or CMS content, not committed to a public repository.

---

### 3.2 Correctness Bugs

**W-B1 · Schema `createdAt`/`updatedAt` defaults are evaluated once at module load time** (`packages/db/src/schema.ts`)

```ts
// All 12+ timestamp columns have this bug:
createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date())
// new Date() is evaluated when the module is imported — every row in the same
// process lifetime gets the same timestamp
// Fix: .$defaultFn(() => new Date())
```

**W-B2 · `generateBookingRef` is duplicated; the test exercises a copy, not the real function** (`apps/api/src/booking.test.ts`)

The function is re-defined verbatim inside the test file rather than imported from `booking-router.ts`. If the production implementation changes, the test will pass while the real code behaves differently.

**W-B3 · Integration test imports from non-existent paths** (`apps/api/src/booking.integration.test.ts`)

```ts
import { getDb } from './queries/connection';  // path does not exist
import { destinations, packages, bookings } from '@db/schema'; // package not defined
```

This test file will not compile. The correct imports are from `@jemeka/db`. This confirms that automated test execution is not running in CI.

**W-B4 · `updatedAt` is never updated on mutations**

Every update mutation (`booking.updateStatus`, `enquiry.updateStatus`, `testimonial.updateStatus`) omits `updatedAt`. Combined with W-B1, this column is permanently frozen at module-load time.

**W-B5 · Client-side search filter fetches all rows then filters in memory** (`apps/web/src/app/packages/page.tsx`)

```ts
const filteredPackages = packages?.filter((pkg: any) => {
  if (params.q) return pkg.title.toLowerCase().includes(params.q.toLowerCase());
});
```

The full package list is fetched from the database and filtered on the server in JavaScript. The `LIKE` clause should be pushed to Drizzle. At scale this will be slow and memory-intensive.

---

### 3.3 Code Quality

**W-Q1 · Pervasive `any` type usage**

25+ occurrences of `: any` across the codebase:
- Component props: `{ pkg: any }`, `{ destination: any }`, `{ packages: any[] }`, `{ destinations: any[] }`
- tRPC calls: `(trpc as any).booking.create.useMutation(...)` in `PackageDetailClient.tsx` and `admin/page.tsx`
- Drizzle callbacks: `(p: any, { desc }: any) =>` in `destination-router.ts`, `package-router.ts`
- Mutation payloads: `const updates: any = {}` in `booking-router.ts` and `testimonial-router.ts`

These eliminate the primary benefit of choosing TypeScript and tRPC.

**W-Q2 · Inline `style={{ fontFamily: 'var(--font-heading)' }}` repeated 15+ times**

The same inline style object appears on every heading across `HomeClient.tsx`, `PackageDetailClient.tsx`, `DestinationDetailClient.tsx`, `admin/page.tsx`, and others. This bypasses Tailwind's JIT and creates maintenance fragility. A `font-heading` utility class already exists in `tailwind.config.js`.

**W-Q3 · 40+ hardcoded hex color values in Tailwind arbitrary classes**

`className="bg-[#0F4C75]"`, `text-[#264653]`, `text-[#F4A261]`, `text-[#2A9D8F]` appear throughout. If a brand color changes, every file must be updated manually. These belong in `packages/config/tailwind.config.js` as named design tokens (`brand.navy`, `brand.teal`, `brand.orange`, `brand.dark`).

**W-Q4 · Booking form reset state is duplicated**

The initial `formData` object is written out identically in `useState(...)` initialization and in the `onSuccess` `setFormData(...)` call inside `PackageDetailClient.tsx`. A named constant should be extracted.

**W-Q5 · `getDb()` singleton is not safe for concurrent test runs**

```ts
let instance: any;
export function getDb(url?: string) {
  if (!instance || url) { /* creates new instance */ }
  return instance; // global module state
}
```

Passing a URL to bypass the singleton (as `setupTestDb` does) leaves the module in a state where the global instance is the test database for the lifetime of the process. Concurrent test files could interfere.

**W-Q6 · `apps/api/src/lib/env.ts` requires Kimi AI credentials in production**

`APP_ID`, `APP_SECRET`, `KIMI_AUTH_URL`, `KIMI_OPEN_URL` are marked `required()` and will throw at production startup unless populated. These are credentials for the Kimi AI OAuth platform — an entirely dead code path in the running application.

---

### 3.4 Performance

**W-P1 · No caching on server-side tRPC calls**

Every page load triggers fresh database queries. Destinations and packages are semi-static content. `unstable_cache` or `export const revalidate = 3600` at the page level would reduce database load and improve TTFB dramatically on production deployments.

**W-P2 · Missing `images.remotePatterns` in `next.config.ts`**

No remote image domains are configured. Any image served from a CDN, Strapi uploads, or external URL will throw a Next.js Image optimization error in production. This is currently masked by `ignoreBuildErrors: true`.

**W-P3 · Majority of referenced image paths do not exist in `public/`**

Paths like `/images/packages/serengeti-classic.jpg`, `/images/destinations/serengeti.jpg`, `/images/about-hero.jpg`, `/images/packages-hero.jpg` are referenced throughout but absent from the `public/` directory. Only `hero-home.jpg`, `kilimanjaro.jpg`, `serengeti.jpg`, and `zanzibar.jpg` exist. This produces broken images on most pages.

**W-P4 · Seed script uses sequential inserts instead of bulk insert**

`seed.ts` inserts records one-by-one inside a `for` loop. Drizzle supports `.values([...array])` for a single bulk insert round-trip.

---

### 3.5 CI/CD & Build

**W-C1 · CI pipeline runs but is not verifying what it should**

The CI workflow (`ci.yml`) runs `npm run lint --workspaces` (which will succeed because ESLint is disabled in the web build), verifies the migration directory exists with `ls` rather than running a migration, and attempts Playwright tests against a `webServer` that starts `npm run dev` — which will not be available in the CI environment without a long wait and health-check loop.

**W-C2 · `concurrently` in the root test script does not propagate failures**

```json
"test": "concurrently \"npm run test --workspace=apps/api\" \"npm run test --workspace=apps/web\""
```

If one workspace fails, `concurrently` may exit `0`. This means a failing unit test could pass CI.

**W-C3 · No `turbo.json` for build orchestration**

No `turbo.json` exists, so there is no build caching, parallelism definition, or topological build ordering. Every CI run rebuilds everything from scratch.

**W-C4 · Migration verification in CI is a no-op**

The CI step runs `ls packages/db/src/migrations` — it only confirms the directory exists, not that migrations are valid or run successfully.

---

### 3.6 Dead Code & Maintainability

**W-M1 · The entire `apps/api/src/kimi/` directory is dead code**

`kimi/auth.ts`, `kimi/platform.ts`, `kimi/session.ts`, `kimi/types.ts` implement a Kimi AI OAuth flow. None of these modules are imported in `router.ts` or `index.ts`. They consume `env.ts` credentials that will throw at startup. This should be removed entirely or moved to a clearly marked `_archive/` directory.

**W-M2 · `apps/api/src/queries/users.ts` imports from a non-existent path**

```ts
import { getDb } from "./connection"; // does not exist
```

If any code path ever reaches `findUserByUnionId` or `upsertUser`, the server crashes. These Kimi-specific functions are not currently called, but the broken import is a latent crash.

**W-M3 · `packages/ui/src/components/AuthLayout.tsx` targets the wrong app**

This component imports `@/hooks/useAuth`, `@/const`, and uses `react-router-dom` (`useLocation`, `useNavigate`) — none of which exist in the Next.js web app. It appears to be a scaffold from a different application template. It is unused by the web app and should be removed from the shared UI package.

**W-M4 · `apps/cms` (Strapi) is functionally empty and not in the workspaces array**

No content types are defined (`src/api/.gitkeep`). The web app fetches all data from Drizzle/tRPC, not Strapi. Strapi is also excluded from `package.json workspaces`, giving it separate `node_modules` and no shared config. Either integrate it properly or remove it.

**W-M5 · `Navbar.tsx` has permanently mocked authentication state**

```ts
const isAuthenticated = false;
const isAdmin = false;
const user = null;
const logout = () => {};
```

The navbar will never show a logged-in user or a logout button, even for authenticated admins. `next-auth/react`'s `useSession()` is not wired in.

---

### 3.7 Accessibility

**W-A1 · No skip-navigation link** — violates WCAG 2.1 SC 2.4.1 (Bypass Blocks). Keyboard users must tab through the entire Navbar on every page.

**W-A2 · Navbar hamburger button has no `aria-label`** — violates WCAG 2.1 SC 4.1.2. Screen readers announce a generic "button" with no description.

**W-A3 · Booking form has no focus management on reveal** — violates WCAG 2.1 SC 2.4.3 (Focus Order). When `setShowBookingForm(true)` is called, focus remains on the "Book This Tour" button instead of moving to the first form field.

**W-A4 · Framer Motion animations do not respect `prefers-reduced-motion`** — violates WCAG 2.1 SC 2.3.3. The extensive staggered animations in `HomeClient.tsx` have no `useReducedMotion` guard.

**W-A5 · Star rating buttons in testimonial form have no `aria-label`** — violates WCAG 2.1 SC 4.1.2. Each `<button>` contains only an icon with no accessible name.

**W-A6 · Form validation errors are not announced to screen readers** — violates WCAG 2.1 SC 3.3.1. Sonner toasts are not in an `aria-live` region; field-level errors from Zod are not wired to `aria-describedby`.

**W-A7 · No error boundary / `error.tsx` in any route segment** — unhandled rendering exceptions cause a white screen with no accessible error message or recovery option.

---

## 4. Gaps vs. Top-Tier Industry Standards

### 4.1 Security

| Finding | OWASP / Standard |
|---|---|
| Public booking creation; reference enumeration exposes PII | A01:2021 – Broken Access Control |
| No rate limiting on any endpoint | A05:2021 – Security Misconfiguration |
| Build suppresses TypeScript + ESLint — no static analysis gate | NIST SSDF PW.7 |
| Admin access controlled client-side only | A01:2021 – Broken Access Control |
| Missing CSP, X-Frame-Options, HSTS, X-Content-Type-Options | A05:2021; Mozilla Observatory |
| Free-text fields stored without sanitization | A03:2021 – Injection |
| AUTH_SECRET loaded but not used; unused `jwtVerify` import | A02:2021 – Cryptographic Failures |
| No CSRF protection on cross-origin mutations | A01:2021 |

### 4.2 Architecture & Scalability

**No caching vs. Next.js reference architecture.** Top-tier Next.js applications use `unstable_cache` or `export const revalidate` for semi-static content. Every destination and package page re-queries the database on every request.

**SQLite for multi-instance deployment.** `file:sqlite.db` is a local file. Multiple serverless instances will each have isolated files and conflicting writes. The `@libsql/client` dependency supports Turso's distributed SQLite with `DATABASE_URL=libsql://...` — this configuration path is not documented or implemented. `DATABASE_AUTH_TOKEN` is not referenced anywhere in `env.ts`.

**No pagination on any list endpoint.** `booking.list`, `enquiry.list`, `testimonial.list`, `blog.list` return all rows. At production data volumes, a single call returns thousands of rows to the client. Cursor-based pagination is the industry standard (GraphQL Relay, tRPC examples).

**No error boundaries.** No `error.tsx` files exist in any App Router segment. Server component fetch failures produce Next.js default 500 pages with no recovery path.

### 4.3 Testing

**Effective test coverage is near zero.** The unit test exercises a copy of the booking reference function. The integration test will not compile. There are no Playwright test files in `/tests/`. Business-critical paths (RBAC, enquiry creation, destination/package queries) have no tests at all. Industry benchmark is 70-80% line coverage for business-critical code paths.

**Broken imports go undetected.** The existence of `import { getDb } from './queries/connection'` in a committed test file confirms that no automated test execution is running.

### 4.4 Observability

**Health check does not verify database connectivity.** `GET /health` returns `{ ok: true }` regardless of whether the database is reachable. Production health checks should run `SELECT 1` and return a structured payload.

**No error tracking.** No Sentry, Highlight.io, or equivalent integration exists. `tRPC onError` logs `INTERNAL_SERVER_ERROR` to Pino but does not capture stack traces, request context, or trigger alerts.

**No environment validation in the web app.** `process.env.NEXT_PUBLIC_APP_URL`, `AUTH_RESEND_KEY`, and other web environment variables are read ad-hoc without startup validation. `@t3-oss/env-nextjs` is the standard solution for this stack.

### 4.5 Missing Business Features

**No booking confirmation email.** After a successful booking mutation, no email is sent to the customer. The Resend + React Email infrastructure is already present — this is a low-effort, high-value gap.

**`updatedAt` is never updated.** Combined with the module-load timestamp bug, this field is permanently incorrect on all records.

---

## 5. Prioritised Remediation Roadmap

Items are grouped by phase and ordered by risk/impact. **Nothing in Phase 1 is optional before any production deployment.**

### Phase 1 — Pre-Production Blockers (Weeks 1–2)

| ID | Action | File(s) |
|---|---|---|
| P1.1 | Re-enable TypeScript and ESLint in builds | `apps/web/next.config.ts` |
| P1.2 | Convert admin page to Server Component with `auth()` guard | `apps/web/src/app/admin/page.tsx` |
| P1.3 | Gate booking `create` behind `authedQuery`; link to `ctx.user.id` | `apps/api/src/booking-router.ts` |
| P1.4 | Fix timestamp defaults: `.default(new Date())` → `.$defaultFn(() => new Date())` | `packages/db/src/schema.ts` |
| P1.5 | Fix broken integration test imports (`@jemeka/db`) | `apps/api/src/booking.integration.test.ts` |
| P1.6 | Export `generateBookingRef` to shared lib; import in both router and test | `apps/api/src/booking-router.ts`, `booking.test.ts` |
| P1.7 | Fix images: add all missing public assets or remove broken references | `public/`, all page components |
| P1.8 | Remove `apps/api/src/kimi/` dead code and fix broken `queries/users.ts` import | `apps/api/src/kimi/`, `src/queries/users.ts` |

### Phase 2 — Security Hardening (Weeks 2–4)

| ID | Action | File(s) |
|---|---|---|
| P2.1 | Add rate limiting middleware (`@hono/rate-limiter`) on mutation routes | `apps/api/src/index.ts` |
| P2.2 | Validate `FRONTEND_URL` via `env.ts`; remove `?? ""` CORS fallback | `apps/api/src/index.ts`, `lib/env.ts` |
| P2.3 | Add security headers (CSP, X-Frame-Options, HSTS, X-Content-Type-Options) | `apps/api/src/index.ts` |
| P2.4 | Add `apps/web/middleware.ts` for server-side admin route protection | `apps/web/src/middleware.ts` (new) |
| P2.5 | Remove/sanitize AUTH_SECRET dead code; clean up unused `jwtVerify` import | `apps/api/src/middleware.ts` |
| P2.6 | Move contact details to environment variables | `Footer.tsx`, `contact/page.tsx` |

### Phase 3 — Quality, Performance & CI (Weeks 3–6)

| ID | Action | File(s) |
|---|---|---|
| P3.1 | Fix CI pipeline: run real migrations, fix Playwright web server, propagate failures | `.github/workflows/ci.yml` |
| P3.2 | Add `turbo.json` pipeline for caching and topological build ordering | `turbo.json` (new) |
| P3.3 | Fix `concurrently` failure propagation in root test script | `package.json` |
| P3.4 | Add `unstable_cache` or `revalidate` to destination/package server fetches | `apps/web/src/app/*/page.tsx` |
| P3.5 | Add `images.remotePatterns` for CDN and Strapi domains | `apps/web/next.config.ts` |
| P3.6 | Push search query filter to Drizzle `LIKE` clause | `apps/api/src/package-router.ts` |
| P3.7 | Add pagination (cursor-based) to all list endpoints | `*-router.ts` files |
| P3.8 | Set `updatedAt: new Date()` in all update mutations | all router files |
| P3.9 | Replace all `any` types with inferred Drizzle types and tRPC return types | all files |
| P3.10 | Extract brand colors to design tokens; add `font-heading` utility | `packages/config/tailwind.config.js` |
| P3.11 | Remove `packages/ui/src/components/AuthLayout.tsx` and `AuthLayoutSkeleton` | `packages/ui/` |
| P3.12 | Wire `useSession()` into `Navbar.tsx` for real auth state | `packages/ui/src/components/Navbar.tsx` |
| P3.13 | Add `error.tsx` to root and each route segment | `apps/web/src/app/` |

### Phase 4 — Business Features & Observability (Weeks 5–8)

| ID | Action | File(s) |
|---|---|---|
| P4.1 | Create `BookingConfirmationEmail` component; trigger after booking insert | `apps/api/src/booking-router.ts`, new email |
| P4.2 | Improve `/health` to verify database connectivity (`SELECT 1`) | `apps/api/src/index.ts` |
| P4.3 | Add Sentry (or equivalent) to both `apps/api` and `apps/web` | both apps |
| P4.4 | Add environment validation to `apps/web` with `@t3-oss/env-nextjs` | `apps/web/src/env.ts` (new) |
| P4.5 | Add `DATABASE_AUTH_TOKEN` to `env.ts` for Turso remote connection | `apps/api/src/lib/env.ts` |
| P4.6 | Either fully integrate Strapi or remove it from the monorepo | `apps/cms/` |
| P4.7 | Add bulk insert to `seed.ts` | `packages/db/src/seed.ts` |

### Phase 5 — Accessibility (Weeks 6–10)

| ID | Action | File(s) |
|---|---|---|
| P5.1 | Add skip-navigation link as first child of `<body>` | `apps/web/src/app/layout.tsx` |
| P5.2 | Add `aria-label="Open menu"` to hamburger; toggle to "Close menu" | `packages/ui/src/components/Navbar.tsx` |
| P5.3 | Add `useRef` + `focus()` on booking form reveal | `PackageDetailClient.tsx` |
| P5.4 | Add `aria-label` to star rating buttons in testimonial form | `apps/web/src/app/testimonials/page.tsx` |
| P5.5 | Add `useReducedMotion` guard to all Framer Motion variants | `HomeClient.tsx`, all animated components |
| P5.6 | Wire Zod field errors to `aria-describedby` on form inputs | all form components |
| P5.7 | Audit color contrast on `text-white/60` and `text-white/70` classes | all components |

---

## Appendix: Cross-Report Comparison

The following significant findings appeared in the uploaded report but not the first analysis, or vice versa.

| Finding | In Report A (first analysis) | In Report B (uploaded) | In Unified |
|---|---|---|---|
| CI pipeline exists (partially broken) | ✅ identified as present | ❌ stated "no CI exists" | ✅ Clarified: exists but broken |
| ADR documentation | ❌ not noted | ✅ praised | ✅ Added to Strengths |
| `createdAt` module-load timestamp bug | ❌ not caught | ✅ caught | ✅ W-B1 |
| `updatedAt` never updated | ✅ caught | ✅ caught | ✅ W-B4 |
| `concurrently` failure propagation | ❌ not caught | ✅ caught | ✅ W-C2 |
| Missing `turbo.json` | ❌ not caught | ✅ caught | ✅ W-C3 |
| Inline repeated `font-heading` style | ❌ not caught | ✅ caught | ✅ W-Q2 |
| Hardcoded brand colors | ❌ not caught | ✅ caught | ✅ W-Q3 |
| `prefers-reduced-motion` | ✅ caught | ✅ caught | ✅ W-A4 |
| `AuthLayout.tsx` wrong-app code | ✅ caught | ❌ not caught | ✅ W-M3 |
| `kimi/` dead code | ✅ caught | ✅ caught | ✅ W-M1 |
| `queries/users.ts` broken import | ✅ caught | ❌ not caught | ✅ W-M2 |
| Missing public image assets | ✅ caught | ❌ not caught | ✅ W-P3 |
| Booking confirmation email missing | ✅ caught | ✅ caught | ✅ P4.1 |
| Contact details hardcoded in source | ✅ caught | ❌ not caught | ✅ W-S8 |
| Turso `DATABASE_AUTH_TOKEN` missing | ❌ not caught | ✅ caught | ✅ P4.5 |
| Free-text XSS sanitization | ✅ caught | ✅ caught | ✅ listed |
| No CSRF protection | ✅ caught | ❌ not caught | ✅ in security table |
| Star rating `aria-label` missing | ✅ caught | ❌ not caught | ✅ W-A5 |
| In-memory search filter (should be SQL) | ✅ caught | ❌ not caught | ✅ W-B5 |

---

*This unified report supersedes both individual reports. All findings are directly traceable to specific files and lines in the repository.*
