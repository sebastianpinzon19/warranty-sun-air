import { NextResponse, NextRequest } from 'next/server';
import { findWarrantyById } from '@/lib/database';
import { generateWarrantyCertificate } from '@/lib/pdf-generator';
import { hasAdminAccess } from '@/lib/security';
import { logAudit, getRequestActor } from '@/lib/audit';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const actor = getRequestActor(request.headers);

    if (!hasAdminAccess(request)) {
      await logAudit({
        action: 'download_pdf_forbidden',
        actor,
        outcome: 'forbidden',
        severity: 'warning',
        resource: '/api/warranty/download/[id]',
        details: {},
      });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: warrantyId } = await context.params;

    // Find warranty
    const warranty = await findWarrantyById(warrantyId);

    if (!warranty) {
      await logAudit({
        action: 'download_pdf_not_found',
        actor,
        outcome: 'failure',
        severity: 'warning',
        resource: '/api/warranty/download/[id]',
        details: { warrantyId },
      });
      return NextResponse.json(
        { error: 'Warranty not found' },
        { status: 404 }
      );
    }

    // Generate PDF
    const pdf = generateWarrantyCertificate(warranty);
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    // Audit admin download
    try {
      await logAudit({
        action: 'download_pdf',
        actor,
        outcome: 'success',
        severity: 'info',
        resource: '/api/warranty/download/[id]',
        details: { warrantyId },
      });
    } catch (e) {
      console.error('Audit log failed', e);
    }

    // Return PDF file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="warranty-${warrantyId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    await logAudit({
      action: 'download_pdf_failed',
      actor: getRequestActor(request.headers),
      outcome: 'failure',
      severity: 'critical',
      resource: '/api/warranty/download/[id]',
      details: { message: error instanceof Error ? error.message : String(error) },
    });
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}


