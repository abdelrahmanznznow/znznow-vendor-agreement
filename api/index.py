"""
ZNZNOW Vendor Agreement Management API - Production Version
Handles agreement creation, PDF generation, storage, archiving, and retrieval
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from datetime import datetime
import os
import json
import uuid
from io import BytesIO
import base64
from PIL import Image
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import sqlite3

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = '/home/ubuntu/vendor_agreements'
DATABASE = '/home/ubuntu/vendor_agreements/agreements.db'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(f'{UPLOAD_FOLDER}/pdfs', exist_ok=True)
os.makedirs(f'{UPLOAD_FOLDER}/signatures', exist_ok=True)
os.makedirs(f'{UPLOAD_FOLDER}/archives', exist_ok=True)

# Initialize database
def init_db():
    """Initialize SQLite database for storing agreement records"""
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    
    c.execute('''CREATE TABLE IF NOT EXISTS agreements (
        id TEXT PRIMARY KEY,
        vendor_name TEXT NOT NULL,
        vendor_email TEXT NOT NULL,
        vendor_registration TEXT NOT NULL,
        vendor_address TEXT NOT NULL,
        vendor_city TEXT NOT NULL,
        vendor_country TEXT NOT NULL,
        vendor_phone TEXT NOT NULL,
        contact_person TEXT NOT NULL,
        contact_title TEXT NOT NULL,
        partnership_level TEXT NOT NULL,
        effective_date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        pdf_path TEXT,
        signature_path TEXT,
        status TEXT DEFAULT 'pending',
        znznow_signed_date TEXT,
        vendor_signed_date TEXT,
        notes TEXT
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS agreement_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agreement_id TEXT NOT NULL,
        action TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        details TEXT,
        FOREIGN KEY (agreement_id) REFERENCES agreements(id)
    )''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
try:
    init_db()
except Exception as e:
    print(f"Database initialization error: {e}")

# Helper functions
def log_action(agreement_id, action, details=None):
    """Log agreement actions for audit trail"""
    try:
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute('''INSERT INTO agreement_logs (agreement_id, action, timestamp, details)
                     VALUES (?, ?, ?, ?)''',
                  (agreement_id, action, datetime.now().isoformat(), json.dumps(details) if details else None))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging action: {e}")

def save_signature(signature_data, agreement_id):
    """Save signature image from base64 data"""
    try:
        # Remove data URI prefix
        if ',' in signature_data:
            signature_data = signature_data.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(signature_data)
        
        # Save as PNG
        signature_path = f'{UPLOAD_FOLDER}/signatures/{agreement_id}.png'
        with open(signature_path, 'wb') as f:
            f.write(image_data)
        
        return signature_path
    except Exception as e:
        print(f"Error saving signature: {e}")
        return None

def generate_pdf(agreement_data):
    """Generate PDF from agreement data"""
    try:
        pdf_buffer = BytesIO()
        doc = SimpleDocTemplate(pdf_buffer, pagesize=letter,
                               rightMargin=0.75*inch, leftMargin=0.75*inch,
                               topMargin=0.75*inch, bottomMargin=0.75*inch)
        
        elements = []
        
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#667eea'),
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Normal'],
            fontSize=14,
            textColor=colors.HexColor('#764ba2'),
            spaceAfter=20,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=12,
            textColor=colors.HexColor('#333333'),
            spaceAfter=10,
            spaceBefore=10,
            fontName='Helvetica-Bold'
        )
        
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontSize=10,
            textColor=colors.HexColor('#555555'),
            spaceAfter=8,
            alignment=TA_JUSTIFY,
            leading=12
        )
        
        # Title
        elements.append(Paragraph("ZNZNOW TOURS & ACTIVITIES", title_style))
        elements.append(Paragraph("Vendor Partnership Agreement", subtitle_style))
        elements.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Vendor Information
        elements.append(Paragraph("1. VENDOR INFORMATION", heading_style))
        
        vendor_info = [
            ['Business Name:', agreement_data.get('vendorName', '')],
            ['Registration Number:', agreement_data.get('vendorRegistration', '')],
            ['Address:', agreement_data.get('vendorAddress', '')],
            ['City/Region:', agreement_data.get('vendorCity', '')],
            ['Country:', agreement_data.get('vendorCountry', '')],
            ['Contact Email:', agreement_data.get('vendorEmail', '')],
            ['Contact Phone:', agreement_data.get('vendorPhone', '')],
            ['Primary Contact:', agreement_data.get('contactPerson', '')],
            ['Contact Title:', agreement_data.get('contactTitle', '')],
        ]
        
        vendor_table = Table(vendor_info, colWidths=[2*inch, 4*inch])
        vendor_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f0f0f0')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ]))
        elements.append(vendor_table)
        elements.append(Spacer(1, 0.2*inch))
        
        # Partnership Level
        elements.append(Paragraph("2. PARTNERSHIP LEVEL", heading_style))
        partnership_text = "Growth Partner (25% Commission)" if agreement_data.get('partnershipLevel') == 'growth' else "Strategic Partner (30% Commission)"
        elements.append(Paragraph(f"<b>Selected:</b> {partnership_text}", body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Key Terms
        elements.append(Paragraph("3. KEY TERMS & CONDITIONS", heading_style))
        
        terms_text = """
        <b>Commission Structure:</b> Commission is calculated as Selling Price minus Commission Percentage equals Net Earnings. 
        Different tours can have different commission rates based on agreement.<br/><br/>
        
        <b>Payment Terms:</b> Weekly settlements via bank transfer or mobile wallet. Automatic payouts every week or when 
        balance reaches USD $1,000. Clear statements showing bookings, sales, commissions, and final balance.<br/><br/>
        
        <b>Price Parity:</b> Vendor agrees to maintain price parity between Znznow platform and direct offers. No lower 
        prices to customers who discovered through platform.<br/><br/>
        
        <b>Booking Management:</b> Vendor shall accept and prepare bookings unless justified reason to cancel (capacity, 
        safety, force majeure).<br/><br/>
        
        <b>Responsibilities:</b> Vendor provides accurate tour information, high-quality photos, maintains operating hours 
        and availability, and delivers services professionally.<br/><br/>
        
        <b>Termination:</b> Either party may terminate with 15 days' written notice or immediately for material breach.<br/><br/>
        
        <b>Confidentiality:</b> Both parties treat commercial data as confidential for 2 years after termination.<br/><br/>
        
        <b>Dispute Resolution:</b> Disputes resolved through mediation first, then arbitration in Zanzibar, Tanzania.<br/><br/>
        
        <b>Governing Law:</b> This agreement is governed by the laws of Zanzibar, Tanzania.
        """
        elements.append(Paragraph(terms_text, body_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Signature Section
        elements.append(PageBreak())
        elements.append(Paragraph("4. DIGITAL SIGNATURES", heading_style))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph("<b>ZNZNOW Representative Signature</b>", body_style))
        elements.append(Paragraph("Pre-signed by ZNZNOW", ParagraphStyle('Small', parent=styles['Normal'], fontSize=8, textColor=colors.grey)))
        elements.append(Paragraph(f"<b>Name:</b> Zanzisouk LTD - ZNZNOW<br/><b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", body_style))
        elements.append(Spacer(1, 0.3*inch))
        
        elements.append(Paragraph("<b>Vendor Signature</b>", body_style))
        elements.append(Paragraph(f"<b>Name:</b> {agreement_data.get('contactPerson', '')}<br/><b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", body_style))
        
        if agreement_data.get('signature_path') and os.path.exists(agreement_data['signature_path']):
            try:
                elements.append(Spacer(1, 0.1*inch))
                img = RLImage(agreement_data['signature_path'], width=2*inch, height=0.75*inch)
                elements.append(img)
            except Exception as e:
                print(f"Error adding signature image: {e}")
        
        elements.append(Spacer(1, 0.2*inch))
        elements.append(Paragraph("I have read and agree to all terms and conditions outlined in this agreement.", body_style))
        
        doc.build(elements)
        pdf_buffer.seek(0)
        return pdf_buffer
        
    except Exception as e:
        print(f"Error generating PDF: {e}")
        return None

# API Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/agreements', methods=['POST'])
def create_agreement():
    """Create a new vendor agreement"""
    try:
        data = request.get_json()
        
        required_fields = ['vendorName', 'vendorEmail', 'vendorRegistration', 'contactPerson', 'signature']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        agreement_id = str(uuid.uuid4())
        signature_path = save_signature(data['signature'], agreement_id)
        
        data['signature_path'] = signature_path
        pdf_buffer = generate_pdf(data)
        
        if not pdf_buffer:
            return jsonify({'error': 'Failed to generate PDF'}), 500
        
        pdf_path = f'{UPLOAD_FOLDER}/pdfs/{agreement_id}.pdf'
        with open(pdf_path, 'wb') as f:
            f.write(pdf_buffer.getvalue())
        
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        
        c.execute('''INSERT INTO agreements 
                     (id, vendor_name, vendor_email, vendor_registration, vendor_address, 
                      vendor_city, vendor_country, vendor_phone, contact_person, contact_title,
                      partnership_level, effective_date, created_at, pdf_path, signature_path, status, vendor_signed_date)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                  (agreement_id, data['vendorName'], data['vendorEmail'], data['vendorRegistration'],
                   data.get('vendorAddress', ''), data.get('vendorCity', ''), data.get('vendorCountry', ''), 
                   data.get('vendorPhone', ''), data['contactPerson'], data.get('contactTitle', ''), 
                   data.get('partnershipLevel', ''), data.get('effectiveDate', ''),
                   datetime.now().isoformat(), pdf_path, signature_path, 'signed', datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        log_action(agreement_id, 'created', {'vendor': data['vendorName'], 'email': data['vendorEmail']})
        
        return jsonify({
            'id': agreement_id,
            'status': 'success',
            'message': 'Agreement created successfully',
            'pdf_url': f'/api/agreements/{agreement_id}/pdf',
            'download_url': f'/api/agreements/{agreement_id}/download'
        }), 201
        
    except Exception as e:
        print(f"Error creating agreement: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/agreements/<agreement_id>', methods=['GET'])
def get_agreement(agreement_id):
    """Get agreement details"""
    try:
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        
        c.execute('SELECT * FROM agreements WHERE id = ?', (agreement_id,))
        row = c.fetchone()
        conn.close()
        
        if not row:
            return jsonify({'error': 'Agreement not found'}), 404
        
        columns = ['id', 'vendor_name', 'vendor_email', 'vendor_registration', 'vendor_address',
                   'vendor_city', 'vendor_country', 'vendor_phone', 'contact_person', 'contact_title',
                   'partnership_level', 'effective_date', 'created_at', 'pdf_path', 'signature_path',
                   'status', 'znznow_signed_date', 'vendor_signed_date', 'notes']
        
        agreement = dict(zip(columns, row))
        
        return jsonify(agreement), 200
        
    except Exception as e:
        print(f"Error retrieving agreement: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/agreements/<agreement_id>/pdf', methods=['GET'])
def view_agreement_pdf(agreement_id):
    """View agreement PDF"""
    try:
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        
        c.execute('SELECT pdf_path FROM agreements WHERE id = ?', (agreement_id,))
        result = c.fetchone()
        conn.close()
        
        if not result or not result[0]:
            return jsonify({'error': 'PDF not found'}), 404
        
        pdf_path = result[0]
        if not os.path.exists(pdf_path):
            return jsonify({'error': 'PDF file not found'}), 404
        
        return send_file(pdf_path, mimetype='application/pdf', as_attachment=False)
        
    except Exception as e:
        print(f"Error viewing PDF: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/agreements/<agreement_id>/download', methods=['GET'])
def download_agreement_pdf(agreement_id):
    """Download agreement PDF"""
    try:
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        
        c.execute('SELECT pdf_path, vendor_name FROM agreements WHERE id = ?', (agreement_id,))
        result = c.fetchone()
        conn.close()
        
        if not result or not result[0]:
            return jsonify({'error': 'PDF not found'}), 404
        
        pdf_path = result[0]
        vendor_name = result[1]
        
        if not os.path.exists(pdf_path):
            return jsonify({'error': 'PDF file not found'}), 404
        
        filename = f'ZNZNOW_Agreement_{vendor_name.replace(" ", "_")}_{datetime.now().year}.pdf'
        
        return send_file(pdf_path, mimetype='application/pdf', as_attachment=True, download_name=filename)
        
    except Exception as e:
        print(f"Error downloading PDF: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/agreements', methods=['GET'])
def list_agreements():
    """List all agreements"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status', None)
        
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        
        query = 'SELECT * FROM agreements WHERE 1=1'
        params = []
        
        if status:
            query += ' AND status = ?'
            params.append(status)
        
        count_query = query.replace('SELECT *', 'SELECT COUNT(*)')
        c.execute(count_query, params)
        total = c.fetchone()[0]
        
        offset = (page - 1) * per_page
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
        params.extend([per_page, offset])
        
        c.execute(query, params)
        rows = c.fetchall()
        conn.close()
        
        columns = ['id', 'vendor_name', 'vendor_email', 'vendor_registration', 'vendor_address',
                   'vendor_city', 'vendor_country', 'vendor_phone', 'contact_person', 'contact_title',
                   'partnership_level', 'effective_date', 'created_at', 'pdf_path', 'signature_path',
                   'status', 'znznow_signed_date', 'vendor_signed_date', 'notes']
        
        agreements = [dict(zip(columns, row)) for row in rows]
        
        return jsonify({
            'agreements': agreements,
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        }), 200
        
    except Exception as e:
        print(f"Error listing agreements: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get agreement statistics"""
    try:
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        
        c.execute('SELECT COUNT(*) FROM agreements')
        total = c.fetchone()[0]
        
        c.execute('SELECT status, COUNT(*) FROM agreements GROUP BY status')
        status_counts = dict(c.fetchall())
        
        c.execute('SELECT partnership_level, COUNT(*) FROM agreements GROUP BY partnership_level')
        partnership_counts = dict(c.fetchall())
        
        c.execute('SELECT id, vendor_name, created_at FROM agreements ORDER BY created_at DESC LIMIT 5')
        recent = [{'id': row[0], 'vendor_name': row[1], 'created_at': row[2]} for row in c.fetchall()]
        
        conn.close()
        
        return jsonify({
            'total': total,
            'by_status': status_counts,
            'by_partnership': partnership_counts,
            'recent': recent
        }), 200
        
    except Exception as e:
        print(f"Error getting statistics: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000, threaded=True)
