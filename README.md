# 🇱🇹 AI Lithuanian Learning App

An intelligent language learning application that uses AI to generate personalized Lithuanian word packs with context, examples, and spaced repetition.

## 🌟 Features

- **AI-Powered Word Generation**: Create custom word packs using OpenAI
- **Flashcard Learning**: Interactive study interface with progress tracking
- **User Authentication**: Secure login with Better Auth
- **Pack Management**: Create, organize, and share word collections
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Cloudflare Deployment**: Scalable infrastructure with edge computing

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

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, tRPC
- **Database**: Drizzle ORM, SQLite/D1
- **Authentication**: Better Auth
- **AI**: OpenAI API, Google Gemini
- **Deployment**: Cloudflare Workers/Pages
- **Testing**: Vitest, React Testing Library, Playwright

## 🎯 Current Status

- ✅ MVP with basic word generation and authentication
- 🔄 Production hardening in progress
- 📅 Advanced features planned

## 📄 License

MIT License - see LICENSE file for details.
