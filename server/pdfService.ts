import { ZNZNOW_COMPANY_INFO, TOURS_AGREEMENT_TEXT, RESTAURANT_AGREEMENT_TEXT, TOURS_PARTNERSHIP_LEVELS, RESTAURANT_PARTNERSHIP_LEVELS } from "../shared/agreementTemplates";
import type { Agreement } from "../drizzle/schema";

// ZNZNOW signature as base64 (a simple digital signature representation)
const ZNZNOW_SIGNATURE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
  <text x="10" y="40" font-family="Brush Script MT, cursive" font-size="32" fill="#1a365d">AbdelRahman Ahmed</text>
</svg>
`;

// Company stamp as SVG
const ZNZNOW_STAMP_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="55" fill="none" stroke="#1a365d" stroke-width="3"/>
  <circle cx="60" cy="60" r="45" fill="none" stroke="#1a365d" stroke-width="1"/>
  <text x="60" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#1a365d" font-weight="bold">ZANZISOUK LTD</text>
  <text x="60" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#1a365d" font-weight="bold">ZNZNOW</text>
  <text x="60" y="75" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#1a365d">ZANZIBAR, TANZANIA</text>
  <text x="60" y="90" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" fill="#1a365d">OFFICIAL</text>
</svg>
`;

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getPartnershipDetails(type: "tours" | "restaurant", level: string) {
  if (type === "tours") {
    const found = TOURS_PARTNERSHIP_LEVELS.find(p => p.id === level);
    return found ? { name: found.name, commission: found.commission } : { name: level, commission: "25%" };
  } else {
    const found = RESTAURANT_PARTNERSHIP_LEVELS.find(p => p.id === level);
    return found ? { name: found.name, commission: found.commission } : { name: level, commission: "15%" };
  }
}

function replaceTemplateVariables(template: string, agreement: Agreement): string {
  const partnershipDetails = getPartnershipDetails(agreement.agreementType, agreement.partnershipLevel);
  const effectiveDate = agreement.effectiveDate ? formatDate(new Date(agreement.effectiveDate)) : formatDate(new Date());
  
  return template
    .replace(/\{\{EFFECTIVE_DATE\}\}/g, effectiveDate)
    .replace(/\{\{VENDOR_NAME\}\}/g, agreement.vendorName)
    .replace(/\{\{VENDOR_ADDRESS\}\}/g, agreement.vendorAddress)
    .replace(/\{\{VENDOR_REGISTRATION\}\}/g, agreement.vendorRegistrationNo || "N/A")
    .replace(/\{\{COMMISSION_RATE\}\}/g, partnershipDetails.commission)
    .replace(/\{\{PARTNERSHIP_LEVEL\}\}/g, partnershipDetails.name);
}

export function generateAgreementHTML(agreement: Agreement): string {
  const template = agreement.agreementType === "tours" ? TOURS_AGREEMENT_TEXT : RESTAURANT_AGREEMENT_TEXT;
  const filledTemplate = replaceTemplateVariables(template, agreement);
  const partnershipDetails = getPartnershipDetails(agreement.agreementType, agreement.partnershipLevel);
  const effectiveDate = agreement.effectiveDate ? formatDate(new Date(agreement.effectiveDate)) : formatDate(new Date());
  const signedDate = agreement.signedAt ? formatDate(new Date(agreement.signedAt)) : formatDate(new Date());

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZNZNOW Vendor Agreement - ${agreement.vendorName}</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 14pt;
      line-height: 1.8;
      color: #1a1a1a;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
      background: white;
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
    
    .agreement-subtitle {
      font-size: 12pt;
      text-align: center;
      color: #444;
      margin-bottom: 30px;
    }
    
    .section {
      margin-bottom: 20px;
    }
    
    .section-title {
      font-size: 14pt;
      font-weight: bold;
      color: #1a365d;
      margin-bottom: 10px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    
    .content {
      white-space: pre-wrap;
      text-align: justify;
      font-size: 14pt;
      line-height: 1.8;
      letter-spacing: 0.3px;
    }
    
    .parties-box {
      background: #f8f9fa;
      border: 1px solid #ddd;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    
    .party {
      margin-bottom: 15px;
    }
    
    .party-title {
      font-weight: bold;
      color: #1a365d;
      margin-bottom: 5px;
    }
    
    .signature-section {
      margin-top: 50px;
      page-break-inside: avoid;
    }
    
    .signatures-container {
      display: flex;
      justify-content: space-between;
      gap: 40px;
      margin-top: 30px;
    }
    
    .signature-box {
      flex: 1;
      border: 1px solid #ddd;
      padding: 20px;
      min-height: 200px;
    }
    
    .signature-box-title {
      font-weight: bold;
      color: #1a365d;
      margin-bottom: 15px;
      font-size: 11pt;
    }
    
    .signature-image {
      height: 60px;
      margin: 10px 0;
    }
    
    .signature-line {
      border-bottom: 1px solid #333;
      height: 60px;
      margin: 10px 0;
      display: flex;
      align-items: flex-end;
      padding-bottom: 5px;
    }
    
    .signature-label {
      font-size: 9pt;
      color: #666;
      margin-top: 5px;
    }
    
    .stamp-container {
      text-align: center;
      margin-top: 20px;
    }
    
    .stamp {
      display: inline-block;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }
    
    .page-break {
      page-break-before: always;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
      font-size: 12pt;
    }
    
    th {
      background: #f0f0f0;
      font-weight: bold;
    }
    
    ul, ol {
      margin: 10px 0;
      padding-left: 25px;
    }
    
    li {
      margin-bottom: 8px;
      font-size: 14pt;
    }

    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">ZNZNOW</div>
    <div class="company-info">
      ${ZNZNOW_COMPANY_INFO.name} | ${ZNZNOW_COMPANY_INFO.address}<br>
      Email: ${ZNZNOW_COMPANY_INFO.email}
    </div>
  </div>

  <div class="agreement-title">
    ${agreement.agreementType === "tours" ? "TOURS & ACTIVITIES VENDOR AGREEMENT" : "RESTAURANT VENDOR AGREEMENT"}
  </div>
  
  <div class="agreement-subtitle">
    ${partnershipDetails.name} - Commission Rate: ${partnershipDetails.commission}
  </div>

  <div class="parties-box">
    <div class="party">
      <div class="party-title">THE VENDOR:</div>
      <div><strong>Name:</strong> ${agreement.vendorName}</div>
      <div><strong>Address:</strong> ${agreement.vendorAddress}</div>
      <div><strong>Registration No:</strong> ${agreement.vendorRegistrationNo || "N/A"}</div>
      <div><strong>Email:</strong> ${agreement.vendorEmail}</div>
      <div><strong>Phone:</strong> ${agreement.vendorPhone}</div>
      <div><strong>Contact Person:</strong> ${agreement.contactPersonName}${agreement.contactPersonTitle ? `, ${agreement.contactPersonTitle}` : ""}</div>
    </div>
    
    <div class="party">
      <div class="party-title">THE APP:</div>
      <div><strong>Name:</strong> ${ZNZNOW_COMPANY_INFO.tradeName}</div>
      <div><strong>Company:</strong> ${ZNZNOW_COMPANY_INFO.name}</div>
      <div><strong>Address:</strong> ${ZNZNOW_COMPANY_INFO.address}</div>
      <div><strong>Email:</strong> ${ZNZNOW_COMPANY_INFO.email}</div>
    </div>
    
    <div><strong>Effective Date:</strong> ${effectiveDate}</div>
  </div>

  <div class="content">${filledTemplate.replace(/\n/g, '<br>')}</div>

  <div class="signature-section">
    <div class="section-title">SIGNATURES</div>
    
    <div class="signatures-container">
      <div class="signature-box">
        <div class="signature-box-title">THE VENDOR</div>
        <div class="signature-label">Business Name:</div>
        <div><strong>${agreement.vendorName}</strong></div>
        
        <div class="signature-label" style="margin-top: 15px;">Signatory Name:</div>
        <div><strong>${agreement.contactPersonName}</strong></div>
        
        ${agreement.contactPersonTitle ? `
        <div class="signature-label">Title:</div>
        <div><strong>${agreement.contactPersonTitle}</strong></div>
        ` : ''}
        
        <div class="signature-label" style="margin-top: 15px;">Signature:</div>
        ${agreement.vendorSignature ? `
        <div class="signature-image">
          <img src="${agreement.vendorSignature}" alt="Vendor Signature" style="max-height: 60px; max-width: 200px;">
        </div>
        ` : `
        <div class="signature-line"></div>
        `}
        
        <div class="signature-label">Date:</div>
        <div><strong>${signedDate}</strong></div>
      </div>
      
      <div class="signature-box">
        <div class="signature-box-title">THE APP - ${ZNZNOW_COMPANY_INFO.name}</div>
        
        <div class="signature-label">Name:</div>
        <div><strong>${ZNZNOW_COMPANY_INFO.representative}</strong></div>
        
        <div class="signature-label">Title:</div>
        <div><strong>${ZNZNOW_COMPANY_INFO.representativeTitle}</strong></div>
        
        <div class="signature-label" style="margin-top: 15px;">Signature:</div>
        <div class="signature-image">
          ${ZNZNOW_SIGNATURE_SVG}
        </div>
        
        <div class="signature-label">Date:</div>
        <div><strong>${signedDate}</strong></div>
        
        <div class="stamp-container">
          <div class="stamp">
            ${ZNZNOW_STAMP_SVG}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This agreement was generated and signed digitally via the ZNZNOW Vendor Onboarding System.</p>
    <p>Agreement ID: ${agreement.id} | Generated on: ${formatDate(new Date())}</p>
    <p>${ZNZNOW_COMPANY_INFO.name} | ${ZNZNOW_COMPANY_INFO.address} | ${ZNZNOW_COMPANY_INFO.email}</p>
  </div>
</body>
</html>
`;

  return html;
}

// Generate printable agreement text (for viewing before signing)
export function generatePrintableAgreement(type: "tours" | "restaurant", partnershipLevel: string): string {
  const template = type === "tours" ? TOURS_AGREEMENT_TEXT : RESTAURANT_AGREEMENT_TEXT;
  const partnershipDetails = getPartnershipDetails(type, partnershipLevel);
  
  return template
    .replace(/\{\{EFFECTIVE_DATE\}\}/g, "[To be determined upon signing]")
    .replace(/\{\{VENDOR_NAME\}\}/g, "[Vendor Name]")
    .replace(/\{\{VENDOR_ADDRESS\}\}/g, "[Vendor Address]")
    .replace(/\{\{VENDOR_REGISTRATION\}\}/g, "[Registration Number]")
    .replace(/\{\{COMMISSION_RATE\}\}/g, partnershipDetails.commission)
    .replace(/\{\{PARTNERSHIP_LEVEL\}\}/g, partnershipDetails.name);
}
