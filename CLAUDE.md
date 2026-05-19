# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Shape

Monorepo with **four independent Vite/React frontends + one Express/TypeScript backend**, all sharing a single `node_modules`, `package.json`, and `shared/` library. There is no per-app `package.json`; every script is invoked from the repo root.

```
admin/    client/    website/    dao/      → Vite SPAs (each has its own vite.config.ts, tsconfig.json, index.html)
backend/                                   → Express API (entry: backend/index.ts, runs under tsx in dev)
shared/                                    → Cross-frontend code, imported via @shared/* alias
supabase/migrations/                       → SQL schema (already applied; treat as source of truth for DB shape)
tests/                                     → Vitest unit + integration tests, factories, fixtures
```

The frontends do **not** import from `backend/`. The backend has its own internal `backend/shared/` (server-only utilities: orchestrator, agents, services, middleware) — **don't confuse it with the top-level `shared/`** which is frontend-only.

## Common Commands

```bash
# Dev (each command runs one process; use multiple terminals or dev:all)
npm run dev              # website + backend (default)
npm run dev:all          # all 4 frontends + backend (concurrently)
npm run dev:admin        # admin only
npm run dev:client       # client only
npm run dev:website      # website only
npm run dev:dao          # dao only
npm run dev:backend      # backend only (tsx watch)

# Build (writes to dist/<app>/ and dist/backend/)
npm run build            # all
npm run build:<app>      # one app (admin|client|website|dao|backend)

# Validation
npm run typecheck        # tsc --noEmit across all 4 frontends + backend
npm run lint             # eslint .
npm run validate         # typecheck + lint + tests (use before committing)
npm run pre-commit       # same trio, runs typecheck + lint:types + test:run

# Tests (Vitest)
npm test                 # watch mode
npm run test:run         # single run
npm run test:unit        # tests/unit only
npm run test:integration # tests/integration only
npm run test:coverage    # with coverage (Istanbul)
npx vitest run path/to/file.test.ts          # single file
npx vitest run -t "test name pattern"        # single test by name

# Shared-library tooling
npm run validate:shared          # checks shared imports
npm run analyze:shared           # reports usage
npm run generate:component       # scaffold a shared component
npm run generate:hook            # scaffold a shared hook
```

## Dev Server Ports (authoritative — README disagrees)

The README and DEPLOYMENT_QUICKSTART contradict each other on dev ports. The **actual** ports come from each app's `vite.config.ts`:

| App      | Port | Source                          |
|----------|------|---------------------------------|
| client   | 5173 | `client/vite.config.ts`         |
| admin    | 5174 | `admin/vite.config.ts`          |
| website  | 5175 | `website/vite.config.ts`        |
| dao      | 5177 | `dao/vite.config.ts`            |
| backend  | 3001 | `backend/shared/config/server.ts` |

In production (nginx, see `nginx.conf` / `Dockerfile.frontend`), all four frontends are served from a single origin under sub-paths: `/` → website, `/admin`, `/client`, `/dao`. This is why each app's `vite.config.ts` sets `base: /<appName>/` (website uses `/`).

## Architecture Notes

### Vite config is centralized

All four frontends share `vite.config.base.ts` via `createViteConfig({ appName, port })`. The base config sets:
- `root: <appDir>` — each app has its own `index.html`
- `base: /<appName>/` (or `/` for website) — required for nginx sub-path routing
- `outDir: dist/<appName>` — Dockerfile.frontend assumes this layout
- `@shared` alias → repo-root `shared/`

When adding a new frontend, copy an existing `<app>/vite.config.ts` (1-liner) and a `tsconfig.json` that extends `tsconfig.app.template.json`.

### Backend uses ESM with `.js` extension imports

`backend/tsconfig.backend.json` targets ESNext modules. Look at `backend/index.ts` — internal imports use `./shared/orchestrator/Orchestrator.js` (`.js` suffix even though sources are `.ts`). This is required by Node's ESM resolver; preserve this when adding new imports. `tsx` (used in `dev:backend`) handles the `.ts` → `.js` mapping at runtime.

### Two Supabase clients (security boundary)

Don't collapse these — the separation is intentional:

1. **Service-role client** (`backend/shared/services/supabase/`): uses `SUPABASE_SERVICE_ROLE_KEY`, bypasses RLS. Used by admin/, client/, dao/ backend modules, orchestrator, AI agents.
2. **Anon client** (`backend/website/config/supabaseWebsiteClient.ts`): uses `SUPABASE_ANON_KEY`, respects RLS. Used **only** by `backend/website/` public endpoints.

If you add a public read endpoint, it must go under `backend/website/` and use the anon client. If you reuse the service-role client there, you bypass RLS on a public surface — that's the failure mode this split prevents.

### Backend route registration

`backend/index.ts` is the single mount point for all routes. Modules are organized by audience (`admin/`, `client/`, `website/`, `dao/`, `shared/`), each with `routes/`, `controllers/`, and `services/` subfolders. The DI container (`backend/shared/infrastructure/Container.ts`) is initialized before routes — controllers are pulled from it after the orchestrator boots so they can be wired with the orchestrator instance.

### Orchestrator + AI agents

`backend/shared/orchestrator/Orchestrator.ts` runs a state machine that polls 6 LLM providers (`backend/shared/agents/providers.ts`), arbitrates messages by importance, and drives plan edits via `services/planEditor.ts`. It is started inside `app.listen` callback and stopped on SIGINT/SIGTERM. If an agent's API key is missing, the whole backend will still start (the orchestrator logs but doesn't crash) — but no debate messages will appear. Required keys: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GROK_API_KEY`, `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, `QWEN_API_KEY`.

### Shared library rules

Top-level `shared/` is consumed by all four frontends via `@shared/*`. Strict rules enforced (see `shared/README.md` and `npm run validate:shared`):
- No imports from any specific app (`@admin/*`, `@client/*`, etc.)
- No hardcoded app-specific values — accept props instead
- Everything must work in 2+ apps OR be a universal utility

If a component is only used by one app, it lives in `<app>/components/`, not `shared/`.

### Environment variables

Two `.env` files:
- **Root `.env`** — read by Vite for all four frontends. Only `VITE_*` vars are exposed to client code. The Supabase URL/anon key and backend secrets also live here for `docker compose` (which reads only the root `.env`, not `backend/.env`).
- **`backend/.env`** — read by the backend in local dev. Contains service-role key + 6 AI provider keys. Not used in Docker.

`backend/index.ts` calls `validateEnvironment()` on boot and exits if any of `REQUIRED_ENV_VARS` (defined in `backend/shared/config/server.ts`) are missing.

### Testing

Vitest with global setup in `tests/setup/`. Test data comes from factories in `tests/factories/` (`ProposalFactory`, `UserFactory`, etc.) — prefer these over hand-rolled fixtures. Coverage targets: 80% lines/functions/statements, 75% branches.

## Production / Deployment

- `Dockerfile.frontend` builds all four SPAs into `dist/<app>/` and serves them through nginx (config at `nginx.conf`). The nginx layer also proxies `/api/*` to the backend container.
- `Dockerfile.backend` compiles via `tsc -p tsconfig.backend.json` and runs the resulting `dist/backend/index.js`.
- `docker-compose.yml` wires both with healthchecks; `manifests.prod.yaml` is the equivalent for Kubernetes.
- CI: `.github/workflows/build-k8s.yaml` (see `build-k8s.yaml` at repo root for the actual file referenced) builds and pushes to GHCR on push to main/develop.

## Where to look

- API surface and endpoint contracts: `backend/API.md`
- Frontend conventions, accessibility, component library: `DEVELOPER_GUIDE.md` and `FRONTEND_ARCHITECTURE.md`
- Operations, rate limiting, retention policy: `OPERATIONS.md`
- Domain-specific guides (airdrop OAuth, U2E, portfolio, tokenomics, DAO): `docs/`
- Database shape: `supabase/migrations/` (chronological SQL)
