# Jemeka Tours & Travel

A modern, full-stack monorepo for a travel and tour company, featuring a Next.js frontend, a Hono/tRPC API, and a Strapi CMS.

## Architecture

- **Apps**:
  - `apps/web`: Next.js 15 frontend with React 19 and Tailwind CSS 4.
  - `apps/api`: Hono backend with tRPC for end-to-end type safety.
  - `apps/cms`: Strapi 5 Headless CMS for content management.
- **Packages**:
  - `packages/db`: Drizzle ORM schema and migrations (SQLite/libsql).
  - `packages/ui`: Shared Radix UI + shadcn/ui components.
  - `packages/config`: Shared Tailwind and TypeScript configurations.
  - `packages/contracts`: Shared TypeScript types and constants.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Hono, tRPC, Zod.
- **Database**: Drizzle ORM, SQLite.
- **CMS**: Strapi.
- **Language**: TypeScript.

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm

### Installation

```bash
npm install
```

### Development

To start all services (Web, API, CMS) concurrently:

```bash
npm run dev
```

## License

Private
