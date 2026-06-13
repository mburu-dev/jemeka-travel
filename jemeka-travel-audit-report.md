# Jemeka Tours & Travel — Comprehensive Independent Codebase Audit Report

**Repository:** https://github.com/mburu-dev/jemeka-travel  
**Audit Date:** June 13, 2026  
**Auditor:** Independent Analysis (Claude, Anthropic)  
**Deployment Target:** Oracle Cloud Free Tier (Compute) + Cloudflare Free Tier (Tunnel + CDN)  
**Assessment Framework:** OWASP Top 10 2021, NIST SSDF, WCAG 2.1 AA, Cloud-Native Architecture Standards, Software Testing Maturity Models

---

## Executive Scorecard

| Domain | Score | Summary |
|---|---|---|
| Code Quality & Consistency | 6.5 / 10 | TypeScript safety disabled; `any` types pervasive; duplicated logic |
| Architecture & System Design | 8.0 / 10 | Strong monorepo; clean separation; tRPC type safety is a genuine strength |
| Security Implementation | 4.5 / 10 | Critical: unauthenticated booking creation; client-side admin guard; no rate limiting |
| Performance & Optimization | 5.5 / 10 | No caching; no pagination; timestamp bug creates silent data corruption |
| Test Coverage & CI/CD | 3.5 / 10 | No CI pipeline; broken integration test imports; 5 test files total |
| Maintainability & Documentation | 7.0 / 10 | ADR and API docs are mature; design tokens inconsistent |
| Accessibility & Compatibility | 5.0 / 10 | Missing ARIA, skip links, focus management, reduced-motion support |
| Production Deployment Readiness | 5.0 / 10 | Docker + Cloudflare Tunnel architecture is sound; blockers remain |
| **OVERALL** | **5.6 / 10** | **Solid architectural foundation; significant hardening required before production** |

---

## Table of Contents

1. [Repository Overview](#1-repository-overview)
2. [Core Strengths](#2-core-strengths)
3. [Critical Weaknesses](#3-critical-weaknesses)
4. [Functional & Non-Functional Gaps](#4-functional--non-functional-gaps)
5. [Production Deployment Readiness](#5-production-deployment-readiness)
6. [Risk-Based Remediation Roadmap](#6-risk-based-remediation-roadmap)

---

## 1. Repository Overview

Jemeka Tours & Travel is a full-stack travel-booking platform targeting East African safari tourism. The codebase is a single-branch (`master`), npm-workspaces monorepo with 8 commits total — indicating it is an active build-out rather than a mature codebase.

### Structure

```
jemeka-travel/
├── apps/
│   ├── web/          # Next.js 15 + React 19 + Tailwind CSS 4 (App Router)
│   ├── api/          # Hono + tRPC + Drizzle ORM (Node.js)
│   └── cms/          # Strapi 5 (NOT in npm workspaces — isolated)
├── packages/
│   ├── db/           # Drizzle schema, migrations, seed (SQLite/libsql)
│   ├── ui/           # Radix UI + shadcn/ui shared components
│   ├── config/       # Shared Tailwind + TypeScript configs
│   └── contracts/    # Shared TS types and constants
├── .github/workflows/   # EMPTY — no CI pipeline
├── .kiro/specs/         # AI-generated project specifications
├── docs/                # ADR, API.md, CLAUDE.md, AGENTS.md
├── docker-compose.yml   # 3-service compose: web, api, cloudflared
├── .env.production.example
└── package.json         # Root workspace (CMS excluded)
```

### Technology Stack (Verified)

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4, Framer Motion, shadcn/ui, tRPC client, Auth.js v5
- **Backend:** Hono (Node.js), tRPC, Zod, Drizzle ORM, libSQL/SQLite, Pino logger, Vitest
- **Email:** Resend + React Email
- **CMS:** Strapi 5 (separate, unintegrated process)
- **Payments:** Paystack
- **Infrastructure Target:** Oracle Cloud Free Tier ARM VM + Cloudflare Zero Trust Tunnel (free)
- **Container:** Docker Compose (web + api + cloudflared services)
- **Language:** TypeScript (92.8%), JavaScript (6.2%)

### Codebase Scale (Approximate)

- TypeScript/TSX source files: ~55
- Test files: 5 (3 Playwright + 2 Vitest)
- SQL migration files: 1
- Documentation files: 5
- Commit history: 8 commits on single `master` branch

---

## 2. Core Strengths

### 2.1 Architecture & Monorepo Design

**npm Workspaces Monorepo — Well Structured**

The root `package.json` correctly defines workspaces:
```json
"workspaces": ["apps/web", "apps/api", "packages/*"]
```
This enables shared TypeScript types, components, and configuration without publishing to a registry. The separation of `apps/` (runnable applications) from `packages/` (shared libraries) mirrors patterns used by Linear, Vercel, and Prisma.

**Architectural Decision Record (ADR)**

`docs/adr/0001-monorepo-architecture.md` formally documents the rationale for key technology choices. Maintaining ADRs at this project scale is an indicator of engineering discipline rarely seen in early-stage builds.

**tRPC End-to-End Type Safety**

Running tRPC over a dedicated Hono process (rather than Next.js API routes) gives clean process isolation while the shared `AppRouter` type exported from `apps/api/src/index.ts` provides compile-time guarantees across the client–server boundary. This eliminates an entire class of runtime mismatches common in REST-based stacks.

**Next.js App Router Best Practices**

Server Components fetch data via `trpcServer` and pass it as props to Client Components, avoiding the client waterfall pattern. `Promise.all()` is used in `apps/web/src/app/page.tsx` for parallel data fetching — a measurable performance advantage over sequential fetches.

### 2.2 Database & Data Modelling

**Drizzle ORM with Correct Monetary Type**

`packages/db/src/schema.ts` models 10+ tables with proper constraints and enums. Using `text("price")` for monetary values (instead of `REAL`) is the correct decision for decimal precision in SQLite, avoiding floating-point rounding errors in pricing calculations.

**Migration Baseline**

A baseline migration file (`0000_conscious_alice.sql`) and Drizzle Kit journal exist under `packages/db/src/migrations/`, establishing a reproducible schema evolution path.

**Comprehensive Seed Data**

`packages/db/src/seed.ts` seeds 8 destinations, 10 tour packages, and 12 testimonials with realistic, domain-relevant data — accelerating development and reducing time-to-demo.

### 2.3 Security (Partial Strengths)

**Auth.js v5 with Drizzle Adapter**

Authentication integrates Auth.js v5 with both Google OAuth and Resend magic-link. The `DrizzleAdapter` correctly persists sessions to the database. The custom session callback in `apps/web/src/auth.ts` safely surfaces the user role without leaking sensitive fields.

**Database-Side Session Verification**

`apps/api/src/middleware.ts` performs a database session lookup rather than trusting a client-supplied token — the correct approach for database session strategies, preventing token-forgery attacks.

**Role-Based Access Control on Admin Procedures**

The `adminQuery` procedure chain (`authedQuery.use(isAdmin)`) gates all admin mutations behind both authentication and an explicit `role === "admin"` check. This is correctly applied to booking list, status update, and delete operations, as well as enquiry management.

**Environment Variable Guard**

`apps/api/src/lib/env.ts` implements a `required()` helper that throws at startup when a variable is absent — preventing silent misconfigurations with empty strings reaching production.

### 2.4 Frontend Quality & UX

**Rich, Polished UI**

The frontend demonstrates genuine design craftsmanship: multi-layer gradient hero images, Framer Motion staggered animations (`containerVariants`/`itemVariants`), sticky pricing sidebar, Accordion itinerary, and a clear inclusion/exclusion visual comparison. This significantly exceeds typical bootstrap-template quality.

**SEO-First Metadata Architecture**

Every page exports either a static `metadata` object or an async `generateMetadata` function. Open Graph tags, dynamic titles using the `"%s | Jemeka Tours and Travel"` template, and proper description truncation at 160 characters are all correctly implemented.

**Sitemap and robots.txt**

`apps/web/src/app/sitemap.ts` dynamically generates XML sitemaps by fetching live destination and package slugs. `robots.ts` correctly disallows `/admin/` and `/api/` while pointing to the sitemap. This is production-ready SEO infrastructure.

**Transactional Email Architecture**

Magic-link emails use `react-email` to render a custom `MagicLinkEmail` component, sent via Resend. This is a professional email architecture significantly superior to plain-text nodemailer approaches.

### 2.5 Testing Infrastructure

**Genuine Integration Test Harness**

`apps/api/src/test-utils.ts` builds a full in-memory test database, runs real Drizzle migrations, and creates a typed tRPC caller. This exercises the entire call stack from procedure to SQLite — many projects only mock the database layer.

**Playwright E2E Specs**

Three Playwright spec files cover the happy-path booking flow, HTML5 email validation, mobile responsiveness (iPhone 13 viewport), and navbar stickiness — demonstrating intent to test real user journeys.

### 2.6 Deployment Architecture Design

**Cloudflare Tunnel is the Right Free-Tier Choice**

The `docker-compose.yml` deploys a `cloudflared` service alongside `web` and `api`:
```yaml
cloudflared:
  image: cloudflare/cloudflared:latest
  command: tunnel run
  environment:
    - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
```
This eliminates the need for Oracle's public IP exposure for port 443, avoids SSL certificate management, and leverages Cloudflare's free DDoS mitigation, WAF, and CDN — a genuinely smart architectural choice for a zero-budget production deployment.

**Persistent Database Volume**

The API container mounts a named Docker volume (`jemeka_data:/data/db`) ensuring the SQLite database survives container restarts on the Oracle VM — correct for a single-instance persistent deployment.

---

## 3. Critical Weaknesses

### 3.1 Security Vulnerabilities

---

#### 🔴 CRITICAL — TypeScript and ESLint Checks Suppressed in Production Builds

**File:** `apps/web/next.config.ts`  
**OWASP:** A05:2021 – Security Misconfiguration  
**Risk Score:** Critical (Impact: High, Likelihood: Certain)

```typescript
// apps/web/next.config.ts
typescript: { ignoreBuildErrors: true },   // ← ALL type safety disabled in CI
eslint: { ignoreDuringBuilds: true },       // ← ALL lint safety disabled in CI
```

The build pipeline provides zero static analysis. Type errors and lint violations that would catch runtime bugs, security issues, and data-handling mistakes are silently ignored. This is explicitly flagged as an anti-pattern in the official Next.js documentation.

**Impact:** Every other TypeScript/ESLint finding in this report is unblocked from reaching production. This is the highest-leverage single fix available.

---

#### 🔴 CRITICAL — Booking Creation is Unauthenticated (IDOR + PII Exposure)

**File:** `apps/api/src/booking-router.ts`, line 13  
**OWASP:** A01:2021 – Broken Access Control  
**Risk Score:** Critical (Impact: High, Likelihood: High)

```typescript
// apps/api/src/booking-router.ts
create: publicQuery     // ← any unauthenticated user can create bookings
getByReference: publicQuery  // ← exposes customerName, email, phone to anyone who guesses a ref
```

Any visitor can submit a booking for any `packageId` without authentication. Any user who guesses or enumerates a booking reference can retrieve full customer PII (name, email, phone, special requests). This violates GDPR/data protection principles applicable in Kenya under the Data Protection Act 2019.

---

#### 🔴 HIGH — No Rate Limiting on Any Endpoint

**File:** `apps/api/src/index.ts`  
**OWASP:** A05:2021 – Security Misconfiguration  
**Risk Score:** High (Impact: High, Likelihood: High)

No rate-limiting middleware is applied to any route. An attacker can programmatically submit thousands of booking or enquiry requests, exhausting the Resend email quota (3,000/month on free tier), poisoning the admin dashboard, and causing denial of service with zero infrastructure cost.

This is especially acute on the **Oracle Free Tier ARM VM** which has 24GB RAM but limited egress — a flood of write operations could saturate I/O and cause SQLite locking under concurrent load.

---

#### 🔴 HIGH — Admin Page Relies on Client-Side Role Check Only

**File:** `apps/web/src/app/admin/page.tsx`  
**OWASP:** A01:2021 – Broken Access Control  
**Risk Score:** High (Impact: High, Likelihood: Medium)

```typescript
// apps/web/src/app/admin/page.tsx — "use client"
const { data: session } = useSession()
if (session?.user?.role !== "admin") return <AccessDenied />
```

This is a `"use client"` component. The admin page JavaScript is served to all visitors; only the rendered output is gated. Manipulating network responses or session state can bypass this. The correct pattern is a Server Component that calls `auth()` and issues a server-side redirect before any JavaScript reaches the client.

---

#### 🟠 HIGH — CORS Origin Validation Fails Silently When `FRONTEND_URL` is Unset

**File:** `apps/api/src/index.ts`  
**OWASP:** A05:2021 – Security Misconfiguration  
**Risk Score:** High (Impact: Medium, Likelihood: Medium)

```typescript
origin: ["http://localhost:3000", process.env.FRONTEND_URL ?? ""],
// ↑ silent fallback to "" if FRONTEND_URL is unset in production
```

If `FRONTEND_URL` is not set, this silently adds `""` as an allowed origin. CORS should enforce an explicit allowlist using the `env.ts` `required()` guard, with no silent fallback.

---

#### 🟠 MEDIUM — No Security Headers

**File:** `apps/api/src/index.ts`, `apps/web/next.config.ts`  
**OWASP:** A05:2021; Mozilla Observatory  

Neither the Hono API nor the Next.js app configures `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, or `Strict-Transport-Security` headers. While Cloudflare's free WAF provides some protection, headers are required for defence-in-depth and OWASP compliance. Next.js supports these via `headers()` in `next.config.ts`.

---

#### 🟠 MEDIUM — No Input Sanitisation on Free-Text Fields

**Files:** `apps/api/src/enquiry-router.ts`, `apps/api/src/booking-router.ts`  
**OWASP:** A03:2021 – Injection  

`specialRequests`, `message`, and `subject` fields are stored unsanitised. Parameterised Drizzle queries prevent SQL injection, but if these fields are ever rendered in an email template or admin view with `dangerouslySetInnerHTML`, stored XSS becomes exploitable. Sanitisation with `DOMPurify` (server-side via `isomorphic-dompurify`) should be applied before storage.

---

### 3.2 Code Correctness Bugs

#### 🔴 BUG — Schema Timestamps Evaluated Once at Module Load (Silent Data Corruption)

**File:** `packages/db/src/schema.ts` — 12+ columns  
**Scope:** Every table in the schema

```typescript
// Current (WRONG):
createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date())
// ↑ new Date() evaluated ONCE when the module is first imported.
// Every row inserted in the same server process lifetime gets the SAME timestamp.

// Correct:
createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
```

This is a silent bug that corrupts all timestamp data. The `updatedAt` column is affected by the same issue AND is never set in any update mutation, leaving it permanently at the module-load value.

---

#### 🔴 BUG — `generateBookingRef()` Duplicated Between Production and Test

**Files:** `apps/api/src/booking-router.ts` (line 6), `apps/api/src/booking.test.ts` (line 3)

The test exercises a locally defined copy of `generateBookingRef`, not the production function. If the production implementation changes, tests will pass while real code behaves differently — a classic test coverage false positive.

---

#### 🔴 BUG — Integration Test Has Non-Existent Import Paths

**File:** `apps/api/src/booking.integration.test.ts`

```typescript
import { getDb } from './queries/connection';   // ← path does not exist
import { destinations, packages, bookings } from '@db/schema';  // ← package not defined
```

This test cannot compile. The correct imports are from `@jemeka/db`. The existence of broken test imports undetected confirms there is no automated test execution — the tests have never been run in CI.

---

#### 🟠 MEDIUM — Pervasive `any` Type Usage (16+ occurrences in web, 9+ in API)

Notable examples:
```typescript
PackageDetailClientProps { pkg: any }  // apps/web
bookingMutation = (trpc as any).booking.create.useMutation  // apps/web
(d: any, { desc }: any) => ...  // apps/api/src/destination-router.ts
```

This eliminates TypeScript's primary benefit and allows type-unsafe operations to reach production silently (especially since `ignoreBuildErrors: true` suppresses any remaining warnings).

---

### 3.3 Performance Issues

#### 🟠 No HTTP Caching on Any Server-Side Data Fetch

Every page load triggers fresh tRPC queries. For publicly readable, rarely-changing content (destinations, packages, testimonials), Next.js `unstable_cache`, `export const revalidate = 3600`, or React `cache()` would reduce database load by orders of magnitude — critical on the single-core Oracle Free Tier where SQLite I/O is the primary bottleneck.

#### 🟠 No Pagination on Any List Endpoint

`booking-router.ts list`, `enquiry-router.ts list`, `testimonial-router.ts`, and `blog-router.ts` all return unbounded result sets. As bookings accumulate, a single admin dashboard load could return thousands of rows and transfer megabytes across the Docker network — causing timeouts on resource-constrained Oracle ARM VMs.

#### 🟠 `next.config.ts` Has No Image Remote Patterns

```typescript
// next.config.ts — no images.remotePatterns configured
```

No `images.remotePatterns` or `images.domains` is configured. Any image served from Strapi uploads, a CDN, or an external URL will fail Next.js Image optimisation, producing either errors or unoptimised `<img>` tags — defeating one of Next.js's primary performance features.

#### 🟡 Sequential Seed Inserts

`packages/db/src/seed.ts` inserts records one-by-one in a for loop instead of using Drizzle's bulk `.values([...array])`. Minor in current scope but establishes a bad performance pattern.

---

### 3.4 Maintainability Issues

#### 🟠 Strapi CMS Not in npm Workspaces

`apps/cms` is excluded from the root `package.json` workspaces array. It has its own `package-lock.json`, receives no shared type-checking, and cannot use `@jemeka/*` shared packages without manual symlinking. It is effectively a separate orphaned project embedded in the monorepo.

#### 🟠 Hardcoded Brand Colour `#0F4C75` (40+ occurrences)

```html
className="bg-[#0F4C75]"  <!-- appears 40+ times across files -->
```

This bypasses the Tailwind design token system. A brand colour change requires editing every file manually. The correct fix is to add `extend.colors.brand.navy = "#0F4C75"` to `packages/config/tailwind.config.js` and use `bg-brand-navy` everywhere.

#### 🟡 `apps/api/src/kimi/` Contains Unreferenced Dead Code

`auth.ts`, `platform.ts`, `session.ts`, and `types.ts` in the `kimi/` directory are not imported anywhere in `router.ts` or `index.ts`. This increases cognitive load and the security surface area of the build.

#### 🟡 `turbo.json` Absent Despite ADR Citing Turborepo

`docs/adr/0001-monorepo-architecture.md` states a Turborepo architecture decision, but no `turbo.json` exists. The project loses all Turborepo benefits: build caching, topological task ordering, and parallelism.

#### 🟡 Inline Font Style Repeated 15+ Times

```typescript
style={{ fontFamily: 'var(--font-heading)' }}  // repeated 15+ times
```

This should be a Tailwind utility class (`font-heading`) defined in the config, not an inline style duplicated across every component.

#### 🟡 `docx` and `pptxgenjs` in Root `package.json` Dependencies

```json
"dependencies": {
  "docx": "^9.7.1",
  "pptxgenjs": "^4.0.1"
}
```

These appear to be scaffolding/generation tools used during development, not runtime application dependencies. They should not be in the root production `dependencies`.

---

## 4. Functional & Non-Functional Gaps

### 4.1 Missing CI/CD Pipeline

**Evidence:** `.github/workflows/` directory is present but empty — no YAML files exist.

There is no automated quality gate of any kind. No lint, type-check, test, build, or deploy workflow runs on any commit or pull request. This is a fundamental gap for any production-bound application. The broken integration test imports went undetected precisely because tests are never automatically run.

**Intended:** The ADR, `AGENTS.md`, and `CLAUDE.md` documents all describe a professional engineering workflow implying automated CI. The `package.json` root `test` script exists but is never called automatically.

### 4.2 No Booking Confirmation Email

**Evidence:** The Resend infrastructure and `react-email` templates are present for magic-link authentication, but no `BookingConfirmationEmail` component exists and the `booking-router.ts` `create` mutation does not send any email after a successful booking.

**Intended:** Indicated by the existing transactional email infrastructure and the business nature of the application. A customer completing a booking with no confirmation email is a critical UX and trust gap.

### 4.3 Payment Webhook Processing Not Implemented

**Evidence:** `PAYSTACK_SECRET_KEY` is present in `.env.production.example` and `docker-compose.yml`, but no Paystack webhook endpoint exists in `apps/api/src/index.ts` or any router. The booking status update via the admin panel is manual.

**Gap:** Paystack's integration requires a webhook endpoint to receive `charge.success` events and automatically update `booking.paymentStatus` to `"paid"` and `booking.status` to `"confirmed"`. Without this, payment reconciliation is entirely manual.

**Security Note:** Any future webhook endpoint must verify the `x-paystack-signature` header using HMAC-SHA512 with `PAYSTACK_SECRET_KEY` before processing — a common omission that allows spoofed payment confirmations.

### 4.4 Health Check Does Not Verify Database Connectivity

**Evidence:** The `/health` endpoint returns `{ ok: true }` regardless of database state.

**Gap vs. Standard:** Production health checks used by cloud providers (Oracle's load balancer, Kubernetes liveness probes) expect the health check to verify downstream dependency health:
```typescript
// Required:
const result = await db.run(sql`SELECT 1`)
return c.json({ ok: true, db: 'connected' })
```
Without this, a container can appear healthy while being unable to serve any data.

### 4.5 No Structured Error Tracking

No Sentry, Highlight.io, Axiom, or equivalent error-tracking integration exists. The `onError` callback in the tRPC handler logs `INTERNAL_SERVER_ERROR` only. Production failures generate no alerts, capture no stack traces with request context, and cannot be reproduced without access to the server's Pino log output.

### 4.6 No Log Aggregation

Pino logging to stdout (Docker logs) is the only logging mechanism. On Oracle Free Tier, these logs are not persisted, exported, or searchable without manual SSH access. There is no integration with a log aggregation service (Axiom free tier, Grafana Cloud free tier, or even Cloudflare's Logpush on free tier).

### 4.7 Accessibility Gaps vs. WCAG 2.1 AA

| Gap | WCAG Criterion | File |
|---|---|---|
| No skip navigation link | 2.4.1 – Bypass Blocks | `apps/web/src/app/layout.tsx` |
| No `aria-label` on mobile menu button | 4.1.2 – Name, Role, Value | `packages/ui/src/components/Navbar.tsx` |
| Framer Motion ignores `prefers-reduced-motion` | 2.3.3 – Animation from Interactions | `HomeClient.tsx`, `PackageDetailClient.tsx` |
| Booking form lacks `aria-describedby` for errors | 3.3.1 – Error Identification | `PackageDetailClient.tsx` |
| Focus not moved to booking form on reveal | 2.4.3 – Focus Order | `PackageDetailClient.tsx` |
| Sonner toasts not announced via `aria-live` | 4.1.3 – Status Messages | Global |

### 4.8 No `next/env` Startup Validation for Frontend

`apps/web` reads `process.env.NEXT_PUBLIC_APP_URL` and `AUTH_RESEND_KEY` ad-hoc throughout the codebase without startup validation. Unlike `apps/api/src/lib/env.ts` which uses a `required()` guard, the web app can silently deploy with missing variables. `@t3-oss/env-nextjs` is the standard solution.

### 4.9 Strapi CMS Content Not Integrated with Web Frontend

The `apps/cms` Strapi 5 instance is referenced in the README and `.kiro/specs/` but no fetching code exists in `apps/web` that queries Strapi's API. Blog posts and potentially destinations are listed as Strapi-managed content in the architecture documents, but the web app currently reads everything from the Drizzle/SQLite database. The CMS integration is an intended but unimplemented feature.

---

## 5. Production Deployment Readiness

### 5.1 Deployment Architecture Assessment (Oracle Free Tier + Cloudflare Free)

**Architecture as Designed (docker-compose.yml):**
```
Internet → Cloudflare CDN/WAF → Cloudflare Tunnel (free) → Oracle ARM VM
                                                            ├── jemeka-web (port 3000)
                                                            ├── jemeka-api (port 4000)
                                                            └── jemeka-cloudflared (tunnel)
                                                            └── jemeka_data (Docker volume)
```

**Assessment:** This architecture is genuinely appropriate for the free-tier constraint. The Cloudflare Tunnel eliminates the need to open ports 80/443 on Oracle's security lists, provides TLS termination for free, and leverages Cloudflare's global CDN for static assets. The Oracle Free Tier ARM VM (4 OCPU, 24GB RAM on Always Free) is sufficient for this workload.

### 5.2 Environment Configuration — Partially Complete

**Present and correct:**
- `.env.production.example` documents all required variables with clear descriptions
- `docker-compose.yml` passes all secrets via environment variables (no hardcoded values in YAML)
- `JWT_SECRET` notes the correct generation method (`openssl rand -base64 32`)
- `CLOUDFLARE_TUNNEL_TOKEN` is correctly referenced

**Missing:**
- No `DATABASE_AUTH_TOKEN` for Turso/libSQL cloud database (the ADR mentions Turso as the production target, but the env file defaults to a local SQLite file)
- No `NEXTAUTH_SECRET` / `AUTH_SECRET` in the web app's env section of `docker-compose.yml`
- No `NEXT_PUBLIC_APP_URL` defined

### 5.3 Docker Configuration — Functional but Not Hardened

**Strengths:**
- `restart: unless-stopped` on all services ensures automatic recovery after VM reboots
- Named volume (`jemeka_data`) correctly persists SQLite database
- Services communicate via Docker's internal network (web → api via `http://jemeka-api:4000` avoids public exposure)

**Issues:**
- No `user:` directive on any service — all containers run as root, violating least-privilege
- No `mem_limit` or `cpus` resource constraints — a memory leak in one service can starve all others on the shared Oracle VM
- No `healthcheck:` configured on any service — Docker cannot detect failed-but-running containers
- Web container port `3000:3000` exposed to host — in the Cloudflare Tunnel architecture, this should only be accessible via the Docker network, not the host interface

### 5.4 CI/CD Pipeline — Non-Existent (BLOCKER)

`.github/workflows/` is empty. There is no automated:
- Lint check (`eslint`)
- Type check (`tsc --noEmit`)
- Unit test run (`vitest run`)
- Build verification (`next build`)
- Docker image build test
- Deployment trigger

**This is a production deployment blocker.** Without CI, every deployment is a manual, unverified operation. The broken integration test imports are direct evidence that code quality cannot be maintained without automation.

### 5.5 Database Migration Reliability

**Strengths:** A single migration file (`0000_conscious_alice.sql`) establishes the full schema baseline. Drizzle Kit's journal (`meta/_journal.json`) tracks migration state correctly.

**Issues:**
- No documented migration runbook for the Oracle VM deployment (`drizzle-kit migrate` must be run manually after each deployment)
- No rollback migration exists for any schema change
- SQLite's lack of transactional DDL means a failed migration can leave the schema in a partially migrated state — there is no documented recovery procedure

### 5.6 TLS and Security Standards

**TLS:** Correctly handled by Cloudflare Tunnel (free tier provides full TLS from browser to Cloudflare edge, and encrypted tunnel from Cloudflare to Oracle VM). ✅

**Missing Security Controls:**
- No `Content-Security-Policy` header (prevents XSS exploitation)
- No `X-Frame-Options: DENY` (prevents clickjacking)
- No `Strict-Transport-Security` header (should be set at Cloudflare page rule level)
- API port 4000 may be exposed on Oracle's public IP directly if the security list is misconfigured — should be explicitly blocked at Oracle's VCN level

### 5.7 Oracle Free Tier Specific Risks

- **Single VM, Single Point of Failure:** There is no replica, no load balancer, and no failover. An Oracle maintenance window or VM restart causes full downtime.
- **SQLite on Oracle Block Volume:** The database file lives on Oracle's boot volume (or block volume via Docker named volume). Block volume I/O on free tier is limited. Under concurrent writes, SQLite's file locking will serialise all operations. For a booking platform with concurrent users, this is acceptable at low traffic but will degrade under load.
- **Always Free ARM instances can be reclaimed:** Oracle's Always Free terms allow reclamation of Always Free resources for inactivity or capacity constraints. The deployment has no backup strategy for the Docker volume containing the SQLite database.

---

## 6. Risk-Based Remediation Roadmap

Issues are prioritised by combined **Impact × Likelihood** score. Address Phase 1 before any production deployment.

---

### Phase 1 — Pre-Production Blockers (Week 1–2)

These items must be resolved before the application accepts real customer data.

| Priority | Action | File(s) | Effort |
|---|---|---|---|
| **P1.1** | Re-enable TypeScript and ESLint in builds. Remove `ignoreBuildErrors` and `ignoreDuringBuilds`. Fix all resulting errors. | `apps/web/next.config.ts` | Medium |
| **P1.2** | Convert admin page to Server Component. Call `auth()` at top; redirect if no admin session. | `apps/web/src/app/admin/page.tsx` | Low |
| **P1.3** | Gate booking creation behind authentication. Change `create` from `publicQuery` to `authedQuery`. Associate booking with `ctx.user.id`. | `apps/api/src/booking-router.ts` | Low |
| **P1.4** | Fix schema timestamp defaults. Replace `.default(new Date())` with `.$defaultFn(() => new Date())` on all 12 affected columns. | `packages/db/src/schema.ts` | Low |
| **P1.5** | Fix broken integration test imports. Update `booking.integration.test.ts` to import from `@jemeka/db`. Verify `vitest run` passes. | `apps/api/src/booking.integration.test.ts` | Low |
| **P1.6** | Deduplicate `generateBookingRef`. Move to shared `lib/` file. Import in both router and test. | `booking-router.ts`, `booking.test.ts` | Low |
| **P1.7** | Create GitHub Actions CI pipeline with lint, type-check, vitest, and build jobs. | `.github/workflows/ci.yml` | Medium |
| **P1.8** | Add `NEXTAUTH_SECRET`/`AUTH_SECRET` to web service in `docker-compose.yml` and `.env.production.example`. | `docker-compose.yml` | Low |

---

### Phase 2 — Security Hardening (Week 2–4)

| Priority | Action | File(s) | Effort |
|---|---|---|---|
| **P2.1** | Add rate limiting to booking and enquiry creation endpoints (e.g., 5 req/15min/IP). | `apps/api/src/index.ts` | Low |
| **P2.2** | Harden CORS. Pass `FRONTEND_URL` through `required()`. Remove `?? ""` fallback. | `apps/api/src/index.ts` | Low |
| **P2.3** | Add security headers (`CSP`, `X-Frame-Options`, `HSTS`, `X-Content-Type-Options`) via Hono middleware or Cloudflare Transform Rules. | `apps/api/src/index.ts`, Cloudflare dashboard | Medium |
| **P2.4** | Add Paystack webhook endpoint with HMAC-SHA512 signature verification. Auto-update booking status on `charge.success`. | `apps/api/src/` | Medium |
| **P2.5** | Add pagination (`cursor`-based) to all list endpoints. Return `{ items, nextCursor }`. | All `*-router.ts` files | Medium |
| **P2.6** | Configure `images.remotePatterns` in `next.config.ts` for all external image domains. | `apps/web/next.config.ts` | Low |
| **P2.7** | Set `updatedAt: new Date()` in all update mutations. | All `*-router.ts` files | Low |
| **P2.8** | Run containers as non-root. Add `user: node` directive to web and api services. | `docker-compose.yml`, `Dockerfile`s | Low |

---

### Phase 3 — Quality & Operations (Week 4–8)

| Priority | Action | File(s) | Effort |
|---|---|---|---|
| **P3.1** | Implement booking confirmation email using `BookingConfirmationEmail` react-email component triggered on successful booking creation. | `apps/api/src/booking-router.ts` | Medium |
| **P3.2** | Fix health check to verify database connectivity (`SELECT 1`). | `apps/api/src/index.ts` | Low |
| **P3.3** | Add `healthcheck:` to all services in `docker-compose.yml`. | `docker-compose.yml` | Low |
| **P3.4** | Integrate structured error tracking (Sentry free tier or Highlight.io free tier). | `apps/web`, `apps/api` | Medium |
| **P3.5** | Add `turbo.json` pipeline configuration. | Root | Low |
| **P3.6** | Add design tokens to `packages/config/tailwind.config.js`. Replace all `bg-[#0F4C75]` with `bg-brand-navy`. | All frontend files | Medium |
| **P3.7** | Add `@t3-oss/env-nextjs` validation to `apps/web`. | `apps/web/src/` | Low |
| **P3.8** | Remove `docx` and `pptxgenjs` from root production dependencies. | `package.json` | Low |
| **P3.9** | Add SQLite database backup script to Oracle VM cron (e.g., daily `cp` to object storage). | Oracle VM config | Medium |
| **P3.10** | Document manual migration runbook for Oracle VM deployments. | `docs/` | Low |
| **P3.11** | Remove or integrate `apps/api/src/kimi/` dead code. | `apps/api/src/kimi/` | Low |

---

### Phase 4 — Accessibility & Polish (Week 8–12)

| Priority | Action | File(s) | Effort |
|---|---|---|---|
| **P4.1** | Add skip navigation link as first `<body>` child in `layout.tsx`. | `apps/web/src/app/layout.tsx` | Low |
| **P4.2** | Add `aria-label="Open menu"` (toggling to "Close menu") to Navbar hamburger button. | `packages/ui/src/components/Navbar.tsx` | Low |
| **P4.3** | Wrap all Framer Motion variants in `useReducedMotion()`. Set `duration: 0` / disable stagger when true. | `HomeClient.tsx`, `PackageDetailClient.tsx` | Medium |
| **P4.4** | Move focus to first booking form field when form is revealed (`useRef` + `.focus()`). | `PackageDetailClient.tsx` | Low |
| **P4.5** | Add `aria-describedby` to form fields linking to error message elements. | `PackageDetailClient.tsx` | Medium |
| **P4.6** | Integrate `apps/cms` into npm workspaces and create a `turbo` pipeline task for it. | Root `package.json`, `turbo.json` | Medium |
| **P4.7** | Implement Next.js App Router ISR (`export const revalidate = 3600`) on destination and package listing pages. | `apps/web/src/app/` | Low |

---

## Summary of Critical Blockers for Production

The following items constitute hard blockers for a responsible production launch:

1. **TypeScript and ESLint disabled in builds** — zero static safety net
2. **Unauthenticated booking creation** — PII exposure and IDOR risk
3. **Admin page is client-side gated only** — trivially bypassable
4. **No CI/CD pipeline** — no automated quality gate before deployment
5. **Timestamp default bug** — silent data corruption on all time-based fields
6. **No rate limiting** — susceptible to spam attacks that exhaust free-tier email quota
7. **No booking confirmation email** — fundamental UX gap in a booking platform

---

*This report was produced by independent static analysis of the repository at https://github.com/mburu-dev/jemeka-travel as of June 13, 2026. All findings are supported by specific file references, code excerpts, or structural observations drawn directly from the repository contents. Findings represent the state of the codebase at the time of analysis on the `master` branch.*
