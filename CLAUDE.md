# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm dev              # Start all apps (API + Web) in dev mode
pnpm dev:api          # API only (port 7071, debug enabled)
pnpm dev:web          # Web only (port 8081)
pnpm build:api        # Build API for production
pnpm build:web        # Build Web for production
pnpm start:api        # Start API in production mode
pnpm start:web        # Start Web in production mode
pnpm test             # Run API tests (Vitest)
pnpm lint             # Biome check entire monorepo
pnpm lint --fix       # Biome check and auto-fix
pnpm type-check       # TypeScript type-check all packages
pnpm type-check:api   # Type-check API only
pnpm type-check:web   # Type-check Web only
```

### Infrastructure

```bash
pnpm start-dependencies   # docker compose up -d (MongoDB)
pnpm stop-dependencies    # docker compose down
```

## Architecture

pnpm monorepo with Turbo for task orchestration. Node >= 24.

### Workspace Layout

- `apps/api` — Fastify REST API with MongoDB/Typegoose, JWT auth, Copera SDK integration
- `apps/web` — React 19 + Vite + Tailwind CSS 4, React Query for server state, Zustand for client state
- `packages/common` — Shared utilities: MongoDB connection (`./core`), HTTP error classes (`./api-utils`)

Shared dependency versions are managed via catalogs in `pnpm-workspace.yaml`.

### Key Architectural Patterns

**API**: Controller classes via `fastify-decorators` → service functions exported as namespaces. Routes require JWT by default; use `@isPublic()` decorator to skip auth. Services write to Copera SDK and cache locally in MongoDB.

**Web**: Pages in `src/pages/`, API calls in `src/requests/` (namespace exports), React Query hooks in `src/hooks/`, Zustand stores in `src/stores/`. Auth via `AuthProvider` context with `AuthGuard`/`GuestGuard` route wrappers. UI components follow shadcn/ui patterns with CVA variants.

**Common package**: Built with `tsdown`, exports three entry points: `/`, `./core`, `./api-utils`.

## Code Style

**Linter/Formatter**: Biome (not ESLint/Prettier). Run `pnpm lint` to check.

**Formatting differences by app**:
- API: double quotes, 80-char line width
- Web: single quotes, 80-char line width

**API-specific rules**:
- Import extensions required (`.js` suffix on all relative imports)
- `no-console` is an error — use Pino logger instead
- Default exports and namespaces are allowed (needed for fastify-decorators)

**Web-specific rules**:
- Default exports allowed (needed for pages/routes)
- `useImportExtensions` is off

**Import organization**: Biome auto-organizes imports. API groups: node builtins → packages → aliases. Web groups: packages → aliases.

## Commits

Conventional commits enforced via commitlint + husky pre-commit hooks. Format: `type(scope): message` (e.g., `feat(api): add ticket filtering`).

## Path Aliases

- API: `~/` → `src/` (e.g., `import { Env } from "~/utils/Env.js"`)
- Web: `src/` → `src/` and `@components/` → `src/components/` (e.g., `import { Button } from '@components/ui/button'`)

## Patched Dependencies

`fastify-decorators` and `tscpaths` have local patches in `/patches/`.
