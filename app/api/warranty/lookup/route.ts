import { NextResponse, NextRequest } from 'next/server';
import { findWarrantyByLastNameAndSerial } from '@/lib/database';
import { getRequestActor, logAudit } from '@/lib/audit';

export async function POST(request: any) {
  try {
    const body = await (request.json ? request.json() : Promise.resolve(request.body || {}));
    const { lastName, serialNumber } = body;
    const actor = request.headers?.get ? getRequestActor(request.headers as Headers) : 'unknown';

    if (!lastName || !serialNumber) {
      await logAudit({
        action: 'warranty_lookup_validation_failed',
        actor,
        outcome: 'failure',
        severity: 'warning',
        resource: '/api/warranty/lookup',
        details: { reason: 'missing_required_fields' },
      });
      return NextResponse.json(
        { error: 'Last name and serial number are required' },
        { status: 400 }
      );
    }

    const sanitize = (s: any, max = 200) => (typeof s === 'string' ? s.trim().slice(0, max) : '');
    const isValidSerial = (s: any) => typeof s === 'string' && /^[A-Z0-9\-]{4,64}$/i.test(s.trim());

    const ln = sanitize(lastName, 100);
    const sn = sanitize(serialNumber, 64);

    if (ln.length < 2 || sn.length < 4) {
      await logAudit({
        action: 'warranty_lookup_validation_failed',
        actor,
        outcome: 'failure',
        severity: 'warning',
        resource: '/api/warranty/lookup',
        details: { reason: 'invalid_lengths' },
      });
      return NextResponse.json(
        { error: 'Invalid lookup information' },
        { status: 400 }
      );
    }

    if (!isValidSerial(sn)) {
      await logAudit({
        action: 'warranty_lookup_validation_failed',
        actor,
        outcome: 'failure',
        severity: 'warning',
        resource: '/api/warranty/lookup',
        details: { reason: 'invalid_serial_format' },
      });
      return NextResponse.json({ error: 'Invalid serial number format' }, { status: 400 });
    }

    // Search for warranty
    const warranty = await findWarrantyByLastNameAndSerial(ln, sn);

    if (warranty) {
      await logAudit({
        action: 'warranty_lookup_success',
        actor,
        outcome: 'success',
        severity: 'info',
        resource: '/api/warranty/lookup',
        details: { warrantyId: warranty.id },
      });
      return NextResponse.json({
        found: true,
        warranty: {
          id: warranty.id,
          status: warranty.status,
        },
      });
    } else {
      await logAudit({
        action: 'warranty_lookup_not_found',
        actor,
        outcome: 'failure',
        severity: 'info',
        resource: '/api/warranty/lookup',
        details: {},
      });
      return NextResponse.json(
        {
          found: false,
          message: 'No warranty found with the provided information. Please check your details and try again.',
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error looking up warranty:', error);
    const actor = request.headers?.get ? getRequestActor(request.headers as Headers) : 'unknown';
    await logAudit({
      action: 'warranty_lookup_failed',
      actor,
      outcome: 'failure',
      severity: 'critical',
      resource: '/api/warranty/lookup',
      details: { message: error instanceof Error ? error.message : String(error) },
    });
    return NextResponse.json(
      { error: 'Failed to lookup warranty' },
      { status: 500 }
    );
  }
}
