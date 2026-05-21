import { NextResponse, NextRequest } from 'next/server';
import { addWarranty, Warranty } from '@/lib/database';
import { generateWarrantyCertificate } from '@/lib/pdf-generator';
import { hasAdminAccess } from '@/lib/security';
import { getRequestActor, logAudit } from '@/lib/audit';

// Generate warranty ID
function generateWarrantyId(): string {
  const prefix = 'SUN';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `${prefix}-${year}-${random}`;
}

export async function POST(request: any) {
  try {
    const body = await (request.json ? request.json() : Promise.resolve(request.body || {}));
    const actor = request.headers?.get ? getRequestActor(request.headers as Headers) : 'unknown';
    
    // Helper validations
    const isValidEmail = (e: any) => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;
    const sanitize = (s: any, max = 200) => (typeof s === 'string' ? s.trim().slice(0, max) : '');
    const isValidSerial = (s: any) => typeof s === 'string' && /^[A-Z0-9\-]{4,64}$/i.test(s.trim());
    const isValidPhone = (p: any) => typeof p === 'string' && p.trim().length <= 30;

    // Validate required fields
    const {
      applicationType,
      ownerName,
      email,
      phone,
      installationDate,
      addressLine1,
      city,
      state,
      zipCode,
      dealerName,
      dealerEmail,
      dealerPhone,
      products,
      acceptTerms,
    } = body;

    if (!acceptTerms) {
      await logAudit({
        action: 'warranty_register_validation_failed',
        actor,
        outcome: 'failure',
        severity: 'warning',
        resource: '/api/warranty/register',
        details: { reason: 'terms_not_accepted' },
      });
      return NextResponse.json(
        { error: 'You must accept the terms and conditions' },
        { status: 400 }
      );
    }

    if (!products || products.length === 0) {
      await logAudit({
        action: 'warranty_register_validation_failed',
        actor,
        outcome: 'failure',
        severity: 'warning',
        resource: '/api/warranty/register',
        details: { reason: 'products_missing' },
      });
      return NextResponse.json(
        { error: 'At least one product is required' },
        { status: 400 }
      );
    }

    // Validate lengths and formats
    if (!ownerName || String(ownerName).trim().length < 2 || String(ownerName).trim().length > 100) {
      await logAudit({
        action: 'warranty_register_validation_failed',
        actor,
        outcome: 'failure',
        severity: 'warning',
        resource: '/api/warranty/register',
        details: { reason: 'invalid_owner_name' },
      });
      return NextResponse.json({ error: 'Invalid owner name' }, { status: 400 });
    }
    if (email && !isValidEmail(email)) {
      await logAudit({
        action: 'warranty_register_validation_failed',
        actor,
        outcome: 'failure',
        severity: 'warning',
        resource: '/api/warranty/register',
        details: { reason: 'invalid_email' },
      });
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (phone && !isValidPhone(phone)) {
      await logAudit({
        action: 'warranty_register_validation_failed',
        actor,
        outcome: 'failure',
        severity: 'warning',
        resource: '/api/warranty/register',
        details: { reason: 'invalid_phone' },
      });
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
    }

    // Validate installation date
    const instDate = new Date(installationDate);
    if (Number.isNaN(instDate.getTime()) || instDate.getTime() > Date.now() + 24 * 60 * 60 * 1000) {
      await logAudit({
        action: 'warranty_register_validation_failed',
        actor,
        outcome: 'failure',
        severity: 'warning',
        resource: '/api/warranty/register',
        details: { reason: 'invalid_installation_date' },
      });
      return NextResponse.json({ error: 'Invalid installation date' }, { status: 400 });
    }

    // Validate products serial numbers
    for (const p of products) {
      if (!p || !p.serialNumber || !isValidSerial(p.serialNumber)) {
        await logAudit({
          action: 'warranty_register_validation_failed',
          actor,
          outcome: 'failure',
          severity: 'warning',
          resource: '/api/warranty/register',
          details: { reason: 'invalid_serial_number' },
        });
        return NextResponse.json({ error: 'Invalid product serial number' }, { status: 400 });
      }
    }

    // Create warranty record
    const warrantyId = generateWarrantyId();
    const warranty: Warranty = {
      id: warrantyId,
      applicationType: sanitize(applicationType, 50),
      ownerName: sanitize(ownerName, 100),
      email: sanitize(email, 254),
      phone: sanitize(phone, 30),
      installationDate: instDate,
      address: {
        line1: sanitize(addressLine1, 200),
        line2: sanitize(body.addressLine2 || '', 200),
        city: sanitize(city, 100),
        state: sanitize(state, 100),
        zipCode: sanitize(zipCode, 30),
      },
      dealer: {
        name: sanitize(dealerName, 100),
        email: sanitize(dealerEmail, 254),
        phone: sanitize(dealerPhone, 30),
      },
      products: products.map((p: any) => ({
        serialNumber: sanitize(p.serialNumber, 64),
      })),
      registeredAt: new Date(),
      status: 'active',
    };

    // Save to database
    await addWarranty(warranty);

    // Audit creation (non-sensitive: store id and originating IP)
    try {
      await logAudit({
        action: 'warranty_created',
        actor,
        outcome: 'success',
        severity: 'info',
        resource: '/api/warranty/register',
        details: { warrantyId: warranty.id },
      });
    } catch (e) {
      console.error('Audit log failed', e);
    }

    // Generate warranty certificate PDF (for immediate download if needed)
    // const pdf = generateWarrantyCertificate(warranty);

    // In production, save PDF to storage and send email
    // For now, we'll just return the warranty ID

    return NextResponse.json({
      success: true,
      warrantyId: warranty.id,
      message: 'Warranty registered successfully',
    });
  } catch (error) {
    console.error('Error registering warranty:', error);
    const actor = request.headers?.get ? getRequestActor(request.headers as Headers) : 'unknown';
    await logAudit({
      action: 'warranty_register_failed',
      actor,
      outcome: 'failure',
      severity: 'critical',
      resource: '/api/warranty/register',
      details: { message: error instanceof Error ? error.message : String(error) },
    });
    return NextResponse.json(
      { error: 'Failed to register warranty' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!hasAdminAccess(request)) {
    await logAudit({
      action: 'warranty_list_forbidden',
      actor: getRequestActor(request.headers),
      outcome: 'forbidden',
      severity: 'warning',
      resource: '/api/warranty/register',
      details: {},
    });
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { getAllWarranties } = await import('@/lib/database');
  const warranties = await getAllWarranties();
  try {
    await logAudit({
      action: 'list_warranties',
      actor: getRequestActor(request.headers),
      outcome: 'success',
      severity: 'info',
      resource: '/api/warranty/register',
      details: { count: warranties.length },
    });
  } catch (e) {
    console.error('Audit log failed', e);
  }
  return NextResponse.json({ warranties });
}


