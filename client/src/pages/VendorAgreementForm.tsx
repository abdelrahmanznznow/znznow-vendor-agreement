import { useState } from "react";
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
  MessageCircle,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  partnershipLevel: "growth",
  effectiveDate: new Date().toISOString().split("T")[0],
  signature: null,
  agreedToTerms: false,
};

export default function VendorAgreementForm() {
  const [agreementType, setAgreementType] = useState<AgreementType>("tours");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showAgreementViewer, setShowAgreementViewer] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    agreementId: number;
    pdfUrl: string;
  } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch partnership levels
  const { data: partnershipLevels } = trpc.agreements.getPartnershipLevels.useQuery({
    type: agreementType,
  });

  // Fetch agreement text for preview
  const { data: agreementText } = trpc.agreements.getAgreementText.useQuery(
    {
      type: agreementType,
      partnershipLevel: formData.partnershipLevel,
    },
    { enabled: showAgreementViewer }
  );

  // Submit agreement mutation
  const submitMutation = trpc.agreements.submit.useMutation({
    onSuccess: (data) => {
      console.log("Agreement submitted successfully:", data);
      setSubmissionSuccess({
        agreementId: data.agreementId,
        pdfUrl: data.pdfUrl,
      });
      toast.success("Agreement submitted successfully!");
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit agreement");
    },
  });

  const handleDownloadPDF = async () => {
    if (!submissionSuccess?.pdfUrl) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(submissionSuccess.pdfUrl);
      const html = await response.text();
      
      // Load html2pdf library from CDN
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      
      script.onload = () => {
        const container = document.createElement("div");
        container.innerHTML = html;
        container.style.display = "none";
        document.body.appendChild(container);

        const options = {
          margin: 10,
          filename: `ZNZNOW_${agreementType}_Agreement_${formData.vendorName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { orientation: "portrait", unit: "mm", format: "a4" }
        };

        const html2pdf = (window as any).html2pdf;
        html2pdf().set(options).from(container).save();

        setTimeout(() => {
          document.body.removeChild(container);
          setIsDownloading(false);
          toast.success("PDF downloaded successfully!");
        }, 1000);
      };

      script.onerror = () => {
        console.error("Failed to load html2pdf library");
        window.open(submissionSuccess.pdfUrl, "_blank");
        setIsDownloading(false);
        toast.success("Opening PDF in new window...");
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      window.open(submissionSuccess.pdfUrl, "_blank");
      setIsDownloading(false);
      toast.error("Failed to download PDF");
    }
  };

  // Email mutation
  const sendEmailMutation = trpc.agreements.sendEmail.useMutation({
    onSuccess: (data) => {
      console.log("Email sent successfully:", data);
      if (data.success) {
        toast.success("Agreement sent to your email!");
      } else {
        toast.error(data.message || "Failed to send email");
      }
    },
    onError: (error) => {
      console.error("Email error:", error);
      toast.error(error.message || "Failed to send email");
    },
  });



  const handleSendEmail = () => {
    console.log("handleSendEmail called with agreementId:", submissionSuccess?.agreementId);
    if (submissionSuccess?.agreementId) {
      sendEmailMutation.mutate({ agreementId: submissionSuccess.agreementId });
    }
  };

  const handleShareWhatsApp = () => {
    if (submissionSuccess?.agreementId && submissionSuccess?.pdfUrl) {
      const phone = formData.vendorWhatsapp || formData.vendorPhone;
      const cleanPhone = phone.replace(/[^0-9+]/g, "");
      const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone.slice(1) : cleanPhone;
      const message = encodeURIComponent(
        `Hello ${formData.contactPersonName}!\n\nYour ZNZNOW Vendor Agreement has been signed successfully.\n\n📄 Download your signed agreement here:\n${submissionSuccess.pdfUrl}\n\nThank you for partnering with ZNZNOW!\n\n- The ZNZNOW Team`
      );
      window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
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
              <Button 
                onClick={handleDownloadPDF} 
                className="w-full"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isDownloading ? "Downloading..." : "Download Signed Agreement (PDF)"}
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
                  setValidationErrors([]);
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
            >
              <Eye className="w-4 h-4 mr-2" />
              View Full Agreement
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl py-8">
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Please fix the following errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Agreement Type Selection */}
          <Card>
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
              </Tabs>
              <p className="text-sm text-muted-foreground mt-4">
                {agreementType === "tours"
                  ? "For tour operators, activity providers, excursion companies, and experience hosts in Zanzibar."
                  : "For restaurants, cafes, and food service establishments in Zanzibar."}
              </p>
            </CardContent>
          </Card>

          {/* Partnership Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Partnership Level
              </CardTitle>
              <CardDescription>
                Select your preferred partnership package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={formData.partnershipLevel} onValueChange={(value) => setFormData({ ...formData, partnershipLevel: value })}>
                <div className="space-y-4">
                  {partnershipLevels?.map((level) => (
                    <div key={level.id} className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50" onClick={() => setFormData({ ...formData, partnershipLevel: level.id })}>
                      <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={level.id} className="font-semibold cursor-pointer">
                          {level.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendorName">Business Name *</Label>
                  <Input
                    id="vendorName"
                    placeholder="Enter your business name"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="vendorRegistrationNo">Registration Number</Label>
                  <Input
                    id="vendorRegistrationNo"
                    placeholder="Business registration number"
                    value={formData.vendorRegistrationNo}
                    onChange={(e) => setFormData({ ...formData, vendorRegistrationNo: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vendorAddress">Business Address *</Label>
                <Input
                  id="vendorAddress"
                  placeholder="Full business address"
                  value={formData.vendorAddress}
                  onChange={(e) => setFormData({ ...formData, vendorAddress: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendorEmail">Email Address *</Label>
                  <Input
                    id="vendorEmail"
                    type="email"
                    placeholder="business@example.com"
                    value={formData.vendorEmail}
                    onChange={(e) => setFormData({ ...formData, vendorEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="vendorPhone">Phone Number *</Label>
                  <Input
                    id="vendorPhone"
                    type="tel"
                    placeholder="+255 XXX XXX XXX"
                    value={formData.vendorPhone}
                    onChange={(e) => setFormData({ ...formData, vendorPhone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vendorWhatsapp">WhatsApp Number (for notifications)</Label>
                <Input
                  id="vendorWhatsapp"
                  type="tel"
                  placeholder="+255 XXX XXX XXX"
                  value={formData.vendorWhatsapp}
                  onChange={(e) => setFormData({ ...formData, vendorWhatsapp: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Authorized Signatory */}
          <Card>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPersonName">Full Name *</Label>
                  <Input
                    id="contactPersonName"
                    placeholder="Enter full name"
                    value={formData.contactPersonName}
                    onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPersonTitle">Title/Position</Label>
                  <Input
                    id="contactPersonTitle"
                    placeholder="e.g., Owner, Manager, Director"
                    value={formData.contactPersonTitle}
                    onChange={(e) => setFormData({ ...formData, contactPersonTitle: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Digital Signature */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Digital Signature
              </CardTitle>
              <CardDescription>
                Sign below using your mouse or touch screen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignatureCanvas
                onSignatureChange={(signature) => setFormData({ ...formData, signature })}
              />
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  I have read and agree to the full terms and conditions of this vendor partnership agreement. I confirm that I am authorized to sign on behalf of the business named above.
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowAgreementViewer(true)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Agreement
            </Button>
            <Button 
              onClick={() => {
                const errors: string[] = [];
                if (!formData.vendorName) errors.push("Business name is required");
                if (!formData.vendorAddress) errors.push("Business address is required");
                if (!formData.vendorEmail) errors.push("Email address is required");
                if (!formData.vendorPhone) errors.push("Phone number is required");
                if (!formData.contactPersonName) errors.push("Contact person name is required");
                if (!formData.signature) errors.push("Signature is required");
                if (!formData.agreedToTerms) errors.push("You must agree to the terms and conditions");

                if (errors.length > 0) {
                  setValidationErrors(errors);
                  return;
                }

                setValidationErrors([]);
                submitMutation.mutate({
                  agreementType,
                  vendorName: formData.vendorName,
                  vendorAddress: formData.vendorAddress,
                  vendorRegistrationNo: formData.vendorRegistrationNo,
                  vendorEmail: formData.vendorEmail,
                  vendorPhone: formData.vendorPhone,
                  vendorWhatsapp: formData.vendorWhatsapp,
                  contactPersonName: formData.contactPersonName,
                  contactPersonTitle: formData.contactPersonTitle,
                  partnershipLevel: formData.partnershipLevel,
                  vendorSignature: formData.signature!,
                  effectiveDate: formData.effectiveDate || undefined,
                });
              }}
              disabled={submitMutation.isPending}
              className="flex-1"
            >
              {submitMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {submitMutation.isPending ? "Submitting..." : "Submit & Sign Agreement"}
            </Button>
          </div>
        </div>
      </main>

      {/* Agreement Viewer Modal */}
      <AgreementViewer
        isOpen={showAgreementViewer}
        onClose={() => setShowAgreementViewer(false)}
        agreementText={agreementText || ""}
        agreementType={agreementType}
        partnershipLevel={formData.partnershipLevel}
      />
    </div>
  );
}
