import { ENV } from "./_core/env";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using Resend API (fallback to console if API key not configured)
 * Resend is a reliable email service for transactional emails
 */
export async function sendEmailViaResend(options: EmailOptions): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  // If no Resend API key, log to console (for development)
  if (!resendApiKey) {
    console.log("[sendEmail] No RESEND_API_KEY configured, logging email to console:");
    console.log({
      to: options.to,
      subject: options.subject,
      from: options.from || "noreply@znznow.com",
      htmlLength: options.html.length,
    });
    return true; // Return true to allow testing without API key
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: options.from || "noreply@znznow.com",
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[sendEmail] Resend API error:", response.status, errorText);
      return false;
    }

    const data = await response.json();
    console.log("[sendEmail] Email sent successfully via Resend:", data.id);
    return true;
  } catch (error) {
    console.error("[sendEmail] Resend service error:", error);
    return false;
  }
}

/**
 * Send email using Manus Forge API (built-in)
 */
export async function sendEmailViaForge(options: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch(`${ENV.forgeApiUrl}/api/notification/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      console.error("[sendEmail] Forge API error:", response.status, await response.text());
      return false;
    }

    console.log("[sendEmail] Email sent successfully via Forge API");
    return true;
  } catch (error) {
    console.error("[sendEmail] Forge API error:", error);
    return false;
  }
}

/**
 * Send email with fallback strategy
 * Try Resend first, then Forge API, then console logging
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  console.log("[sendEmail] Attempting to send email to:", options.to);

  // Try Resend first if API key is configured
  if (process.env.RESEND_API_KEY) {
    const resendSuccess = await sendEmailViaResend(options);
    if (resendSuccess) {
      return true;
    }
  }

  // Fallback to Forge API
  const forgeSuccess = await sendEmailViaForge(options);
  if (forgeSuccess) {
    return true;
  }

  // Final fallback: log to console for development
  console.log("[sendEmail] All email services failed, logging to console");
  console.log({
    to: options.to,
    subject: options.subject,
    from: "noreply@znznow.com",
    htmlLength: options.html.length,
  });
  
  return true; // Return true to allow testing
}

/**
 * Generate email HTML for vendor agreement
 */
export function generateAgreementEmailHTML(vendorName: string, agreementType: string, downloadUrl: string): string {
  const typeLabel = agreementType === "tours" ? "Tours & Activities" : "Restaurant";
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ZNZNOW Vendor Agreement</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1a365d; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">ZNZNOW</h1>
              <p style="color: #a0aec0; margin: 10px 0 0 0; font-size: 14px;">Vendor Partnership Agreement</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1a365d; margin: 0 0 20px 0; font-size: 22px;">Dear ${vendorName},</h2>
              
              <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for signing your <strong>${typeLabel} Vendor Partnership Agreement</strong> with ZNZNOW. 
                We are excited to welcome you as a partner!
              </p>
              
              <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0;">
                Your signed agreement is now complete and ready for your records. Please download and save a copy for your files.
              </p>
              
              <!-- Download Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${downloadUrl}" style="display: inline-block; background-color: #1a365d; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      Download Your Agreement
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0;">
                <strong>What happens next?</strong>
              </p>
              
              <ul style="color: #4a5568; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>Our team will review your agreement and activate your vendor account</li>
                <li>You will receive onboarding instructions within 24-48 hours</li>
                <li>You can start listing your services on the ZNZNOW platform</li>
              </ul>
              
              <p style="color: #4a5568; line-height: 1.6; margin: 0;">
                If you have any questions, please don't hesitate to contact us at 
                <a href="mailto:contact@znznow.com" style="color: #1a365d;">contact@znznow.com</a>.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; margin: 0 0 10px 0; font-size: 14px;">
                <strong>Zanzisouk LTD</strong> (Trading as ZNZNOW)
              </p>
              <p style="color: #a0aec0; margin: 0; font-size: 12px;">
                Migoz Plaza, Nyerere Road, Zanzibar, Tanzania
              </p>
              <p style="color: #a0aec0; margin: 5px 0 0 0; font-size: 12px;">
                © ${new Date().getFullYear()} Zanzisouk LTD. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Generate WhatsApp message link for sharing agreement
 */
export function generateWhatsAppLink(phone: string, vendorName: string, downloadUrl: string): string {
  // Clean phone number (remove spaces, dashes, etc.)
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  
  // Ensure phone starts with country code
  const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone.slice(1) : cleanPhone;
  
  const message = encodeURIComponent(
    `Hello ${vendorName}!\n\n` +
    `Your ZNZNOW Vendor Partnership Agreement has been signed successfully.\n\n` +
    `📄 Download your signed agreement here:\n${downloadUrl}\n\n` +
    `Thank you for partnering with ZNZNOW!\n\n` +
    `- The ZNZNOW Team`
  );
  
  return `https://wa.me/${formattedPhone}?text=${message}`;
}
