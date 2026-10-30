# AI Lithuanian

Generate and study Lithuanian vocabulary packs with AI-powered examples and translations.

## Development

Requires Node.js 22 and pnpm 11.

```sh
pnpm install
cp .dev.vars.example .dev.vars
# Fill in the required local secrets in .dev.vars.
pnpm db:migrate
pnpm dev
```

Open <http://localhost:5173>.

Google and GitHub OAuth credentials need local provider configuration for sign-in. Optional public analytics settings are in `.env.example`; see [environment configuration](docs/environment.md).

## Checks

```sh
pnpm check
pnpm fmt:check
pnpm test
pnpm db:test
pnpm build
```

Generation requests use Google Gemini. Fast tests mock AI and authentication; they make no provider requests. D1 migration tests use isolated local databases.

## Deployment

Pull requests run checks and build the application. Successful CI on `main` deploys to Cloudflare Workers. Production database migrations are not applied automatically; review the procedure in [docs/database.md](docs/database.md).

## Storage

Authentication data is stored in D1. Vocabulary packs are currently stored in the browser's local storage and are not synchronized between devices.
