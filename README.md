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

## 🎯 Current Status

- ✅ MVP with basic word generation and authentication
- 🔄 Production hardening in progress
- 📅 Advanced features planned

## 📄 License

MIT License - see LICENSE file for details.
