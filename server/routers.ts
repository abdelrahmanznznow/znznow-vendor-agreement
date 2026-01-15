import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createAgreement, getAgreementById, updateAgreement, getAllAgreements, getAgreementsByStatus, getAgreementsByType } from "./db";
import { generateAgreementHTML, generatePrintableAgreement } from "./pdfService";
import { storagePut } from "./storage";
import { TOURS_PARTNERSHIP_LEVELS, RESTAURANT_PARTNERSHIP_LEVELS, TOURS_AGREEMENT_TEXT, RESTAURANT_AGREEMENT_TEXT } from "../shared/agreementTemplates";
import { notifyOwner } from "./_core/notification";
import { sendEmailViaSendGrid, generateAgreementEmailHTML, generateWhatsAppLink } from "./emailServiceSendGrid";

// Cookie name constant
const COOKIE_NAME = "session";

// Input validation schemas
const agreementTypeSchema = z.enum(["tours", "restaurant"]);

const submitAgreementSchema = z.object({
  agreementType: agreementTypeSchema,
  vendorName: z.string().min(1, "Vendor name is required"),
  vendorAddress: z.string().min(1, "Address is required"),
  vendorRegistrationNo: z.string().optional(),
  vendorEmail: z.string().email("Valid email is required"),
  vendorPhone: z.string().min(1, "Phone number is required"),
  vendorWhatsapp: z.string().optional(),
  contactPersonName: z.string().min(1, "Contact person name is required"),
  contactPersonTitle: z.string().optional(),
  partnershipLevel: z.string().min(1, "Partnership level is required"),
  vendorSignature: z.string().min(1, "Signature is required"),
  effectiveDate: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  agreements: router({
    // Get partnership levels for a specific agreement type
    getPartnershipLevels: publicProcedure
      .input(z.object({ type: agreementTypeSchema }))
      .query(({ input }) => {
        if (input.type === "tours") {
          return TOURS_PARTNERSHIP_LEVELS;
        }
        return RESTAURANT_PARTNERSHIP_LEVELS;
      }),

    // Get full agreement text for preview
    getAgreementText: publicProcedure
      .input(z.object({ 
        type: agreementTypeSchema,
        partnershipLevel: z.string()
      }))
      .query(({ input }) => {
        return generatePrintableAgreement(input.type, input.partnershipLevel);
      }),

    // Submit a new agreement
    submit: publicProcedure
      .input(submitAgreementSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          // Get IP address and user agent for audit trail
          const ipAddress = ctx.req.headers['x-forwarded-for'] as string || ctx.req.socket?.remoteAddress || 'unknown';
          const userAgent = ctx.req.headers['user-agent'] || 'unknown';

          // Create agreement record
          const agreementId = await createAgreement({
            agreementType: input.agreementType,
            vendorName: input.vendorName,
            vendorAddress: input.vendorAddress,
            vendorRegistrationNo: input.vendorRegistrationNo || null,
            vendorEmail: input.vendorEmail,
            vendorPhone: input.vendorPhone,
            vendorWhatsapp: input.vendorWhatsapp || null,
            contactPersonName: input.contactPersonName,
            contactPersonTitle: input.contactPersonTitle || null,
            partnershipLevel: input.partnershipLevel,
            vendorSignature: input.vendorSignature,
            signedAt: new Date(),
            status: "signed",
            effectiveDate: input.effectiveDate ? new Date(input.effectiveDate) : new Date(),
            ipAddress: typeof ipAddress === 'string' ? ipAddress.split(',')[0].trim() : 'unknown',
            userAgent: typeof userAgent === 'string' ? userAgent : 'unknown',
          });

          // Get the created agreement
          const agreement = await getAgreementById(agreementId);
          if (!agreement) {
            throw new Error("Failed to retrieve created agreement");
          }

          // Generate HTML for PDF
          const html = generateAgreementHTML(agreement);

          // Store HTML as a file (can be converted to PDF client-side or via service)
          const timestamp = Date.now();
          const fileKey = `agreements/${agreementId}-${input.vendorName.replace(/[^a-zA-Z0-9]/g, '_')}-${timestamp}.html`;
          
          const { url } = await storagePut(fileKey, html, "text/html");

          // Update agreement with PDF URL
          await updateAgreement(agreementId, {
            pdfUrl: url,
            pdfKey: fileKey,
          });

          // Notify owner about new agreement
          await notifyOwner({
            title: `New Vendor Agreement Signed: ${input.vendorName}`,
            content: `A new ${input.agreementType} vendor agreement has been signed.\n\nVendor: ${input.vendorName}\nPartnership Level: ${input.partnershipLevel}\nEmail: ${input.vendorEmail}\nPhone: ${input.vendorPhone}`,
          });

          return {
            success: true,
            agreementId,
            pdfUrl: url,
            message: "Agreement submitted successfully",
          };
        } catch (error) {
          console.error("Error submitting agreement:", error);
          throw new Error("Failed to submit agreement. Please try again.");
        }
      }),

    // Get agreement by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const agreement = await getAgreementById(input.id);
        if (!agreement) {
          throw new Error("Agreement not found");
        }
        return agreement;
      }),

    // Get all agreements (admin only)
    getAll: protectedProcedure.query(async () => {
      return await getAllAgreements();
    }),

    // Get agreements by status
    getByStatus: protectedProcedure
      .input(z.object({ status: z.enum(["draft", "pending", "signed", "delivered"]) }))
      .query(async ({ input }) => {
        return await getAgreementsByStatus(input.status);
      }),

    // Get agreements by type
    getByType: protectedProcedure
      .input(z.object({ type: agreementTypeSchema }))
      .query(async ({ input }) => {
        return await getAgreementsByType(input.type);
      }),

    // Mark agreement as delivered (email/whatsapp sent)
    markDelivered: protectedProcedure
      .input(z.object({
        id: z.number(),
        method: z.enum(["email", "whatsapp"]),
      }))
      .mutation(async ({ input }) => {
        const updateData: Record<string, unknown> = {
          status: "delivered",
        };

        if (input.method === "email") {
          updateData.emailSent = true;
          updateData.emailSentAt = new Date();
        } else {
          updateData.whatsappSent = true;
          updateData.whatsappSentAt = new Date();
        }

        await updateAgreement(input.id, updateData);
        return { success: true };
      }),

    // Send agreement via email
    sendEmail: publicProcedure
      .input(z.object({
        agreementId: z.number(),
      }))
      .mutation(async ({ input }) => {
        console.log("[sendEmail] Called with agreementId:", input.agreementId);
        
        const agreement = await getAgreementById(input.agreementId);
        if (!agreement) {
          console.error("[sendEmail] Agreement not found:", input.agreementId);
          throw new Error("Agreement not found");
        }

        console.log("[sendEmail] Agreement found:", { id: agreement.id, vendorEmail: agreement.vendorEmail, pdfUrl: agreement.pdfUrl });

        if (!agreement.pdfUrl) {
          console.error("[sendEmail] PDF URL missing for agreement:", input.agreementId);
          throw new Error("Agreement PDF not generated yet");
        }

        const emailHtml = generateAgreementEmailHTML(
          agreement.vendorName,
          agreement.agreementType,
          agreement.id,
          agreement.pdfUrl
        );

        console.log("[sendEmail] Attempting to send email to:", agreement.vendorEmail);
        
        const success = await sendEmailViaSendGrid({
          to: agreement.vendorEmail,
          subject: `Your ZNZNOW ${agreement.agreementType === "tours" ? "Tours & Activities" : "Restaurant"} Vendor Agreement`,
          html: emailHtml,
        });

        console.log("[sendEmail] Email send result:", success);

        if (success) {
          await updateAgreement(input.agreementId, {
            emailSent: true,
            emailSentAt: new Date(),
            status: "delivered",
          });
          console.log("[sendEmail] Agreement marked as delivered");
        }

        return { success, message: success ? "Email sent successfully" : "Failed to send email" };
      }),

    // Get WhatsApp share link
    getWhatsAppLink: publicProcedure
      .input(z.object({
        agreementId: z.number(),
      }))
      .query(async ({ input }) => {
        const agreement = await getAgreementById(input.agreementId);
        if (!agreement) {
          throw new Error("Agreement not found");
        }

        if (!agreement.pdfUrl) {
          throw new Error("Agreement PDF not generated yet");
        }

        const phone = agreement.vendorWhatsapp || agreement.vendorPhone;
        const link = generateWhatsAppLink(
          phone,
          agreement.vendorName,
          agreement.agreementType,
          agreement.pdfUrl
        );

        return { link };
      }),
  }),
});

export type AppRouter = typeof appRouter;
