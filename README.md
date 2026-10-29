# 🇱🇹 AI Lithuanian Learning App

An intelligent language learning application that uses AI to generate personalized Lithuanian word packs with context, examples, and spaced repetition.

## 🌟 Features

- **AI-Powered Word Generation**: Create custom word packs using _Google Gemini_
- **Flashcard Learning**: Interactive study interface with _progress tracking_
- **Pack Management**: Create, organize, and _share_ word collections

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

## 📁 Project Structure

```
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities and configurations
│   └── db/           # Database schema and migrations
└── public/           # Static assets
```

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS — served through Next.js APIs on Vite (vinext), deployed to Cloudflare Workers
- **Backend**: Route handlers
- **Database**: Drizzle ORM, SQLite/D1
- **Authentication**: Better Auth
- **AI**: Google Gemini
- **Deployment**: Cloudflare Workers
- **Testing**: Vitest, React Testing Library, Playwright (**WIP**)

## CI/CD

GitHub Actions owns CI/CD through `.github/workflows/ci.yml`:

- Pull requests run lint, typecheck, formatting checks, and the Vinext build.
- Pushes to `main` run the same checks and deploy that build to Cloudflare Workers.
- Manual runs on `main` can redeploy after updating build-time configuration.
- Production runs are serialized; superseded pull-request checks are cancelled.

Cloudflare Workers hosts the application. Its separate repository build trigger
has been removed to prevent duplicate deployments.

Repository secrets:

- `CLOUDFLARE_API_TOKEN`: a deployment token authorized for the target account and
  the Worker's configured resources.
- `CLOUDFLARE_ACCOUNT_ID`: the account containing `ai-lithuanian`.
- `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`: optional public
  build-time configuration. Fork pull requests build without these secrets.

Runtime secrets (authentication and AI credentials) stay on the Worker, not in the
build environment. Database migrations are not automatic; review and apply any
required production migrations separately before deploying code that needs them.

For a local production preview, run `pnpm preview`. `pnpm deploy` builds and
publishes directly and should be reserved for intentional manual deployments.

## 🎯 Current Status

- ✅ MVP with basic word generation and authentication
- 🔄 Production hardening in progress
- 📅 Advanced features planned

## 📄 License

MIT License - see LICENSE file for details.
