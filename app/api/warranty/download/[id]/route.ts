import { NextResponse, NextRequest } from 'next/server';
import { findWarrantyById } from '@/lib/database';
import { generateWarrantyCertificate } from '@/lib/pdf-generator';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: warrantyId } = await context.params;

    // Find warranty
    const warranty = await findWarrantyById(warrantyId);

    if (!warranty) {
      return NextResponse.json(
        { error: 'Warranty not found' },
        { status: 404 }
      );
    }

    // Generate PDF
    const pdf = generateWarrantyCertificate(warranty);
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Return PDF file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="warranty-${warrantyId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}


