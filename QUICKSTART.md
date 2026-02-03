# Quick Start Guide

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ai_website_builder"
   AUTH_SECRET="your-random-secret-here-use-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   OPENAI_API_KEY="sk-your-openai-api-key"
   ```

3. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## First Steps

1. **Sign up** for an account at `/signup`
2. **Create a project** from the dashboard
3. **Add sections** using the left panel
4. **Generate with AI** by clicking the sparkle icon next to any section type
5. **Edit components** by clicking them in the preview and using the inspector panel
6. **Publish** your page when ready!

## Railway Deployment

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up/login

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo" (or use Railway CLI)

### Step 3: Add PostgreSQL
1. Click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will provision a PostgreSQL instance
4. Copy the `DATABASE_URL` from the PostgreSQL service variables

### Step 4: Configure Environment Variables
In your Railway project settings, add these environment variables:

- `DATABASE_URL` - From your PostgreSQL service
- `AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your Railway domain (e.g., `https://your-app.railway.app`)
- `OPENAI_API_KEY` - Your OpenAI API key

### Step 5: Deploy
Railway will automatically:
- Detect the Dockerfile
- Build your Next.js app
- Run database migrations
- Deploy your app

### Step 6: Run Migrations
After first deployment, you may need to run:
```bash
railway run npx prisma migrate deploy
```

Or connect to your Railway service and run migrations manually.

## Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` is correctly formatted
- Check that PostgreSQL service is running in Railway
- Verify network access in Railway settings

### Auth Issues
- Make sure `AUTH_SECRET` is set and is a random string
- Verify `NEXTAUTH_URL` matches your Railway domain exactly

### AI Generation Not Working
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI API usage/quota
- Review server logs for error messages

### Build Failures
- Ensure all environment variables are set
- Check that Prisma can generate the client
- Verify Node.js version (20+) in Dockerfile

## Next Steps

- Customize the theme tokens in `types/component-tree.ts`
- Add more section variants
- Implement image uploads
- Add more AI prompts for different section types
- Set up analytics
- Add custom domains
