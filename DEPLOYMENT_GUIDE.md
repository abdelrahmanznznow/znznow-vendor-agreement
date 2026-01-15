# ZNZNOW Vendor Agreement System - Deployment Guide

This guide explains how to deploy the ZNZNOW Vendor Agreement Management System to Vercel.

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (free tier available)
- Database URL (MySQL/TiDB)
- Environment variables from Manus platform

## Deployment Steps

### Step 1: Push to GitHub

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New" → "Project"
4. Select your `znznow-vendor-agreement` repository
5. Click "Import"

### Step 3: Configure Environment Variables

In the Vercel dashboard, add the following environment variables:

**Required Variables:**
- `DATABASE_URL` - Your MySQL/TiDB connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - From Manus platform
- `OAUTH_SERVER_URL` - https://api.manus.im
- `VITE_OAUTH_PORTAL_URL` - From Manus platform
- `OWNER_OPEN_ID` - Your Manus owner ID
- `OWNER_NAME` - Your name
- `BUILT_IN_FORGE_API_URL` - From Manus platform
- `BUILT_IN_FORGE_API_KEY` - From Manus platform
- `VITE_FRONTEND_FORGE_API_KEY` - From Manus platform
- `VITE_FRONTEND_FORGE_API_URL` - From Manus platform

**Optional Variables:**
- `RESEND_API_KEY` - For email delivery via Resend (get from [https://resend.com](https://resend.com))
  - If not set, emails will be logged to console during development
  - For production, we recommend setting this up for reliable email delivery

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Once complete, you'll get a deployment URL

### Step 5: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Follow the DNS configuration instructions

## Email Service Setup (Recommended)

For production email delivery, set up Resend:

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Create an API key
4. Add `RESEND_API_KEY` to your Vercel environment variables
5. Verify your domain for sending emails

Without Resend API key, the system will:
- Log emails to console (development)
- Still mark agreements as delivered
- Allow vendors to download PDFs

## Database Setup

The system uses Drizzle ORM with MySQL/TiDB. To set up the database:

1. Create a new database in your MySQL/TiDB provider
2. Get the connection string
3. Add it as `DATABASE_URL` in Vercel
4. On first deployment, tables will be created automatically

## Monitoring and Logs

View deployment logs in Vercel:

1. Go to your project in Vercel dashboard
2. Click "Deployments"
3. Select the latest deployment
4. Click "Logs" to see build and runtime logs

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Ensure database connection string is correct
- Check the build logs for specific errors

### Email Not Sending
- Verify `RESEND_API_KEY` is set (if using Resend)
- Check Vercel logs for email service errors
- Without Resend, emails are logged to console

### Database Connection Issues
- Verify `DATABASE_URL` format is correct
- Ensure database server is accessible from Vercel
- Check firewall/security group settings

## Updating After Deployment

To update the application:

1. Make changes locally
2. Push to GitHub
3. Vercel will automatically redeploy
4. Or manually trigger a redeployment in Vercel dashboard

## Alternative: Deploy on Manus Platform

The system is also configured to run on Manus platform:

1. The project is already set up in Manus webdev
2. Access at: https://3000-ipiip547xtdv8bng4qajj-e4bab859.us2.manus.computer
3. All environment variables are pre-configured
4. Click "Publish" button to deploy

## Support

For issues or questions:
- Check the logs in Vercel dashboard
- Review error messages in browser console
- Contact Vercel support or Manus support as needed
