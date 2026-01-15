# Vercel Deployment Guide for ZNZNOW Vendor Onboarding

## Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Repository** - Push your code to GitHub
3. **Environment Variables** - Prepare all required secrets

## Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Create Vercel Project

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Import"

## Step 3: Configure Environment Variables

In the Vercel dashboard, go to **Settings** → **Environment Variables** and add:

### Required Variables

```
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@znznow.com
VITE_APP_TITLE=ZNZNOW Vendor Onboarding
VITE_APP_LOGO=/logo.svg
NODE_ENV=production
```

### How to Get SendGrid API Key

1. Sign up at https://sendgrid.com
2. Go to Settings → API Keys
3. Create a new API Key with "Mail Send" permissions
4. Copy and paste it into SENDGRID_API_KEY

## Step 4: Deploy

1. After adding environment variables, click "Deploy"
2. Wait for the build to complete (usually 3-5 minutes)
3. Once deployed, you'll get a URL like `https://your-project.vercel.app`

## Step 5: Verify Deployment

1. Visit your Vercel URL
2. Test the agreement form
3. Try sending an email to verify SendGrid integration
4. Check the deployment logs if there are any issues

## Troubleshooting

### Build Fails

**Check the build logs:**
- In Vercel dashboard, go to Deployments → Select failed deployment → View logs
- Common issues:
  - Missing environment variables
  - TypeScript errors
  - Missing dependencies

**Solution:**
```bash
# Locally verify build works
npm run build
npm run test
```

### Email Not Sending

**Check SendGrid configuration:**
1. Verify `SENDGRID_API_KEY` is set correctly
2. Check SendGrid dashboard for delivery status
3. Look at Vercel function logs for errors

**Test locally:**
```bash
# Set SendGrid key locally
export SENDGRID_API_KEY=your_key
npm run dev
```

### Database Connection Issues

**Verify DATABASE_URL:**
1. Make sure the connection string is correct
2. Check if database accepts connections from Vercel IPs
3. For MySQL/TiDB, ensure SSL is enabled

**Test connection:**
```bash
# Run migrations
npm run db:push
```

## Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain (e.g., `vendor.znznow.com`)
3. Update DNS records as instructed by Vercel
4. Wait for DNS propagation (usually 24-48 hours)

## Monitoring & Logs

### View Deployment Logs

```bash
# Using Vercel CLI
vercel logs --tail
```

### Monitor Function Performance

1. Go to Vercel dashboard → Deployments
2. Click on a deployment → Functions
3. View execution time and memory usage

## Rollback

If deployment has issues:

1. Go to Deployments in Vercel dashboard
2. Find the previous working deployment
3. Click "Promote to Production"

## Continuous Deployment

Your project is now set up for automatic deployments:

- Push to `main` branch → Automatic deployment
- Create pull request → Preview deployment
- Merge PR → Production deployment

## Performance Tips

1. **Enable Caching**
   - Vercel automatically caches static assets
   - Set cache headers in your code

2. **Optimize Images**
   - Use modern formats (WebP, AVIF)
   - Compress before uploading

3. **Monitor Database Queries**
   - Use slow query logs
   - Optimize indexes

## Support

For Vercel-specific issues:
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support

For ZNZNOW-specific issues:
- Contact: contact@znznow.com
