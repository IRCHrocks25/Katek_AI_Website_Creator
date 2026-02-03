# Railway Deployment Guide for Next.js Projects

This guide documents the steps needed to successfully deploy this Next.js + Prisma project to Railway.

---

## Quick Start

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo" (connect your GitHub account if needed)
4. Select this repository

### 2. Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically provision a PostgreSQL instance
4. Note the `DATABASE_URL` from the PostgreSQL service variables

### 3. Configure Environment Variables

In your Railway project settings → Variables, add:

```env
DATABASE_URL=<from-postgres-service>
AUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://katekaiwebsitecreator-production.up.railway.app
OPENAI_API_KEY=<your-openai-api-key>
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Deploy

Railway will automatically:
- Detect this is a Next.js project
- Run `npm install`
- Run `npm run build`
- Start the application

---

## Deployment Methods

### Option A: Auto-Detect (Recommended)

Railway automatically detects Next.js projects. Just connect your repo and deploy!

**Requirements:**
- `package.json` with Next.js in dependencies
- `next.config.js` present
- Build script: `"build": "next build"`

### Option B: Dockerfile

If you prefer Docker (already included), Railway will use the `Dockerfile`:

```dockerfile
# Already configured in Dockerfile
# Uses standalone output for optimal production builds
```

---

## Common Issues & Fixes

### 1. Database Connection Errors

**Issue:** `Can't reach database server`

**Solutions:**
- Ensure `DATABASE_URL` is set correctly
- Verify PostgreSQL service is running
- Check that the database URL format is: `postgresql://user:password@host:port/dbname`

### 2. Prisma Client Not Generated

**Issue:** `@prisma/client did not initialize yet`

**Solution:** Railway should run `prisma generate` during build, but you can add a build script:

```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### 3. Database Migrations Not Run

**Issue:** Tables don't exist in production

**Solution:** Run migrations after first deployment:

1. Connect to Railway CLI:
   ```bash
   npm i -g @railway/cli
   railway login
   railway link
   ```

2. Run migrations:
   ```bash
   railway run npx prisma migrate deploy
   ```

   Or push schema directly:
   ```bash
   railway run npx prisma db push
   ```

### 4. NextAuth URL Mismatch

**Issue:** Authentication redirects fail

**Solution:** 
- Set `NEXTAUTH_URL` to your exact Railway domain
- Format: `https://your-app.up.railway.app` (no trailing slash)
- Must match exactly what Railway assigns

### 5. Build Timeout

**Issue:** Build takes too long and times out

**Solutions:**
- Optimize dependencies (remove unused packages)
- Use `.dockerignore` to exclude unnecessary files
- Consider using Railway's build cache

### 6. Environment Variables Not Loading

**Issue:** `process.env.OPENAI_API_KEY` is undefined

**Solution:**
- Ensure all env vars are set in Railway dashboard
- Restart the service after adding new variables
- Check variable names match exactly (case-sensitive)

---

## Build Configuration

### Next.js Config

The project uses `output: 'standalone'` for optimal Docker builds:

```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  // ... other config
}
```

This creates a minimal production build that Railway can deploy efficiently.

### Package.json Scripts

Ensure these scripts are present:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:generate": "prisma generate",
    "db:push": "prisma db push"
  }
}
```

---

## Post-Deployment Checklist

After deployment:

- [ ] Database migrations run (`prisma migrate deploy` or `prisma db push`)
- [ ] Environment variables set correctly
- [ ] `NEXTAUTH_URL` matches Railway domain exactly
- [ ] Test authentication (signup/login)
- [ ] Test AI generation (verify OpenAI API key)
- [ ] Test project creation
- [ ] Test publishing pages

---

## Railway-Specific Configuration

### Custom Domain

1. Go to your service → Settings → Networking
2. Click "Generate Domain" or add custom domain
3. Update `NEXTAUTH_URL` to match new domain

### Health Checks

Railway automatically health checks on port 3000. The app should respond to:
```
GET /
```

### Logs

View logs in Railway dashboard:
- Service → Deployments → View Logs
- Or use Railway CLI: `railway logs`

---

## Troubleshooting Commands

### Check Database Connection

```bash
railway run npx prisma db pull
```

### View Environment Variables

```bash
railway variables
```

### Run Prisma Studio (for debugging)

```bash
railway run npx prisma studio
```

### Restart Service

In Railway dashboard: Service → Settings → Restart

---

## Example Railway Environment Variables

```env
# Database (from PostgreSQL service)
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway

# Auth
AUTH_SECRET=your-generated-secret-here-min-32-chars
NEXTAUTH_URL=https://katekaiwebsitecreator-production.up.railway.app

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Optional: Node environment
NODE_ENV=production
```

---

## Performance Optimization

### Enable Build Cache

Railway automatically caches `node_modules` between builds for faster deploys.

### Database Connection Pooling

Consider using Railway's connection pooling or Prisma's built-in pooling for better performance.

### Image Optimization

Next.js Image component is configured to accept external images. For production, consider:
- Using a CDN for images
- Optimizing image sizes
- Using Next.js Image Optimization API

---

## Monitoring

### Railway Metrics

Railway provides:
- CPU/Memory usage
- Request logs
- Error tracking

Access via: Service → Metrics

### Application Logs

```bash
# Via CLI
railway logs --tail

# Or view in dashboard
Service → Deployments → Latest → View Logs
```

---

## Rollback

If deployment fails:

1. Go to Service → Deployments
2. Find last successful deployment
3. Click "Redeploy"

Or via CLI:
```bash
railway rollback
```

---

## Next Steps After Deployment

1. **Set up custom domain** (optional)
2. **Configure monitoring** (Railway provides basic metrics)
3. **Set up backups** for PostgreSQL (Railway Pro feature)
4. **Configure rate limiting** for AI endpoints
5. **Set up error tracking** (e.g., Sentry)

---

## Support

If you encounter issues:

1. Check Railway logs: `railway logs`
2. Verify environment variables
3. Test database connection: `railway run npx prisma db pull`
4. Check Next.js build locally: `npm run build`
5. Review Railway status: [status.railway.app](https://status.railway.app)

---

## Notes

- Railway automatically handles HTTPS/SSL certificates
- Port 3000 is automatically exposed
- Railway assigns a random port internally, but Next.js uses PORT env var
- Database backups available on Railway Pro plan
