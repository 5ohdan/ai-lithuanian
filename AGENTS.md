# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 16 (App Router, Turbopack) app — an AI-powered Lithuanian
learning app. It targets Cloudflare Workers via OpenNext, using Cloudflare D1 (SQLite)
and KV. Local dev emulates the Cloudflare bindings through Wrangler/OpenNext.

### Services

There is one service: the Next.js dev server (`pnpm dev` → `next dev --turbopack`) on
`http://localhost:3000`. Cloudflare bindings (`DB` = D1, `SESSION_STORAGE` = KV) are
emulated locally from `.wrangler/state`; there is no separate DB process to start.

Standard commands live in `package.json` (`dev`, `build`, `lint`, `typecheck`, `check`,
`db:migrate`, `db:generate`, `db:push`, `db:studio`). `pnpm check` = `oxlint --type-aware && tsc --noEmit`.

### Non-obvious caveats

- Env vars are NOT read from `.env`/`process.env` at runtime. `src/lib/env.ts` reads them
  from `getCloudflareContext().env`, which in local dev comes from a gitignored `.dev.vars`
  file (Wrangler convention). Create `.dev.vars` (see `.env.example` for the keys) or the
  server env Zod parse throws on any authenticated/AI route. All six server vars
  (`BETTER_AUTH_SECRET`, `GOOGLE_GENERATIVE_AI_API_KEY`, `GITHUB_CLIENT_ID/SECRET`,
  `GOOGLE_CLIENT_ID/SECRET`) are required by the schema even though only some are used per route.
- The local D1 database must have migrations applied before auth works. Use
  `pnpm exec wrangler d1 migrations apply ai-lithuanian --local` (drizzle-kit `db:migrate`
  needs the local `.wrangler/state/v3/d1/*.sqlite` to already exist, so run the wrangler
  command first on a fresh checkout).
- Auth is OAuth-only (GitHub + Google via Better Auth); there is no email/password flow.
  Real end-to-end login needs valid OAuth apps. For local testing you can insert a `user` +
  `session` row into local D1 and send a signed cookie
  `better-auth.session_token=<token>.<base64 HMAC-SHA256(token, BETTER_AUTH_SECRET)>`.
- Word packs and flashcards are stored in the browser's `localStorage`
  (key `wordLearningStorage`, shape = `src/lib/schemas` `storageSchema`), NOT in D1. D1 only
  holds Better Auth tables (user/session/account) plus mostly-unused pack tables. So the
  flashcard/study UI can be exercised by seeding `localStorage` without calling the AI.
- The AI word-generation routes (`/api/words/*`) require a real
  `GOOGLE_GENERATIVE_AI_API_KEY` (Google Gemini) and an authenticated session.
- `pnpm fmt:check` currently reports pre-existing formatting diffs in `cloudflare-env.d.ts`
  (generated) and `src/lib/env.ts`; these are not caused by env setup.
