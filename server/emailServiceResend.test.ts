import { describe, it, expect, beforeEach, vi } from "vitest";
import { sendEmail, generateAgreementEmailHTML, generateWhatsAppLink } from "./emailServiceResend";

describe("emailServiceResend", () => {
  describe("generateAgreementEmailHTML", () => {
    it("generates valid HTML email for tours agreement", () => {
      const html = generateAgreementEmailHTML(
        "Test Tours Company",
        "tours",
        "https://example.com/agreement.pdf"
      );

      expect(html).toContain("Test Tours Company");
      expect(html).toContain("Tours & Activities");
      expect(html).toContain("https://example.com/agreement.pdf");
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("ZNZNOW");
    });

    it("generates valid HTML email for restaurant agreement", () => {
      const html = generateAgreementEmailHTML(
        "Test Restaurant",
        "restaurant",
        "https://example.com/agreement.pdf"
      );

      expect(html).toContain("Test Restaurant");
      expect(html).toContain("Restaurant");
      expect(html).toContain("https://example.com/agreement.pdf");
    });

    it("includes download button in email", () => {
      const html = generateAgreementEmailHTML(
        "Test Vendor",
        "tours",
        "https://example.com/agreement.pdf"
      );

      expect(html).toContain("Download Your Agreement");
    });

    it("includes company footer information", () => {
      const html = generateAgreementEmailHTML(
        "Test Vendor",
        "tours",
        "https://example.com/agreement.pdf"
      );

      expect(html).toContain("Zanzisouk LTD");
      expect(html).toContain("Migoz Plaza, Nyerere Road");
      expect(html).toContain("contact@znznow.com");
    });
  });

  describe("generateWhatsAppLink", () => {
    it("generates valid WhatsApp link with phone number", () => {
      const link = generateWhatsAppLink(
        "+255123456789",
        "Test Vendor",
        "https://example.com/agreement.pdf"
      );

      expect(link).toContain("https://wa.me/");
      expect(link).toContain("255123456789");
      expect(link).toContain("Test%20Vendor");
      expect(link).toContain("agreement.pdf");
    });

    it("handles phone numbers without country code", () => {
      const link = generateWhatsAppLink(
        "123456789",
        "Test Vendor",
        "https://example.com/agreement.pdf"
      );

      expect(link).toContain("https://wa.me/123456789");
    });

    it("handles phone numbers with spaces and dashes", () => {
      const link = generateWhatsAppLink(
        "+255 123-456-789",
        "Test Vendor",
        "https://example.com/agreement.pdf"
      );

      expect(link).toContain("https://wa.me/255123456789");
    });

    it("includes agreement download message", () => {
      const link = generateWhatsAppLink(
        "+255123456789",
        "Test Vendor",
        "https://example.com/agreement.pdf"
      );

      expect(link).toContain("Your%20ZNZNOW%20Vendor%20Partnership%20Agreement");
      expect(link).toContain("Download%20your%20signed%20agreement");
    });
  });

  describe("sendEmail", () => {
    beforeEach(() => {
      // Clear environment variables
      delete process.env.RESEND_API_KEY;
    });

    it("returns true when no API keys are configured (development mode)", async () => {
      const result = await sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        html: "<p>Test</p>",
      });

      expect(result).toBe(true);
    });

    it("logs email details to console when no API keys configured", async () => {
      const consoleSpy = vi.spyOn(console, "log");

      await sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        html: "<p>Test</p>",
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[sendEmail]")
      );
      
      consoleSpy.mockRestore();
    });

    it("handles email with custom from address", async () => {
      const result = await sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        html: "<p>Test</p>",
        from: "custom@example.com",
      });

      expect(result).toBe(true);
    });
  });
});
