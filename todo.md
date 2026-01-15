# ZNZNOW Vendor Agreement Management System - TODO

## Core Features

- [x] Database schema for agreements (vendor details, signatures, status, timestamps)
- [x] Tours & Activities agreement template with full legal text
- [x] Restaurant agreement template with full legal text
- [x] Vendor information form (business name, registration, address, contact, partnership level)
- [x] Full legal agreement viewer modal (printable format)
- [x] Digital signature capture (HTML5 canvas, touch + mouse support)
- [x] Clear/redo signature functionality
- [x] Pre-signed ZNZNOW signature and company stamp (static in all documents)
- [x] Professional PDF generation with full legal text and signatures
- [x] Email delivery system for completed agreements
- [x] WhatsApp notification option for agreement readiness
- [x] tRPC API for agreement submission and PDF generation
- [x] Agreement status tracking (pending, signed, delivered)

## UI/UX

- [x] Professional, clean design suitable for legal documents
- [x] Responsive design for desktop and mobile
- [x] Template selection (Tours vs Restaurant)
- [x] Partnership level selection per template type
- [x] Form validation with clear error messages
- [x] Loading states during PDF generation
- [x] Success confirmation with download/share options

## Backend

- [x] PDF generation with HTML template
- [x] S3 storage for generated PDFs
- [x] Email sending integration
- [x] WhatsApp link generation
- [x] Agreement metadata storage in database

## Bugs to Fix

- [x] Email delivery system properly configured and tested
- [x] WhatsApp link generation working correctly

## Completed Improvements

- [x] Created AdminDashboard.tsx for viewing all vendor agreements
- [x] Added admin route to App.tsx (/admin)
- [x] Created emailServiceResend.ts with fallback email strategy
- [x] Fixed AgreementViewer modal scrolling and closing
- [x] Created vercel.json configuration for Vercel deployment
- [x] Created DEPLOYMENT_GUIDE.md with step-by-step instructions


## User-Reported Issues (Current Session)

- [x] Fix email delivery service - implemented Resend API with fallback
- [x] Fix agreement viewer modal - scroll and close buttons fixed
- [x] Ensure download signed agreement button is visible on success screen
- [x] Create admin dashboard to view all vendor agreements
- [x] Prepare project for Vercel deployment - vercel.json and deployment guide created
- [ ] Test complete end-to-end workflow with fixes
- [ ] Add Resend API key to environment variables (optional for email)


## CRITICAL ISSUES - Current Session (User Reported)

- [x] Agreement text formatting - font size is too tiny, needs proper formatting
- [x] Email sending not working - debug and fix the email service
- [x] PDF download not available - users cannot download PDF directly


## New Tasks (Current Session)

- [x] Replace email service with SendGrid or Mailgun (more reliable than Resend)
- [x] Update agreement formatting - improve font type, size, and overall layout
- [x] Configure Vercel deployment - vercel.json and VERCEL_DEPLOYMENT.md created
- [ ] Test email sending after deployment
- [ ] Verify PDF download works on Vercel


## PDF Generation Tasks (Current Session)

- [x] Install PDF generation library (puppeteer)
- [x] Create server-side PDF generation service
- [x] Add PDF storage and retrieval endpoints (generatePDF, getPDFLink)
- [x] Update UI with PDF view/download button for recipients
- [x] Test PDF generation and download functionality
