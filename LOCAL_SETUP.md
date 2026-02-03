# Local Development Setup Guide

Complete step-by-step instructions to run this project on your local machine.

## Prerequisites

Before you begin, make sure you have:

- **Node.js 20+** installed ([Download](https://nodejs.org/))
- **PostgreSQL** installed and running ([Download](https://www.postgresql.org/download/))
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Git** (if cloning from repository)

## Step-by-Step Setup

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including Next.js, Prisma, and UI components.

### Step 2: Set Up PostgreSQL Database

#### Option A: Using Local PostgreSQL

1. **Start PostgreSQL** (if not already running):
   ```bash
   # macOS (using Homebrew)
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   
   # Windows (using Services)
   # Start PostgreSQL service from Services panel
   ```

2. **Create a database**:
   ```bash
   # Connect to PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE ai_website_builder;
   
   # Exit
   \q
   ```

#### Option B: Using Docker (Easier)

If you have Docker installed:

```bash
docker run --name postgres-ai-builder \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ai_website_builder \
  -p 5432:5432 \
  -d postgres:15
```

This creates a PostgreSQL container with:
- Database name: `ai_website_builder`
- Password: `postgres`
- Port: `5432`

### Step 3: Create Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Or create it manually with this content:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_website_builder"

# Auth Secret (generate a random string)
AUTH_SECRET="your-random-secret-here-minimum-32-characters-long"

# NextAuth URL (for local development)
NEXTAUTH_URL="http://localhost:3000"

# OpenAI API Key
OPENAI_API_KEY="sk-your-openai-api-key-here"
```

#### Generate AUTH_SECRET

Run this command to generate a secure random secret:

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output and paste it as your `AUTH_SECRET` value.

### Step 4: Set Up Database Schema

Run Prisma commands to generate the client and push the schema:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push
```

You should see output like:
```
✔ Generated Prisma Client
✔ Database synchronized
```

### Step 5: Start Development Server

Run the development server:

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Ready in 2.3s
```

### Step 6: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## First Time Usage

1. **Sign Up**: Click "Get Started" or go to `/signup`
   - Create an account with email and password

2. **Create Project**: 
   - You'll be redirected to the dashboard
   - Click "New Project"
   - Enter a project name

3. **Start Building**:
   - The editor will open automatically
   - Add sections from the left panel
   - Click the ✨ icon to generate with AI
   - Edit components in the inspector panel

## Common Issues & Solutions

### Issue: "Can't reach database server"

**Solution:**
- Verify PostgreSQL is running: `pg_isready` or check Docker container
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Ensure database exists: `psql -l` should list `ai_website_builder`

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

### Issue: "Port 3000 already in use"

**Solution:**
- Kill the process using port 3000:
  ```bash
  # macOS/Linux
  lsof -ti:3000 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```
- Or change the port in `package.json`:
  ```json
  "dev": "next dev -p 3001"
  ```

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "OpenAI API error"

**Solution:**
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has credits/quota
- Ensure key starts with `sk-`

### Issue: Database connection refused

**Solution:**
- Check PostgreSQL is running
- Verify connection string matches your setup
- For Docker: `docker ps` to see if container is running

## Useful Commands

### Database Management

```bash
# View database in Prisma Studio (GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# View migrations
npx prisma migrate status
```

### Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment

```bash
# Check if .env file exists
ls -la .env

# View environment variables (be careful with secrets!)
cat .env
```

## Project Structure

```
AI_Website_Development/
├── app/                    # Next.js pages and API routes
│   ├── api/               # Backend API endpoints
│   ├── dashboard/         # Dashboard page
│   ├── editor/            # Visual editor
│   ├── login/             # Authentication pages
│   └── p/                 # Published pages
├── components/            # React components
│   ├── editor/            # Editor components
│   ├── renderer/          # Component renderers
│   └── ui/                # UI components (shadcn)
├── lib/                   # Utilities
├── prisma/                # Database schema
├── store/                 # State management (Zustand)
├── types/                 # TypeScript types
├── .env                   # Environment variables (create this)
└── package.json           # Dependencies
```

## Next Steps

Once running locally:

1. **Explore the editor**: Create a project and try different sections
2. **Test AI generation**: Generate sections with different tones
3. **Customize themes**: Edit theme tokens in `types/component-tree.ts`
4. **Add features**: Extend the component system
5. **Deploy**: Follow `RAILWAY_DEPLOYMENT.md` when ready

## Getting Help

If you encounter issues:

1. Check the error message in terminal
2. Review browser console (F12 → Console)
3. Check Prisma Studio: `npx prisma studio`
4. Verify all environment variables are set
5. Ensure PostgreSQL is running

## Quick Reference

```bash
# Full setup from scratch
npm install
cp .env.example .env
# Edit .env with your values
npx prisma generate
npx prisma db push
npm run dev
```

That's it! Your app should now be running at http://localhost:3000 🚀
