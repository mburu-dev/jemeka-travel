# Requirements Document

## Introduction

This spec captures all actionable remediation work identified in the Unified Codebase Audit (`docs/AUDIT-UNIFIED.md`). It covers five phases of work: pre-production blockers, security hardening, quality and performance, business features and observability, and accessibility. The goal is to take the codebase from its current state (5.4/10 overall) to production-ready across all audited dimensions.

## Glossary

| Term | Definition |
|---|---|
| `publicQuery` | tRPC procedure with no authentication check |
| `authedQuery` | tRPC procedure that requires a valid Auth.js session |
| `adminQuery` | tRPC procedure that requires a valid session with `role === "admin"` |
| `.$defaultFn` | Drizzle ORM per-row JavaScript default function, evaluated at insert time |
| `unstable_cache` | Next.js server-side caching utility for data fetching |
| WCAG 2.1 AA | Web Content Accessibility Guidelines, Level AA compliance |
| OWASP | Open Web Application Security Project |

---

## Requirements

### Requirement 1: Re-enable Static Analysis in Builds

**User Story:** As a developer, I want TypeScript and ESLint errors to block the build, so that type bugs and lint violations are caught before they reach production.

#### Acceptance Criteria

1. WHEN `apps/web/next.config.ts` is updated, THEN `typescript.ignoreBuildErrors` SHALL be removed or set to `false`.
2. WHEN `apps/web/next.config.ts` is updated, THEN `eslint.ignoreDuringBuilds` SHALL be removed or set to `false`.
3. WHEN `npm run build --workspace=apps/web` is executed, THEN the build SHALL fail on any TypeScript type error.
4. WHEN `npm run build --workspace=apps/web` is executed, THEN the build SHALL fail on any ESLint rule violation.
5. WHEN all `any` types introduced by removing these flags surface as errors, THEN each SHALL be resolved with a proper inferred or explicit type.

---

### Requirement 2: Proper TypeScript Types Throughout

**User Story:** As a developer, I want all component props, API return types, and router callbacks to be properly typed, so that I get IntelliSense and compile-time safety across the stack.

#### Acceptance Criteria

1. WHEN `PackageDetailClient.tsx` is updated, THEN the `pkg` prop SHALL use `typeof packages.$inferSelect & { destination?: typeof destinations.$inferSelect }` or a named type alias, NOT `any`.
2. WHEN `DestinationDetailClient.tsx` is updated, THEN the `destination` prop SHALL use the inferred Drizzle type with packages relation, NOT `any`.
3. WHEN `DestinationsList.tsx` and `PackagesList.tsx` are updated, THEN list prop types SHALL use `Array<typeof destinations.$inferSelect>` and `Array<typeof packages.$inferSelect>` respectively.
4. WHEN `admin/page.tsx` is updated, THEN all tRPC calls SHALL use the typed `trpc` client WITHOUT `(trpc as any)` casts.
5. WHEN Drizzle query callbacks in router files are updated, THEN the order-by callbacks SHALL use proper Drizzle column references, NOT `(p: any, { desc }: any)`.
6. WHEN `booking-router.ts` `updateStatus` mutation is updated, THEN `updates` SHALL be typed as `Partial<typeof bookings.$inferInsert>`, NOT `any`.

---

### Requirement 3: Fix Schema Timestamp Defaults

**User Story:** As a developer, I want each database row to receive the timestamp of its actual insert/update time, so that `createdAt` and `updatedAt` are accurate.

#### Acceptance Criteria

1. WHEN `packages/db/src/schema.ts` is updated, THEN every `createdAt` column that currently uses `.default(new Date())` SHALL use `.$defaultFn(() => new Date())` instead.
2. WHEN `packages/db/src/schema.ts` is updated, THEN every `updatedAt` column SHALL use `.$defaultFn(() => new Date())`.
3. WHEN a new Drizzle migration is generated after the schema change, THEN the migration SHALL be committed to `packages/db/src/migrations/`.
4. WHEN any `update` mutation in any router is executed, THEN `updatedAt: new Date()` SHALL be included in the update payload.
5. WHERE the update payload type is `Partial<...>`, THEN `updatedAt` SHALL be a valid key in that type.

---

### Requirement 4: Secure Booking Creation

**User Story:** As a business owner, I want bookings to be linked to authenticated users, so that we prevent anonymous spam bookings and can associate bookings with customer accounts.

#### Acceptance Criteria

1. WHEN `booking-router.ts` is updated, THEN the `create` procedure SHALL use `authedQuery`, NOT `publicQuery`.
2. WHEN a booking is created, THEN `userId: ctx.user.id` SHALL be automatically set from the authenticated session context.
3. WHEN an unauthenticated user calls `booking.create`, THEN the API SHALL return a `401 UNAUTHORIZED` tRPC error.
4. IF a user is authenticated, THEN `getByReference` SHALL only return a booking if `booking.userId === ctx.user.id` OR the caller is an admin.
5. WHEN an unauthenticated user calls `booking.getByReference`, THEN the API SHALL return a `401 UNAUTHORIZED` tRPC error.

---

### Requirement 5: Server-Side Admin Route Protection

**User Story:** As a security-conscious developer, I want the admin route to be protected at the server/edge level, so that unauthenticated or non-admin users cannot access admin page resources.

#### Acceptance Criteria

1. WHEN `apps/web/src/middleware.ts` is created, THEN it SHALL use `auth()` from `apps/web/src/auth.ts` to intercept requests to `/admin`.
2. IF a request to `/admin` has no valid session, THEN the middleware SHALL redirect to `/login?callbackUrl=/admin`.
3. IF a request to `/admin` has a valid session but `session.user.role !== "admin"`, THEN the middleware SHALL redirect to `/` (home).
4. WHEN `apps/web/src/app/admin/page.tsx` is updated, THEN it SHALL be converted to a Server Component (remove `"use client"`).
5. WHEN the admin Server Component renders, THEN data SHALL be fetched via the server-side `trpcServer` client, NOT via `(trpc as any).*` hooks.

---

### Requirement 6: Fix Broken Tests

**User Story:** As a developer, I want all test files to compile and run, so that the test suite provides reliable signal.

#### Acceptance Criteria

1. WHEN `apps/api/src/booking.integration.test.ts` is updated, THEN all imports SHALL resolve to existing module paths (`@jemeka/db`, NOT `./queries/connection` or `@db/schema`).
2. WHEN `vitest run` is executed in `apps/api`, THEN all test files SHALL compile without errors.
3. WHEN `generateBookingRef` is refactored, THEN it SHALL be exported from `apps/api/src/lib/booking-ref.ts` (a new shared file).
4. WHEN `apps/api/src/booking-router.ts` is updated, THEN it SHALL import `generateBookingRef` from `../lib/booking-ref`.
5. WHEN `apps/api/src/booking.test.ts` is updated, THEN it SHALL import `generateBookingRef` from `../lib/booking-ref` rather than re-defining it locally.
6. WHEN all integration tests run, THEN they SHALL pass (create booking, fetch by reference).

---

### Requirement 7: Remove Dead Code

**User Story:** As a developer, I want the codebase to contain only active, used code, so that cognitive load is reduced and security surface area is minimised.

#### Acceptance Criteria

1. WHEN `apps/api/src/kimi/` is removed, THEN no other file in `apps/api/src/` SHALL import from it.
2. WHEN `apps/api/src/queries/users.ts` is removed or fixed, THEN no import of `./connection` SHALL remain in `apps/api/src/`.
3. WHEN `apps/api/src/lib/env.ts` is updated, THEN the Kimi-specific required variables (`APP_ID`, `APP_SECRET`, `KIMI_AUTH_URL`, `KIMI_OPEN_URL`, `ownerUnionId`) SHALL be removed.
4. WHEN `packages/ui/src/components/AuthLayout.tsx` is removed, THEN no file in `apps/web/` SHALL import it.
5. WHEN `packages/ui/src/components/AuthLayoutSkeleton.tsx` is removed, THEN no file in `apps/web/` SHALL import it.
6. WHEN `apps/web/next.config.ts` is examined after cleanup, THEN `jwtVerify` and AUTH_SECRET SHALL NOT be referenced in dead code paths.

---

### Requirement 8: Rate Limiting

**User Story:** As a business owner, I want public mutation endpoints to be rate-limited, so that spam bookings, fake enquiries, and denial-of-service attempts are mitigated.

#### Acceptance Criteria

1. WHEN `apps/api/src/index.ts` is updated, THEN a rate-limiting middleware SHALL be applied before the tRPC handler.
2. WHEN a single IP address sends more than 10 requests per minute to any tRPC mutation, THEN the API SHALL return `429 Too Many Requests`.
3. WHEN the rate limit is exceeded, THEN the response SHALL include a `Retry-After` header.
4. WHEN the rate-limiting implementation is chosen, THEN it SHALL not require an external service dependency for local development (in-memory store acceptable for dev).

---

### Requirement 9: CORS Hardening

**User Story:** As a developer, I want the API's CORS configuration to be explicit and fail-safe, so that missing environment variables do not silently open the API to all origins.

#### Acceptance Criteria

1. WHEN `apps/api/src/index.ts` is updated, THEN `FRONTEND_URL` SHALL be read via the `required()` function from `env.ts`.
2. WHEN `FRONTEND_URL` is not set in production, THEN the server SHALL throw at startup, NOT fall back to `""`.
3. WHEN the CORS middleware is configured, THEN only the explicit allowed origins SHALL be accepted.
4. WHEN `apps/api/src/lib/env.ts` is updated, THEN `frontendUrl` SHALL be a declared property in the `env` object.

---

### Requirement 10: HTTP Security Headers

**User Story:** As a security engineer, I want the API to set standard security headers on every response, so that browser-enforced security policies are active.

#### Acceptance Criteria

1. WHEN any response is sent from `apps/api`, THEN it SHALL include `X-Content-Type-Options: nosniff`.
2. WHEN any response is sent from `apps/api`, THEN it SHALL include `X-Frame-Options: DENY`.
3. WHEN any HTTPS response is sent from `apps/api`, THEN it SHALL include `Strict-Transport-Security: max-age=63072000; includeSubDomains`.
4. WHEN any response is sent from `apps/api`, THEN it SHALL include a `Content-Security-Policy` header appropriate for a JSON API (default-src 'none').

---

### Requirement 11: Fix CI Pipeline

**User Story:** As a developer, I want the CI pipeline to correctly validate lint, types, tests, and migrations on every pull request, so that broken code cannot be merged.

#### Acceptance Criteria

1. WHEN a pull request is opened against `main`, THEN the CI workflow SHALL run `npm run lint --workspaces`.
2. WHEN a pull request is opened against `main`, THEN the CI workflow SHALL run `tsc --noEmit` in both `apps/api` and `apps/web`.
3. WHEN a pull request is opened against `main`, THEN the CI workflow SHALL run `vitest run` in `apps/api` and all tests SHALL pass.
4. WHEN migrations are verified in CI, THEN the step SHALL run `drizzle-kit push` against a temporary test database rather than only listing the directory.
5. WHEN any CI job fails, THEN the entire workflow SHALL exit with a non-zero code and block the PR merge.
6. WHEN Playwright E2E tests are configured in CI, THEN a `webServer` block SHALL start the Next.js server and wait for it to be ready before running tests.

---

### Requirement 12: Server-Side Caching

**User Story:** As a user, I want destination and package pages to load quickly, so that the browsing experience is fast even under load.

#### Acceptance Criteria

1. WHEN `apps/web/src/app/destinations/page.tsx` is updated, THEN destination list data SHALL be wrapped with `unstable_cache` with a revalidation interval of 3600 seconds.
2. WHEN `apps/web/src/app/packages/page.tsx` is updated, THEN package list data SHALL be wrapped with `unstable_cache` with a revalidation interval of 3600 seconds.
3. WHEN `apps/web/src/app/page.tsx` (home) fetches featured data, THEN both `destination.featured` and `package.featured` calls SHALL be cached.
4. WHEN content is updated in the database, THEN a cache-revalidation mechanism (tag-based or time-based) SHALL exist to refresh the cached data.

---

### Requirement 13: Pagination on List Endpoints

**User Story:** As an admin user, I want list endpoints to return paginated results, so that the dashboard remains responsive as bookings and enquiries accumulate.

#### Acceptance Criteria

1. WHEN `booking.list` is called, THEN it SHALL accept optional `limit: z.number().min(1).max(100).default(20)` and `cursor: z.number().optional()` inputs.
2. WHEN `booking.list` is called, THEN it SHALL return `{ items: Booking[], nextCursor: number | null }`.
3. WHEN `enquiry.list` is called, THEN it SHALL accept the same pagination inputs and return the same shape.
4. WHEN `testimonial.list` is called with `limit`, THEN the existing `limit` parameter SHALL continue to work.
5. WHEN `blog.list` is called, THEN its existing `limit` parameter SHALL be bounded to a maximum of 100.

---

### Requirement 14: Image Asset Resolution

**User Story:** As a user, I want all destination and package images to display correctly, so that the visual experience matches the design intent.

#### Acceptance Criteria

1. WHEN the `public/` directory is audited, THEN all image paths referenced in components SHALL either exist in `public/` or resolve via a remote pattern.
2. WHEN `apps/web/next.config.ts` is updated, THEN `images.remotePatterns` SHALL be configured for any CDN or Strapi upload domain used.
3. WHERE a referenced image does not exist in `public/`, THEN a placeholder image SHALL be placed at that path OR the reference SHALL be updated to an existing file.
4. WHEN the `login/page.tsx` Google favicon is resolved, THEN it SHALL use a local asset in `public/`, NOT an external URL to `google.com`.

---

### Requirement 15: Design System Tokens

**User Story:** As a developer, I want brand colors and font families to be defined as Tailwind tokens, so that UI consistency can be maintained and brand updates require a single change.

#### Acceptance Criteria

1. WHEN `packages/config/tailwind.config.js` is updated, THEN it SHALL define named brand colors: `brand.navy` (`#0F4C75`), `brand.teal` (`#2A9D8F`), `brand.orange` (`#F4A261`), `brand.dark` (`#264653`), `brand.coral` (`#E76F51`).
2. WHEN the Tailwind config is updated, THEN it SHALL define a `font-heading` utility using `var(--font-heading)`.
3. WHEN all source files are updated, THEN all occurrences of `bg-[#0F4C75]`, `text-[#264653]`, `text-[#F4A261]`, `text-[#2A9D8F]` SHALL be replaced with their named token equivalents.
4. WHEN all heading elements are updated, THEN `style={{ fontFamily: 'var(--font-heading)' }}` inline styles SHALL be replaced with the `font-heading` Tailwind class.

---

### Requirement 16: Booking Confirmation Email

**User Story:** As a customer, I want to receive a confirmation email after submitting a booking, so that I have a record of my booking details.

#### Acceptance Criteria

1. WHEN a `BookingConfirmationEmail` React Email component is created, THEN it SHALL display: booking reference, package name, travel date, number of adults/children, total price, and next steps.
2. WHEN `booking-router.ts` `create` mutation completes successfully, THEN the API SHALL send a `BookingConfirmationEmail` to `input.customerEmail` via Resend.
3. WHEN the email send fails, THEN the booking record SHALL still be saved and the failure SHALL be logged, NOT thrown as an error to the client.
4. WHEN the email is sent, THEN the subject SHALL be `"Booking Confirmed — [Reference] | Jemeka Tours"`.

---

### Requirement 17: Enhanced Health Check

**User Story:** As an operator, I want the `/health` endpoint to verify database connectivity, so that infrastructure health checks detect database failures.

#### Acceptance Criteria

1. WHEN `GET /health` is called, THEN the handler SHALL execute a lightweight database query (e.g., `SELECT 1 as ok`).
2. IF the database query succeeds, THEN the response SHALL be `200 { ok: true, db: "connected", ts: number }`.
3. IF the database query fails, THEN the response SHALL be `503 { ok: false, db: "disconnected", error: string }`.
4. WHEN the health check runs, THEN it SHALL complete within 2000ms.

---

### Requirement 18: Real Navbar Authentication State

**User Story:** As a logged-in user, I want the navbar to show my name and a logout button, so that I know I am authenticated and can sign out.

#### Acceptance Criteria

1. WHEN `packages/ui/src/components/Navbar.tsx` is updated, THEN it SHALL import and use `useSession()` from `next-auth/react` for authentication state.
2. WHEN a user is authenticated, THEN the navbar SHALL display the user's name and a "Logout" button.
3. WHEN a user is authenticated AND `session.user.role === "admin"`, THEN the navbar SHALL display an "Admin" link.
4. WHEN the logout button is clicked, THEN `signOut()` from `next-auth/react` SHALL be called.
5. WHEN `isLoading` is true, THEN the navbar SHALL display a skeleton/placeholder in the auth area.

---

### Requirement 19: Accessibility — WCAG 2.1 AA Compliance

**User Story:** As a user with a disability, I want the website to be navigable and understandable using assistive technologies, so that I have equal access to the booking experience.

#### Acceptance Criteria

1. WHEN `apps/web/src/app/layout.tsx` is updated, THEN a skip-navigation link (`<a href="#main-content">Skip to content</a>`) SHALL be the first focusable element in `<body>`, visible on keyboard focus.
2. WHEN `Navbar.tsx` is updated, THEN the hamburger `<Button>` SHALL have `aria-label="Open menu"` and toggle to `aria-label="Close menu"` when the sheet is open.
3. WHEN the booking form is revealed via `setShowBookingForm(true)`, THEN a `useRef` on the travel date input SHALL call `.focus()` to move keyboard focus into the form.
4. WHEN star rating buttons in `testimonials/page.tsx` are updated, THEN each `<button>` SHALL have `aria-label="Rate {n} out of 5 stars"`.
5. WHEN Framer Motion animations are updated, THEN all animated components SHALL use `useReducedMotion()` and set `duration: 0` and disable stagger when `true`.
6. WHEN form validation errors are displayed, THEN each error message SHALL be linked to its input via `aria-describedby` and SHALL be in a live region.

---

### Requirement 20: Error Boundaries

**User Story:** As a user, I want to see a helpful error message when something goes wrong on a page, so that I can recover rather than seeing a blank screen.

#### Acceptance Criteria

1. WHEN `apps/web/src/app/error.tsx` is created, THEN it SHALL render a user-friendly error UI with a "Try again" button that calls `reset()`.
2. WHEN `apps/web/src/app/destinations/[slug]/error.tsx` is created, THEN it SHALL render an error UI with a "Back to Destinations" link.
3. WHEN `apps/web/src/app/packages/[slug]/error.tsx` is created, THEN it SHALL render an error UI with a "Back to Packages" link.
4. WHEN any of these error boundaries catch an error, THEN the error SHALL be logged (via `console.error` at minimum, Sentry when integrated).
