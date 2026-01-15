/**
 * Client-side PDF download utility
 * Converts HTML to PDF and triggers download
 */

export async function downloadAgreementPDF(
  htmlContent: string,
  vendorName: string,
  agreementType: "tours" | "restaurant"
) {
  try {
    // Load html2pdf library from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    
    script.onload = () => {
      // Create a container for the HTML
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      container.style.display = 'none';
      document.body.appendChild(container);

      // Configure PDF options
      const options = {
        margin: 10,
        filename: `ZNZNOW_${agreementType}_Agreement_${vendorName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };

      // Generate PDF
      const html2pdf = (window as any).html2pdf;
      html2pdf().set(options).from(container).save();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(container);
      }, 1000);
    };

    script.onerror = () => {
      console.error('Failed to load html2pdf library');
      throw new Error('Failed to load PDF library');
    };

    document.head.appendChild(script);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}

/**
 * Alternative: Download HTML as text file for browser printing
 */
export function downloadAgreementHTML(
  htmlContent: string,
  vendorName: string,
  agreementType: "tours" | "restaurant"
) {
  const element = document.createElement('a');
  const file = new Blob([htmlContent], { type: 'text/html' });
  element.href = URL.createObjectURL(file);
  element.download = `ZNZNOW_${agreementType}_Agreement_${vendorName.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Print agreement directly
 */
export function printAgreement(htmlContent: string, title: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Failed to open print window');
    return;
  }

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
          font-size: 14pt;
          line-height: 1.8;
          color: #1a1a1a;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
