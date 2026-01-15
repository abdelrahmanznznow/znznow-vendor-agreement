/**
 * PDF Generation Service using Puppeteer
 * Converts HTML agreements to professional PDF files
 */

import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";
import { storagePut } from "./storage";

let browser: Browser | null = null;

/**
 * Initialize browser instance (lazy loaded)
 */
async function getBrowser(): Promise<Browser> {
  if (!browser) {
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      });
    } catch (error) {
      console.error("Failed to launch browser:", error);
      throw new Error("PDF generation service unavailable");
    }
  }
  return browser;
}

/**
 * Generate PDF from HTML content
 */
export async function generatePDFFromHTML(
  htmlContent: string,
  filename: string
): Promise<{ url: string; key: string }> {
  let page: Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 1600 });

    // Set content and wait for fonts to load
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF with professional settings
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
      printBackground: true,
      preferCSSPageSize: true,
    });

    // Upload to S3
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9-_]/g, "_");
    const fileKey = `agreements/pdf/${sanitizedFilename}-${timestamp}.pdf`;

    const { url } = await storagePut(fileKey, pdfBuffer, "application/pdf");

    console.log(`[PDF] Generated and stored: ${fileKey}`);

    return { url, key: fileKey };
  } catch (error) {
    console.error("[PDF] Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  } finally {
    if (page) {
      await page.close();
    }
  }
}

/**
 * Generate agreement PDF with specific formatting
 */
export async function generateAgreementPDF(
  vendorName: string,
  agreementType: "tours" | "restaurant",
  agreementHTML: string
): Promise<{ url: string; key: string }> {
  const filename = `${agreementType}-agreement-${vendorName}`;
  return generatePDFFromHTML(agreementHTML, filename);
}

/**
 * Close browser connection (cleanup)
 */
export async function closePDFBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
    console.log("[PDF] Browser closed");
  }
}

/**
 * Health check for PDF service
 */
export async function checkPDFServiceHealth(): Promise<boolean> {
  try {
    const browser = await getBrowser();
    return browser !== null;
  } catch (error) {
    console.error("[PDF] Health check failed:", error);
    return false;
  }
}
