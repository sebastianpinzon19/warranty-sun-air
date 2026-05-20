import jsPDF from 'jspdf';
import { Warranty } from '@/lib/database';

// Generate warranty certificate PDF
export function generateWarrantyCertificate(warranty: Warranty) {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(0, 51, 102); // SUN BLUE
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 179, 0); // SUN YELLOW
  doc.setFontSize(28);
  doc.text('SUN AIR', 105, 20, { align: 'center' });
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('WARRANTY CERTIFICATE', 105, 30, { align: 'center' });
  
  // Warranty ID
  doc.setTextColor(0, 51, 102);
  doc.setFontSize(14);
  doc.text(`Warranty ID: ${warranty.id}`, 20, 55);
  
  // Customer Information
  doc.setFontSize(16);
  doc.text('CUSTOMER INFORMATION', 20, 75);
  doc.setFontSize(12);
  doc.text(`Name: ${warranty.ownerName}`, 20, 85);
  doc.text(`Email: ${warranty.email}`, 20, 93);
  doc.text(`Phone: ${warranty.phone}`, 20, 101);
  doc.text(`Address: ${warranty.address.line1}`, 20, 109);
  if (warranty.address.line2) {
    doc.text(`         ${warranty.address.line2}`, 20, 117);
  }
  doc.text(`         ${warranty.address.city}, ${warranty.address.state} ${warranty.address.zipCode}`, 20, 125);
  doc.text(`Application Type: ${warranty.applicationType.charAt(0).toUpperCase() + warranty.applicationType.slice(1)}`, 20, 133);
  
  // Installation Date
  doc.text(`Installation Date: ${new Date(warranty.installationDate).toLocaleDateString()}`, 20, 145);
  
  // Dealer Information
  doc.setFontSize(16);
  doc.text('DEALER INFORMATION', 20, 165);
  doc.setFontSize(12);
  doc.text(`Dealer Name: ${warranty.dealer.name}`, 20, 175);
  doc.text(`Email: ${warranty.dealer.email}`, 20, 183);
  doc.text(`Phone: ${warranty.dealer.phone}`, 20, 191);
  
  // Products
  doc.addPage();
  doc.setFillColor(0, 51, 102);
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setTextColor(255, 179, 0);
  doc.setFontSize(20);
  doc.text('REGISTERED PRODUCTS', 105, 20, { align: 'center' });
  
  doc.setTextColor(0, 51, 102);
  let yPosition = 50;
  warranty.products.forEach((product, index) => {
    doc.setFontSize(12);
    doc.text(`Product #${index + 1}:`, 20, yPosition);
    doc.text(`Serial Number: ${product.serialNumber}`, 20, yPosition + 8);
    yPosition += 25;
    
    if (yPosition > 250 && index < warranty.products.length - 1) {
      doc.addPage();
      yPosition = 30;
    }
  });
  
  // Terms and Conditions
  doc.addPage();
  doc.setFillColor(0, 51, 102);
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setTextColor(255, 179, 0);
  doc.setFontSize(20);
  doc.text('TERMS AND CONDITIONS', 105, 20, { align: 'center' });
  
  doc.setTextColor(0, 51, 102);
  doc.setFontSize(10);
  const terms = [
    '1. This warranty certificate is valid from the date of installation.',
    '2. Warranty must be registered within 60 days of installation for full coverage.',
    '3. Equipment must be installed by a licensed HVAC contractor.',
    '4. Regular maintenance is required to maintain warranty validity.',
    '5. This warranty is non-transferable unless otherwise specified.',
    '6. Claims must be filed through authorized service centers.',
    '7. SUN AIR reserves the right to inspect equipment before honoring claims.',
    '',
    `Registration Date: ${new Date(warranty.registeredAt).toLocaleDateString()}`,
    `Warranty Status: ${warranty.status.toUpperCase()}`,
  ];
  
  let termsY = 50;
  terms.forEach(line => {
    doc.text(line, 20, termsY);
    termsY += 8;
  });
  
  // Footer
  doc.setTextColor(128, 128, 128);
  doc.setFontSize(8);
  doc.text('© SUN AIR - All Rights Reserved', 105, 285, { align: 'center' });
  doc.text('For warranty claims, contact our support team', 105, 290, { align: 'center' });
  
  return doc;
}
