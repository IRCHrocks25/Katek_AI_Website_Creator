# AI Website Builder

A beautiful, production-ready landing page builder with AI-powered section generation. Built with Next.js, TypeScript, Prisma, and OpenAI.

## Features

- 🎨 **Visual Editor**: 3-panel layout (sections, preview, inspector)
- 🤖 **AI Generation**: Generate sections with OpenAI
- 📱 **Live Preview**: Real-time preview with mobile/desktop views
- 🔐 **Authentication**: Email/password auth with NextAuth
- 📊 **Dashboard**: Project management with search
- 🚀 **Publishing**: One-click publish to public URLs
- 💾 **Autosave**: Automatic saving with debounce
- 🎯 **Component Tree**: JSON-based component system

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Drag & Drop**: dnd-kit
- **Animations**: Framer Motion
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js (Auth.js)
- **AI**: OpenAI API
- **Deployment**: Railway

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd AI_Website_Development
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with:
```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
AUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Railway

See **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** for complete deployment instructions.

**Quick steps:**
1. Create a new Railway project and connect your GitHub repo
2. Add a PostgreSQL service
3. Set environment variables (see RAILWAY_DEPLOYMENT.md)
4. Deploy! Railway auto-detects Next.js projects

**Important:** After first deployment, run database migrations:
```bash
railway run npx prisma db push
```

For your Railway URL `katekaiwebsitecreator-production.up.railway.app`, set:
```
NEXTAUTH_URL=https://katekaiwebsitecreator-production.up.railway.app
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── editor/            # Editor pages
│   ├── login/             # Auth pages
│   └── p/                 # Published pages
├── components/
│   ├── editor/            # Editor components
│   ├── renderer/          # Component renderers
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities
├── prisma/                # Prisma schema
├── store/                 # Zustand stores
└── types/                 # TypeScript types
```

## Component Tree System

The app uses a JSON-based component tree system. All pages are stored as JSON, making it:
- Easy for AI to generate/edit
- Simple to render
- Trivial to export/import

Component types:
- `Page`: Root container
- `Section`: Page sections (hero, features, pricing, etc.)
- `Stack`: Layout container (horizontal/vertical)
- `Text`: Text content (h1-h6, p, span)
- `Button`: Interactive buttons
- `Image`: Images

## AI Integration

The AI generates sections based on:
- Product name
- One-liner description
- Tone (professional, friendly, casual, etc.)
- Section type (hero, features, pricing, etc.)

All AI output is validated against JSON schemas to ensure consistency.

## License

## License

MIT

---

# Katek AI Website Creator

Production deployment: [katekaiwebsitecreator-production.up.railway.app](https://katekaiwebsitecreator-production.up.railway.app)
