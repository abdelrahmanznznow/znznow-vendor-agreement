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
