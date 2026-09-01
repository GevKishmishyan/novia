# NOVIA

A calm, editorial wedding and event planning product.

## Workspace

- `apps/web` — Next.js App Router web application
- `packages/contracts` — transport-safe schemas shared by future clients and APIs
- `supabase/migrations` — version-controlled database migrations

## Local development

Use Node.js 24 and pnpm 11.

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Set these public Supabase values in `apps/web/.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_replace_me
```

Never place the Supabase service-role key in a `NEXT_PUBLIC_*` variable or commit it.

The application runs at `http://localhost:3000`. Customer authentication starts at `/login`; the isolated owner experience starts at `/admin/login`.

## Database

Apply every SQL file in `supabase/migrations` in filename order. The migrations create invitation drafts, owner membership, template management, indexes, and row-level security. Database authorization is enforced by RLS in addition to application route checks.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm build
```

`pnpm check` runs the complete merge gate: lint, strict type checking, coverage-enforced tests, and a production build. Coverage reports are written to `apps/web/coverage` and are ignored by Git. The thresholds are a regression floor, not a claim that every visual branch can be meaningfully unit tested.

Critical automated coverage includes:

- customer and owner login, logout, signup, recovery, and confirmation flows;
- customer/owner route separation and safe redirects;
- invitation draft validation and persistence;
- owner-only template creation and duplicate handling;
- live invitation editing and core public pages.

## Git workflow

Create `feature/*` branches from `develop` and open pull requests back into `develop`. GitHub Actions runs linting, strict type checks, coverage-enforced tests, and a production build. Successful coverage reports remain downloadable from the workflow run for seven days.

Production changes move from `develop` to `master` through a separate pull request. CI rejects pull requests into `master` from any other branch. Repository rules and their recommended GitHub settings are documented in `.github/BRANCH_PROTECTION.md`.

Dependabot opens grouped dependency updates against `develop`; no dependency update merges automatically.

## Architecture

- UI lives in `apps/web/src/components`; App Router pages compose it.
- Versioned Route Handlers live under `apps/web/src/app/api/v1`.
- Shared transport validation lives in `packages/contracts`.
- Supabase access is isolated behind server helpers and repositories.
- Production database changes belong in new, immutable migration files.

## Brand assets

Production SVGs live in `apps/web/public/brand`. Preserve the founder-provided artwork rather than regenerating it.
