import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createAgreement: vi.fn().mockResolvedValue(1),
  getAgreementById: vi.fn().mockResolvedValue({
    id: 1,
    agreementType: "tours",
    vendorName: "Test Vendor",
    vendorEmail: "test@example.com",
    vendorPhone: "+255123456789",
    vendorWhatsapp: "+255123456789",
    vendorAddress: "123 Test Street",
    partnershipLevel: "growth",
    status: "signed",
    pdfUrl: "https://example.com/test.html",
  }),
  updateAgreement: vi.fn().mockResolvedValue(undefined),
  getAllAgreements: vi.fn().mockResolvedValue([]),
  getAgreementsByStatus: vi.fn().mockResolvedValue([]),
  getAgreementsByType: vi.fn().mockResolvedValue([]),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://example.com/test.html" }),
}));

// Mock email service
vi.mock("./emailService", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
  generateAgreementEmailHTML: vi.fn().mockReturnValue("<html>Test</html>"),
  generateWhatsAppLink: vi.fn().mockReturnValue("https://wa.me/255123456789?text=test"),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("agreements router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPartnershipLevels", () => {
    it("returns tours partnership levels", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agreements.getPartnershipLevels({ type: "tours" });

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("commission");
    });

    it("returns restaurant partnership levels", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agreements.getPartnershipLevels({ type: "restaurant" });

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("getAgreementText", () => {
    it("returns tours agreement text as string", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agreements.getAgreementText({ 
        type: "tours", 
        partnershipLevel: "growth" 
      });

      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain("COMMISSION AGREEMENT");
    });

    it("returns restaurant agreement text as string", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agreements.getAgreementText({ 
        type: "restaurant", 
        partnershipLevel: "standard" 
      });

      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain("RESTAURANT VENDOR AGREEMENT");
    });
  });

  describe("submit", () => {
    it("creates a new agreement and returns PDF URL", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agreements.submit({
        agreementType: "tours",
        vendorName: "Test Tours Company",
        vendorAddress: "123 Beach Road, Zanzibar",
        vendorEmail: "test@tours.com",
        vendorPhone: "+255123456789",
        contactPersonName: "John Doe",
        partnershipLevel: "growth",
        vendorSignature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      });

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("agreementId");
      expect(result).toHaveProperty("pdfUrl");
    });
  });

  describe("getById", () => {
    it("returns agreement by ID", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agreements.getById({ id: 1 });

      expect(result).toHaveProperty("id", 1);
      expect(result).toHaveProperty("vendorName", "Test Vendor");
      expect(result).toHaveProperty("agreementType", "tours");
    });
  });

  describe("getWhatsAppLink", () => {
    it("returns WhatsApp share link", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agreements.getWhatsAppLink({ agreementId: 1 });

      expect(result).toHaveProperty("whatsappLink");
      expect(result.whatsappLink).toContain("wa.me");
    });
  });

  describe("sendEmail", () => {
    it("sends email and updates agreement status", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agreements.sendEmail({ agreementId: 1 });

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("message", "Email sent successfully");
    });
  });
});
