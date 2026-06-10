# ADR 1: Monorepo Architecture with Hono and Next.js

## Status
Accepted

## Context
We need a scalable, maintainable, and type-safe architecture for the Jemeka Tours platform. The platform includes a frontend website, a backend API, and a content management system.

## Decision
We have decided to use a **Turborepo monorepo** with the following stack:
- **Apps**:
  - `web`: Next.js 15 (App Router) for the user-facing website.
  - `api`: Hono (Node.js) for the core business logic and tRPC API.
  - `cms`: Strapi 5 for content management.
- **Packages**:
  - `db`: Shared database schema and migrations using Drizzle ORM.
  - `ui`: Shared UI component library using Radix UI and shadcn/ui.
  - `config`: Shared Tailwind and TypeScript configurations.

## Consequences
- **Pros**:
  - End-to-end type safety between the API and the Web app via tRPC.
  - High reusability of UI components and database logic.
  - Faster development with local linking of packages.
- **Cons**:
  - Increased complexity in build pipelines and environment management.
  - Higher initial setup overhead.
