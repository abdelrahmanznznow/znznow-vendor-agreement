import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Printer, X } from "lucide-react";

interface AgreementViewerProps {
  isOpen: boolean;
  onClose: () => void;
  agreementText: string;
  agreementType: "tours" | "restaurant";
  partnershipLevel: string;
}

export function AgreementViewer({
  isOpen,
  onClose,
  agreementText,
  agreementType,
  partnershipLevel,
}: AgreementViewerProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const title = agreementType === "tours" 
      ? "ZNZNOW Tours & Activities Vendor Agreement" 
      : "ZNZNOW Restaurant Vendor Agreement";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #1a365d;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28pt;
            font-weight: bold;
            color: #1a365d;
            letter-spacing: 2px;
          }
          .company-info {
            font-size: 9pt;
            color: #666;
            margin-top: 5px;
          }
          .agreement-title {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            color: #1a365d;
            margin: 30px 0 20px 0;
            text-transform: uppercase;
          }
          .content {
            white-space: pre-wrap;
            text-align: justify;
          }
          h1, h2, h3 {
            color: #1a365d;
            margin-top: 1.5em;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">ZNZNOW</div>
          <div class="company-info">
            Zanzisouk LTD | Migoz Plaza, Nyerere Road, Zanzibar, Tanzania<br>
            Email: contact@znznow.com
          </div>
        </div>
        <div class="agreement-title">${title}</div>
        <div class="content">${agreementText.replace(/\n/g, '<br>')}</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-primary">
                {agreementType === "tours" 
                  ? "Tours & Activities Vendor Agreement" 
                  : "Restaurant Vendor Agreement"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Partnership Level: {partnershipLevel} | Review the full terms and conditions below
              </DialogDescription>
            </div>
            <div className="flex gap-2 no-print">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6">
          <div className="py-6">
            {/* Header */}
            <div className="text-center border-b-2 border-primary pb-6 mb-8">
              <h1 className="text-3xl font-bold text-primary tracking-wide">ZNZNOW</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Zanzisouk LTD | Migoz Plaza, Nyerere Road, Zanzibar, Tanzania
              </p>
              <p className="text-sm text-muted-foreground">
                Email: contact@znznow.com
              </p>
            </div>

            {/* Agreement Content */}
            <div className="agreement-text text-sm leading-relaxed whitespace-pre-wrap">
              {agreementText}
            </div>

            {/* Signature Section Placeholder */}
            <div className="mt-12 pt-8 border-t-2 border-primary">
              <h2 className="text-lg font-bold text-primary mb-6">SIGNATURES</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-primary mb-4">THE VENDOR</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Business Name:</span>
                      <div className="border-b border-dashed h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Signatory Name:</span>
                      <div className="border-b border-dashed h-6 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Signature:</span>
                      <div className="border-b border-dashed h-16 mt-1"></div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <div className="border-b border-dashed h-6 mt-1"></div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-primary mb-4">THE APP - Zanzisouk LTD</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <div className="font-medium mt-1">AbdelRahman Ahmed</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Title:</span>
                      <div className="font-medium mt-1">Founder & CEO</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Signature:</span>
                      <div className="h-16 mt-1 flex items-center">
                        <svg width="200" height="50" viewBox="0 0 200 50">
                          <text x="10" y="35" fontFamily="Brush Script MT, cursive" fontSize="28" fill="#1a365d">AbdelRahman Ahmed</text>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <div className="font-medium mt-1">[Upon vendor signature]</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t flex-shrink-0 no-print">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              This is a preview of the agreement. Fill out the form and sign to complete.
            </p>
            <Button onClick={onClose}>Close Preview</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
