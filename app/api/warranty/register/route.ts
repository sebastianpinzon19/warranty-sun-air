import { NextResponse, NextRequest } from 'next/server';
import { addWarranty, Warranty } from '@/lib/database';
import { generateWarrantyCertificate } from '@/lib/pdf-generator';

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
      return NextResponse.json(
        { error: 'You must accept the terms and conditions' },
        { status: 400 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'At least one product is required' },
        { status: 400 }
      );
    }

    // Create warranty record
    const warrantyId = generateWarrantyId();
    const warranty: Warranty = {
      id: warrantyId,
      applicationType,
      ownerName,
      email,
      phone,
      installationDate: new Date(installationDate),
      address: {
        line1: addressLine1,
        line2: body.addressLine2 || '',
        city,
        state,
        zipCode,
      },
      dealer: {
        name: dealerName,
        email: dealerEmail,
        phone: dealerPhone,
      },
      products: products.map((p: any) => ({
        serialNumber: p.serialNumber,
      })),
      registeredAt: new Date(),
      status: 'active',
    };

    // Save to database
    await addWarranty(warranty);

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
    return NextResponse.json(
      { error: 'Failed to register warranty' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all warranties (for admin purposes - add authentication in production)
  const { getAllWarranties } = await import('@/lib/database');
  const warranties = await getAllWarranties();
  return NextResponse.json({ warranties });
}


