import os
import json
import base64
import io
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from reportlab.lib.pagesizes import LETTER
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.units import inch

app = Flask(__name__)
CORS(app)

def generate_pdf_buffer(data):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=LETTER, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], fontSize=18, textColor=colors.HexColor("#0F4C5C"), spaceAfter=12)
    header_style = ParagraphStyle('HeaderStyle', parent=styles['Heading2'], fontSize=14, textColor=colors.HexColor("#0F4C5C"), spaceBefore=12, spaceAfter=6)
    body_style = styles['Normal']
    
    elements = []
    
    # Title
    elements.append(Paragraph("ZNZNOW TOURS VENDOR AGREEMENT", title_style))
    elements.append(Spacer(1, 0.2 * inch))
    
    # Vendor Info Table
    vendor_info = [
        ["Vendor Name:", data.get('vendorName', '')],
        ["Registration No:", data.get('vendorRegistration', '')],
        ["Business Address:", data.get('vendorAddress', '')],
        ["Contact Person:", data.get('contactPerson', '')],
        ["Email:", data.get('vendorEmail', '')],
        ["Phone:", data.get('vendorPhone', '')],
        ["Partnership Level:", data.get('partnershipLevel', '').replace('_', ' ').title()],
        ["Effective Date:", data.get('effectiveDate', '')]
    ]
    
    t = Table(vendor_info, colWidths=[1.5 * inch, 4 * inch])
    t.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#E3F2FD")),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.3 * inch))
    
    # Agreement Summary
    elements.append(Paragraph("Agreement Summary", header_style))
    summary_text = f"This agreement establishes a partnership between ZNZNOW and {data.get('vendorName')} for the provision of tours and activities. The vendor has selected the {data.get('partnershipLevel', '').replace('_', ' ').title()} package."
    elements.append(Paragraph(summary_text, body_style))
    elements.append(Spacer(1, 0.3 * inch))
    
    # Signatures
    elements.append(Paragraph("Signatures", header_style))
    
    # Process Signature Image
    sig_data = data.get('signature')
    sig_img = None
    if sig_data and ',' in sig_data:
        try:
            header, encoded = sig_data.split(",", 1)
            img_data = base64.b64decode(encoded)
            sig_buffer = io.BytesIO(img_data)
            sig_img = Image(sig_buffer, width=2*inch, height=0.75*inch)
        except Exception as e:
            print(f"Signature error: {e}")

    sig_table_data = [
        [Paragraph("<b>ZNZNOW Representative</b>", body_style), Paragraph(f"<b>{data.get('vendorName')} Authorized Signatory</b>", body_style)],
        ["[Digital Signature Applied]", sig_img if sig_img else "No Signature Provided"],
        ["Name: Zanzisouk LTD", f"Name: {data.get('contactPerson')}"],
        [f"Date: {datetime.now().strftime('%B %d, %Y')}", f"Date: {data.get('effectiveDate')}"]
    ]
    
    sig_table = Table(sig_table_data, colWidths=[2.75 * inch, 2.75 * inch])
    sig_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(sig_table)
    
    doc.build(elements)
    buffer.seek(0)
    return buffer

@app.route('/api/submit', methods=['POST'])
def submit_agreement():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Generate PDF in memory
        pdf_buffer = generate_pdf_buffer(data)
        
        # Return the PDF directly to the browser
        filename = f"ZNZNOW_Agreement_{data.get('vendorName', 'Vendor').replace(' ', '_')}.pdf"
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "ZNZNOW Agreement API"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
