# Base Application Template

A full-stack monorepo starter template for building applications with the [Copera SDK](https://www.npmjs.com/package/@copera.ai/sdk). Built with Fastify, React, and MongoDB — ready for production deployment.

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.28.2-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

This monorepo contains everything you need to build, develop, and deploy a Copera-powered application:

| Workspace | Path | Description |
|-----------|------|-------------|
| **API** | `apps/api` | Fastify REST API with MongoDB, JWT auth, and Copera SDK integration |
| **Web** | `apps/web` | React 19 SPA with Tailwind CSS, React Query, and Zustand |
| **Common** | `packages/common` | Shared utilities — MongoDB connection, HTTP error classes, logger |

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Fastify 5, Typegoose (Mongoose 9), JWT, Pino, [Copera SDK](https://www.npmjs.com/package/@copera.ai/sdk) |
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, React Query 5, Zustand 5, React Router 7 |
| **Shared** | TypeScript 5.9, Zod, Yup |
| **Tooling** | pnpm workspaces, Turborepo, Biome, Husky, Commitlint |
| **Infrastructure** | Docker, GitHub Actions, AWS S3 + CloudFront |

## Prerequisites

- [Node.js](https://nodejs.org/) >= 24.0.0 (`.nvmrc`: v24.13.0)
- [pnpm](https://pnpm.io/) 10.28.2 (via corepack)
- [MongoDB](https://www.mongodb.com/atlas/database) (create a free cluster on MongoDB Atlas)
- A [Copera API key](https://developers.copera.ai) (see the developer docs for how to obtain one)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/copera-ai/base-application-template.git
cd base-application-template

# Enable corepack and activate pnpm
corepack enable
corepack prepare pnpm@10.28.2 --activate

# Install dependencies
pnpm install

# Configure environment variables
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your values (see Environment Variables below)

# Start all apps in development mode
pnpm dev
```

The API will be available at `http://localhost:7071` and the web app at `http://localhost:8087`.

## Environment Variables

### API (`apps/api/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string ([create a free cluster](https://www.mongodb.com/atlas/database)) |
| `APP_TOKEN` | Secret key used for JWT signing |
| `COPERA_API_KEY` | Your Copera API key ([how to get one](https://developers.copera.ai)) |

### Web (`apps/web/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_SERVER_URL` | API base URL (default: `http://localhost:7071/api`) |

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm dev:api` | Start API only (port 7071) |
| `pnpm dev:web` | Start Web only (port 8087) |
| `pnpm build:api` | Build API for production |
| `pnpm build:web` | Build Web for production |
| `pnpm start:api` | Start API in production mode |
| `pnpm start:web` | Start Web in production mode |
| `pnpm test` | Run API tests (Vitest) |
| `pnpm lint` | Biome lint & format check |
| `pnpm lint --fix` | Biome lint & auto-fix |
| `pnpm type-check` | TypeScript type-check all packages |

## Project Structure

```
base-application-template/
├── apps/
│   ├── api/                  # Fastify REST API
│   │   ├── src/
│   │   │   ├── service/      # Controllers & services by domain
│   │   │   ├── models/       # Typegoose data models
│   │   │   ├── infra/        # Server & Copera SDK setup
│   │   │   ├── utils/        # Hooks, decorators, helpers
│   │   │   └── main.ts       # Entry point
│   │   └── .env.example
│   └── web/                  # React SPA
│       └── src/
│           ├── auth/         # AuthProvider, guards, hooks
│           ├── components/   # UI components (shadcn/ui)
│           ├── hooks/        # React Query hooks
│           ├── pages/        # Page components
│           ├── requests/     # API request functions (Axios)
│           ├── stores/       # Zustand stores
│           └── main.tsx      # Entry point
├── packages/
│   └── common/              # Shared utilities
│       └── src/
│           ├── index.ts      # Main exports
│           ├── core/         # MongoDB connection
│           └── api-utils/    # HTTP error classes
├── infra/
│   ├── Dockerfile.api        # Production Docker image
│   ├── docker-compose.yml    # Production compose config
│   └── .env.example          # Production env template
├── patches/                  # Patched dependencies
├── biome.json                # Linter & formatter config
├── turbo.json                # Turborepo task config
├── pnpm-workspace.yaml       # Workspace & dependency catalogs
└── commitlint.config.js      # Commit message rules
```

## Apps

### API (`apps/api`)

Fastify REST API using the controller/service pattern via `fastify-decorators`.

- **Dev port**: 7071 | **Prod port**: 3000
- Routes require JWT auth by default; use `@isPublic()` to skip
- Services write to [Copera SDK](https://www.npmjs.com/package/@copera.ai/sdk) and cache locally in MongoDB
- Logging via Pino (`no-console` rule enforced)
- Path alias: `~/` maps to `src/`

### Web (`apps/web`)

React 19 SPA with a shadcn/ui component library.

- **Dev port**: 8087
- API calls in `src/requests/`, React Query hooks in `src/hooks/`
- Auth via `AuthProvider` context with `AuthGuard` / `GuestGuard` route wrappers
- Client state managed with Zustand stores
- Path aliases: `src/` and `@components/` map to `src/` and `src/components/`

## Docker & Production Deployment

### Remote deployment

The `infra/` directory contains everything needed to deploy the API:

```bash
# 1. Configure environment
cp infra/.env.example infra/.env
# Edit infra/.env with production values

# 2. Pull and start the container
cd infra
docker compose up -d
```

The pre-built image is published to `ghcr.io/copera-ai/base-app-api:latest`.
A health check endpoint is available at `/health`.

### Building the Docker image locally

```bash
docker build -f infra/Dockerfile.api -t base-app-api .
```

## CI/CD

GitHub Actions workflows automate deployment on push to `main`:

1. **Change detection** — `changed_apps.yaml` uses git diff to determine which apps were modified
2. **Web** — Builds with Vite, syncs to S3, and invalidates the CloudFront cache
3. **API** — Builds a Docker image, pushes to GHCR, and deploys to a VPS via SSH

## Code Quality & Conventions

- **Linting & formatting**: [Biome](https://biomejs.dev/) (not ESLint/Prettier) — run `pnpm lint`
- **Pre-commit hooks**: Husky + lint-staged run Biome on staged files
- **Commit messages**: [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint
  - Format: `type(scope): message` (e.g., `feat(api): add ticket filtering`)
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, etc.
- **VS Code**: Biome extension recommended for editor integration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes following the conventions above
4. Run checks before committing:
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test
   ```
5. Commit using conventional commits (`feat:`, `fix:`, `docs:`, etc.)
6. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
