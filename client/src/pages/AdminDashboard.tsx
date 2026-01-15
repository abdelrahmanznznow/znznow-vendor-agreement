import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Eye, 
  Mail, 
  MessageCircle, 
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Building2,
  User,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "signed" | "delivered" | "pending">("all");

  // Fetch all agreements
  const { data: agreements, isLoading, refetch } = trpc.agreements.getAll.useQuery();

  // Email mutation
  const sendEmailMutation = trpc.agreements.sendEmail.useMutation({
    onSuccess: () => {
      toast.success("Email sent successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send email");
    },
  });

  // Filter agreements
  const filteredAgreements = agreements?.filter((agreement) => {
    const matchesSearch = 
      agreement.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.vendorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.vendorPhone.includes(searchTerm);
    
    const matchesStatus = selectedStatus === "all" || agreement.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "signed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "delivered":
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return <Badge className="bg-green-100 text-green-800">Signed</Badge>;
      case "delivered":
        return <Badge className="bg-blue-100 text-blue-800">Delivered</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const handleSendEmail = (agreementId: number) => {
    sendEmailMutation.mutate({ agreementId });
  };

  const handleDownload = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };

  const stats = {
    total: agreements?.length || 0,
    signed: agreements?.filter(a => a.status === "signed").length || 0,
    delivered: agreements?.filter(a => a.status === "delivered").length || 0,
    pending: agreements?.filter(a => a.status === "pending").length || 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading agreements...</p>
        </div>
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
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Agreements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Signed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.signed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.delivered}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Vendor Agreements</CardTitle>
            <CardDescription>Manage and track all vendor partnership agreements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by vendor name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as any)} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="signed">Signed</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Agreements Table */}
        <div className="space-y-4">
          {filteredAgreements.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No agreements found
              </CardContent>
            </Card>
          ) : (
            filteredAgreements.map((agreement) => (
              <Card key={agreement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <h3 className="font-semibold text-lg">{agreement.vendorName}</h3>
                          {getStatusBadge(agreement.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {agreement.vendorEmail}
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            {agreement.vendorPhone}
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {agreement.agreementType === "tours" ? "Tours & Activities" : "Restaurant"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Contact Person</p>
                        <p className="font-medium">{agreement.contactPersonName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Partnership Level</p>
                        <p className="font-medium capitalize">{agreement.partnershipLevel}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Signed Date</p>
                        <p className="font-medium">{agreement.signedAt ? new Date(agreement.signedAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email Sent</p>
                        <p className="font-medium">{agreement.emailSent ? "Yes" : "No"}</p>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex gap-2 flex-wrap pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(agreement.pdfUrl || "")}
                        disabled={!agreement.pdfUrl}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendEmail(agreement.id)}
                        disabled={sendEmailMutation.isPending || (agreement.emailSent ?? false)}
                      >
                        {sendEmailMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Mail className="w-4 h-4 mr-2" />
                        )}
                        {agreement.emailSent ? "Email Sent" : "Send Email"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const phone = agreement.vendorWhatsapp || agreement.vendorPhone;
                          const cleanPhone = phone.replace(/[^0-9+]/g, "");
                          const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone.slice(1) : cleanPhone;
                          const message = encodeURIComponent(
                            `Hello ${agreement.vendorName}!\n\nYour ZNZNOW Vendor Agreement has been signed.\n\nDownload: ${agreement.pdfUrl}`
                          );
                          window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
