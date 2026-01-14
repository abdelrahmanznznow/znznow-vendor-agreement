import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignatureCanvas } from "@/components/SignatureCanvas";
import { AgreementViewer } from "@/components/AgreementViewer";
import { toast } from "sonner";
import { 
  FileText, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Download,
  Send,
  Eye,
  Loader2,
  UtensilsCrossed,
  Compass,
  MessageCircle
} from "lucide-react";

type AgreementType = "tours" | "restaurant";

interface FormData {
  vendorName: string;
  vendorAddress: string;
  vendorRegistrationNo: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorWhatsapp: string;
  contactPersonName: string;
  contactPersonTitle: string;
  partnershipLevel: string;
  effectiveDate: string;
  signature: string | null;
  agreedToTerms: boolean;
}

const initialFormData: FormData = {
  vendorName: "",
  vendorAddress: "",
  vendorRegistrationNo: "",
  vendorEmail: "",
  vendorPhone: "",
  vendorWhatsapp: "",
  contactPersonName: "",
  contactPersonTitle: "",
  partnershipLevel: "",
  effectiveDate: new Date().toISOString().split("T")[0],
  signature: null,
  agreedToTerms: false,
};

export default function VendorAgreementForm() {
  const [agreementType, setAgreementType] = useState<AgreementType>("tours");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showAgreementViewer, setShowAgreementViewer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    agreementId: number;
    pdfUrl: string;
  } | null>(null);

  // Fetch partnership levels
  const { data: partnershipLevels } = trpc.agreements.getPartnershipLevels.useQuery(
    { type: agreementType },
    { staleTime: Infinity }
  );

  // Fetch agreement text for preview
  const { data: agreementText } = trpc.agreements.getAgreementText.useQuery(
    { type: agreementType, partnershipLevel: formData.partnershipLevel || "growth" },
    { enabled: !!formData.partnershipLevel, staleTime: Infinity }
  );

  // Submit mutation
  const submitMutation = trpc.agreements.submit.useMutation({
    onSuccess: (data) => {
      setSubmissionSuccess({
        agreementId: data.agreementId,
        pdfUrl: data.pdfUrl,
      });
      toast.success("Agreement submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit agreement");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Reset partnership level when agreement type changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, partnershipLevel: "" }));
  }, [agreementType]);

  // Set default partnership level when levels are loaded
  useEffect(() => {
    if (partnershipLevels && partnershipLevels.length > 0 && !formData.partnershipLevel) {
      setFormData((prev) => ({ ...prev, partnershipLevel: partnershipLevels[0].id }));
    }
  }, [partnershipLevels, formData.partnershipLevel]);

  const handleInputChange = (field: keyof FormData, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!formData.vendorName) errors.push("Vendor name is required");
    if (!formData.vendorAddress) errors.push("Address is required");
    if (!formData.vendorEmail) errors.push("Email is required");
    if (!formData.vendorPhone) errors.push("Phone number is required");
    if (!formData.contactPersonName) errors.push("Contact person name is required");
    if (!formData.partnershipLevel) errors.push("Partnership level is required");
    if (!formData.signature) errors.push("Signature is required");
    if (!formData.agreedToTerms) errors.push("You must agree to the terms and conditions");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    setIsSubmitting(true);
    
    submitMutation.mutate({
      agreementType,
      vendorName: formData.vendorName,
      vendorAddress: formData.vendorAddress,
      vendorRegistrationNo: formData.vendorRegistrationNo || undefined,
      vendorEmail: formData.vendorEmail,
      vendorPhone: formData.vendorPhone,
      vendorWhatsapp: formData.vendorWhatsapp || undefined,
      contactPersonName: formData.contactPersonName,
      contactPersonTitle: formData.contactPersonTitle || undefined,
      partnershipLevel: formData.partnershipLevel,
      vendorSignature: formData.signature!,
      effectiveDate: formData.effectiveDate || undefined,
    });
  };

  const handleDownloadPDF = () => {
    if (submissionSuccess?.pdfUrl) {
      window.open(submissionSuccess.pdfUrl, "_blank");
    }
  };

  // Email mutation
  const sendEmailMutation = trpc.agreements.sendEmail.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Agreement sent to your email!");
      } else {
        toast.error("Failed to send email. Please try again.");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send email");
    },
  });

  // WhatsApp link query
  const { data: whatsappData, refetch: fetchWhatsAppLink } = trpc.agreements.getWhatsAppLink.useQuery(
    { agreementId: submissionSuccess?.agreementId ?? 0 },
    { enabled: false }
  );

  const handleSendEmail = () => {
    if (submissionSuccess?.agreementId) {
      sendEmailMutation.mutate({ agreementId: submissionSuccess.agreementId });
    }
  };

  const handleShareWhatsApp = async () => {
    if (submissionSuccess?.agreementId) {
      const result = await fetchWhatsAppLink();
      if (result.data?.whatsappLink) {
        window.open(result.data.whatsappLink, "_blank");
      }
    }
  };

  // Success screen
  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Agreement Submitted Successfully!</CardTitle>
            <CardDescription>
              Your vendor partnership agreement has been signed and recorded.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Agreement Details:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>Agreement ID: #{submissionSuccess.agreementId}</li>
                <li>Vendor: {formData.vendorName}</li>
                <li>Type: {agreementType === "tours" ? "Tours & Activities" : "Restaurant"}</li>
                <li>Partnership Level: {formData.partnershipLevel}</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleDownloadPDF} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Signed Agreement
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleSendEmail}
                  disabled={sendEmailMutation.isPending}
                  className="w-full"
                >
                  {sendEmailMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Send to Email
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleShareWhatsApp}
                  className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Share via WhatsApp
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSubmissionSuccess(null);
                  setFormData(initialFormData);
                }}
                className="w-full"
              >
                Submit Another Agreement
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Click "Send to Email" to receive a copy at {formData.vendorEmail}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">Z</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-primary">ZNZNOW</h1>
                <p className="text-xs text-muted-foreground">Vendor Partnership Agreement</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAgreementViewer(true)}
              disabled={!formData.partnershipLevel}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Full Agreement
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-4xl">
        <form onSubmit={handleSubmit}>
          {/* Agreement Type Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Select Agreement Type
              </CardTitle>
              <CardDescription>
                Choose the type of partnership agreement that applies to your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={agreementType} onValueChange={(v) => setAgreementType(v as AgreementType)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tours" className="flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    Tours & Activities
                  </TabsTrigger>
                  <TabsTrigger value="restaurant" className="flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4" />
                    Restaurant
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="tours" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    For tour operators, activity providers, excursion companies, and experience hosts in Zanzibar.
                  </p>
                </TabsContent>
                <TabsContent value="restaurant" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    For restaurants, cafes, food vendors, and dining establishments in Zanzibar.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Partnership Level */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Partnership Level</CardTitle>
              <CardDescription>
                Select your preferred partnership package
              </CardDescription>
            </CardHeader>
            <CardContent>
              {partnershipLevels && (
                <RadioGroup
                  value={formData.partnershipLevel}
                  onValueChange={(v) => handleInputChange("partnershipLevel", v)}
                  className="grid gap-4"
                >
                  {partnershipLevels.map((level) => (
                    <div key={level.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
                      <Label htmlFor={level.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{level.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Commission: {level.commission}
                          {"userFee" in level && ` | User Fee: ${level.userFee}`}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {level.description}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Business Information
              </CardTitle>
              <CardDescription>
                Enter your business details as they should appear on the agreement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vendorName">Business Name *</Label>
                  <Input
                    id="vendorName"
                    value={formData.vendorName}
                    onChange={(e) => handleInputChange("vendorName", e.target.value)}
                    placeholder="Enter your business name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendorRegistrationNo">Registration Number</Label>
                  <Input
                    id="vendorRegistrationNo"
                    value={formData.vendorRegistrationNo}
                    onChange={(e) => handleInputChange("vendorRegistrationNo", e.target.value)}
                    placeholder="Business registration number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vendorAddress" className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Business Address *
                </Label>
                <Input
                  id="vendorAddress"
                  value={formData.vendorAddress}
                  onChange={(e) => handleInputChange("vendorAddress", e.target.value)}
                  placeholder="Full business address"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vendorEmail" className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="vendorEmail"
                    type="email"
                    value={formData.vendorEmail}
                    onChange={(e) => handleInputChange("vendorEmail", e.target.value)}
                    placeholder="business@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendorPhone" className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="vendorPhone"
                    type="tel"
                    value={formData.vendorPhone}
                    onChange={(e) => handleInputChange("vendorPhone", e.target.value)}
                    placeholder="+255 XXX XXX XXX"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendorWhatsapp">WhatsApp Number (for notifications)</Label>
                <Input
                  id="vendorWhatsapp"
                  type="tel"
                  value={formData.vendorWhatsapp}
                  onChange={(e) => handleInputChange("vendorWhatsapp", e.target.value)}
                  placeholder="+255 XXX XXX XXX"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Person */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Authorized Signatory
              </CardTitle>
              <CardDescription>
                Person authorized to sign on behalf of the business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Full Name *</Label>
                  <Input
                    id="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPersonTitle">Title/Position</Label>
                  <Input
                    id="contactPersonTitle"
                    value={formData.contactPersonTitle}
                    onChange={(e) => handleInputChange("contactPersonTitle", e.target.value)}
                    placeholder="e.g., Owner, Manager, Director"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="effectiveDate" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Effective Date
                </Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => handleInputChange("effectiveDate", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Signature Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Digital Signature</CardTitle>
              <CardDescription>
                Sign below using your mouse or touch screen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ZNZNOW Pre-signed Section */}
              <div className="bg-muted/30 rounded-lg p-4 border">
                <h4 className="font-medium text-sm mb-3">ZNZNOW Representative (Pre-signed)</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm"><strong>Name:</strong> AbdelRahman Ahmed</p>
                    <p className="text-sm"><strong>Title:</strong> Founder & CEO</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="150" height="40" viewBox="0 0 150 40" className="border-b border-primary/30">
                      <text x="5" y="30" fontFamily="Brush Script MT, cursive" fontSize="22" fill="#1a365d">AbdelRahman Ahmed</text>
                    </svg>
                    <svg width="60" height="60" viewBox="0 0 120 120" className="opacity-80">
                      <circle cx="60" cy="60" r="55" fill="none" stroke="#1a365d" strokeWidth="2"/>
                      <circle cx="60" cy="60" r="45" fill="none" stroke="#1a365d" strokeWidth="1"/>
                      <text x="60" y="35" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fill="#1a365d" fontWeight="bold">ZANZISOUK LTD</text>
                      <text x="60" y="55" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fill="#1a365d" fontWeight="bold">ZNZNOW</text>
                      <text x="60" y="72" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" fill="#1a365d">ZANZIBAR</text>
                      <text x="60" y="85" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" fill="#1a365d">OFFICIAL</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Vendor Signature */}
              <div>
                <h4 className="font-medium text-sm mb-3">Your Signature *</h4>
                <SignatureCanvas
                  onSignatureChange={(sig) => handleInputChange("signature", sig)}
                  width={400}
                  height={150}
                />
                {formData.contactPersonName && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Signing as: <strong>{formData.contactPersonName}</strong>
                    {formData.contactPersonTitle && `, ${formData.contactPersonTitle}`}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Terms Agreement */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreedToTerms", !!checked)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  I have read and agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowAgreementViewer(true)}
                    className="text-primary underline hover:no-underline"
                  >
                    full terms and conditions
                  </button>{" "}
                  of this vendor partnership agreement. I confirm that I am authorized to sign on behalf of the business named above.
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAgreementViewer(true)}
              disabled={!formData.partnershipLevel}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Agreement
            </Button>
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit & Sign Agreement
                </>
              )}
            </Button>
          </div>
        </form>
      </main>

      {/* Agreement Viewer Modal */}
      <AgreementViewer
        isOpen={showAgreementViewer}
        onClose={() => setShowAgreementViewer(false)}
        agreementText={agreementText || "Loading agreement text..."}
        agreementType={agreementType}
        partnershipLevel={
          partnershipLevels?.find((l) => l.id === formData.partnershipLevel)?.name || 
          formData.partnershipLevel
        }
      />

      {/* Footer */}
      <footer className="border-t bg-white mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Zanzisouk LTD (ZNZNOW). All rights reserved.</p>
          <p className="mt-1">Migoz Plaza, Nyerere Road, Zanzibar, Tanzania | contact@znznow.com</p>
        </div>
      </footer>
    </div>
  );
}
