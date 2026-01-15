/**
 * Email service using SendGrid API
 * More reliable than Resend for production use
 */

import { ZNZNOW_COMPANY_INFO } from "../shared/agreementTemplates";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "noreply@znznow.com";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email using SendGrid API
 */
export async function sendEmailViaSendGrid(options: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn("[SendGrid] API key not configured, email will not be sent");
    return false;
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: options.to }],
            subject: options.subject,
          },
        ],
        from: {
          email: options.from || SENDGRID_FROM_EMAIL,
          name: ZNZNOW_COMPANY_INFO.tradeName,
        },
        content: [
          {
            type: "text/html",
            value: options.html,
          },
        ],
        reply_to: {
          email: ZNZNOW_COMPANY_INFO.email,
          name: ZNZNOW_COMPANY_INFO.name,
        },
      }),
    });

    if (response.status === 202) {
      console.log(`[SendGrid] Email sent successfully to ${options.to}`);
      return true;
    } else {
      const error = await response.text();
      console.error(`[SendGrid] Failed to send email: ${response.status} - ${error}`);
      return false;
    }
  } catch (error) {
    console.error("[SendGrid] Error sending email:", error);
    return false;
  }
}

/**
 * Generate HTML email for agreement
 */
export function generateAgreementEmailHTML(
  vendorName: string,
  agreementType: "tours" | "restaurant",
  agreementId: number,
  pdfUrl: string
): string {
  const title =
    agreementType === "tours"
      ? "Tours & Activities Vendor Agreement"
      : "Restaurant Vendor Agreement";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: #f9fafb;
          border-radius: 8px;
          padding: 30px;
          border: 1px solid #e5e7eb;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #1a365d;
          padding-bottom: 20px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #1a365d;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .company-info {
          font-size: 12px;
          color: #666;
        }
        .content {
          margin: 30px 0;
        }
        .content h2 {
          color: #1a365d;
          font-size: 20px;
          margin-bottom: 15px;
        }
        .content p {
          margin-bottom: 15px;
          font-size: 14px;
        }
        .details {
          background: white;
          border-left: 4px solid #1a365d;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .details p {
          margin: 8px 0;
          font-size: 13px;
        }
        .details strong {
          color: #1a365d;
        }
        .button {
          display: inline-block;
          background: #1a365d;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          margin: 20px 0;
        }
        .button:hover {
          background: #0f1f3d;
        }
        .footer {
          border-top: 1px solid #e5e7eb;
          margin-top: 30px;
          padding-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .footer a {
          color: #1a365d;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ZNZNOW</div>
          <div class="company-info">
            ${ZNZNOW_COMPANY_INFO.name}<br>
            ${ZNZNOW_COMPANY_INFO.address}<br>
            ${ZNZNOW_COMPANY_INFO.email}
          </div>
        </div>

        <div class="content">
          <h2>Your Agreement Has Been Signed Successfully!</h2>
          
          <p>Dear ${vendorName},</p>
          
          <p>Thank you for completing your vendor partnership agreement with ZNZNOW. Your agreement has been digitally signed and is now active.</p>

          <div class="details">
            <p><strong>Agreement Details:</strong></p>
            <p>Agreement ID: #${agreementId}</p>
            <p>Type: ${title}</p>
            <p>Status: Signed & Active</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>

          <p>Your signed agreement is attached to this email and is also available for download below:</p>

          <center>
            <a href="${pdfUrl}" class="button">Download Your Agreement</a>
          </center>

          <p>If you have any questions about your partnership agreement or need any assistance, please don't hesitate to contact us.</p>

          <p>
            Best regards,<br>
            <strong>The ZNZNOW Team</strong><br>
            ${ZNZNOW_COMPANY_INFO.email}
          </p>
        </div>

        <div class="footer">
          <p>This is an automated email. Please do not reply to this address.</p>
          <p>© ${new Date().getFullYear()} ${ZNZNOW_COMPANY_INFO.name}. All rights reserved.</p>
          <p>
            <a href="https://znznow.com">Visit our website</a> | 
            <a href="https://znznow.com/contact">Contact us</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate WhatsApp link for sharing agreement
 */
export function generateWhatsAppLink(
  phone: string,
  vendorName: string,
  agreementType: "tours" | "restaurant",
  pdfUrl: string
): string {
  const title =
    agreementType === "tours"
      ? "Tours & Activities"
      : "Restaurant";

  const message = `Hello ${vendorName}!\n\nYour ZNZNOW ${title} Vendor Agreement has been signed successfully.\n\n📄 Download your signed agreement here:\n${pdfUrl}\n\nThank you for partnering with ZNZNOW!\n\n- The ZNZNOW Team`;

  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone.slice(1) : cleanPhone;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
