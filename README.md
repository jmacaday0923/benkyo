# Benkyo

[![CI](https://github.com/jmacaday0923/benkyo/actions/workflows/ci.yml/badge.svg)](https://github.com/jmacaday0923/benkyo/actions/workflows/ci.yml)

Benkyo (勉強, "study") is a web app for learners preparing for the Japanese-Language Proficiency Test (JLPT). Learners build decks of vocabulary and kanji cards, review them on a spaced repetition schedule, and track streaks and progress by JLPT level, in English or Japanese.

> **Status:** Phase 1 (foundation) is complete. Features arrive phase by phase; see the [roadmap](#roadmap).

**Live demo:** coming soon <!-- Replace with the deployed URL. -->

## Screenshots

Screenshots will be added as features land.

<!--
![Home page in English](docs/screenshots/home-en.png)
![Home page in Japanese](docs/screenshots/home-ja.png)
-->

## What's in place

- English and Japanese interface with locale-prefixed URLs (`/en`, `/ja`) and automatic language detection
- PostgreSQL schema for users, decks, cards and SM-2 review state, with type-safe queries and database-level constraints
- Seed script with sample JLPT N5 vocabulary
- Environment variables validated at startup, with clear errors when something is missing
- Translation files type-checked against each other, so a missing Japanese string fails the build
- CI that lints, checks formatting, type-checks, tests and builds every push and pull request

## Tech stack

| Area                 | Technology                                                 |
| -------------------- | ---------------------------------------------------------- |
| Framework            | Next.js 16 (App Router, React Server Components), React 19 |
| Language             | TypeScript (strict mode)                                   |
| Styling              | Tailwind CSS 4, shadcn/ui                                  |
| Database             | PostgreSQL 18, Drizzle ORM                                 |
| Internationalization | next-intl                                                  |
| Validation           | Zod                                                        |
| Testing              | Vitest, React Testing Library                              |
| Tooling              | pnpm, ESLint, Prettier, Docker Compose                     |
| CI                   | GitHub Actions                                             |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 24 LTS (see `.nvmrc`)
- [pnpm](https://pnpm.io/) 12
- [Docker](https://www.docker.com/) with Docker Compose

### Run locally

```bash
git clone https://github.com/jmacaday0923/benkyo.git
cd benkyo
pnpm install
cp .env.example .env

pnpm db:up        # start PostgreSQL in Docker
pnpm db:migrate   # create the tables
pnpm db:seed      # load the sample N5 deck

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). You are redirected to `/en` or `/ja` based on your browser language.

## Scripts

| Command             | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `pnpm dev`          | Start the development server                          |
| `pnpm build`        | Create a production build                             |
| `pnpm start`        | Serve the production build                            |
| `pnpm lint`         | Lint with ESLint (warnings fail the run)              |
| `pnpm format`       | Format all files with Prettier                        |
| `pnpm format:check` | Check formatting without writing changes              |
| `pnpm typecheck`    | Generate route types and run the TypeScript compiler  |
| `pnpm test`         | Run the unit tests once                               |
| `pnpm test:watch`   | Run the unit tests in watch mode                      |
| `pnpm db:up`        | Start the PostgreSQL container and wait until healthy |
| `pnpm db:down`      | Stop the PostgreSQL container                         |
| `pnpm db:generate`  | Generate a SQL migration from schema changes          |
| `pnpm db:migrate`   | Apply pending migrations                              |
| `pnpm db:seed`      | Reset the demo user and load the sample N5 deck       |
| `pnpm db:studio`    | Browse the database in Drizzle Studio                 |

## Environment variables

| Variable        | Required | Description                                                |
| --------------- | -------- | ---------------------------------------------------------- |
| `DATABASE_URL`  | Yes      | PostgreSQL connection string                               |
| `POSTGRES_PORT` | No       | Host port for the Docker Compose database (default `5432`) |

Variables are validated with Zod in [`src/lib/env.ts`](src/lib/env.ts). The server refuses to start, and the build fails, if a value is missing or invalid.

## Project structure

```text
.
├── .github/workflows/     CI pipeline
├── drizzle/               Generated SQL migrations
├── messages/              Translations (en.json, ja.json)
├── src/
│   ├── app/[locale]/      Pages and layouts, served under /en and /ja
│   ├── components/        UI components (ui/ holds shadcn/ui primitives)
│   ├── db/                Drizzle schema, database client and seed script
│   ├── i18n/              Locale routing and translation loading
│   ├── lib/               Shared utilities and environment validation
│   ├── env.ts             Validated environment variables
│   ├── instrumentation.ts Startup checks
│   └── proxy.ts           Locale detection and redirects
├── compose.yaml           Local PostgreSQL
└── drizzle.config.ts      Drizzle Kit configuration
```

## Roadmap

- [x] **Phase 1: Foundation.** Next.js, TypeScript, Tailwind CSS and shadcn/ui; PostgreSQL with Drizzle; English and Japanese routing; environment validation; tests and CI
- [ ] **Phase 2: Authentication** and deck and card management
- [ ] **Phase 3: Review sessions** with spaced repetition (SM-2), fully unit tested, plus stats and streaks
- [ ] **Phase 4: Japan-specific features:** furigana, N5 vocabulary import, kanji readings
- [ ] **Phase 5: Quality and reach:** Playwright end-to-end tests, offline support, progress charts
- [ ] **Phase 6: Production hosting** on AWS with Terraform, plus error monitoring
