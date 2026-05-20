import { NextResponse, NextRequest } from 'next/server';
import { findWarrantyByLastNameAndSerial } from '@/lib/database';

export async function POST(request: any) {
  try {
    const body = await (request.json ? request.json() : Promise.resolve(request.body || {}));
    const { lastName, serialNumber } = body;

    if (!lastName || !serialNumber) {
      return NextResponse.json(
        { error: 'Last name and serial number are required' },
        { status: 400 }
      );
    }

    // Search for warranty
    const warranty = await findWarrantyByLastNameAndSerial(lastName, serialNumber);

    if (warranty) {
      return NextResponse.json({
        found: true,
        warranty: {
          id: warranty.id,
          ownerName: warranty.ownerName,
          installationDate: warranty.installationDate,
          products: warranty.products,
          status: warranty.status,
        },
      });
    } else {
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
    return NextResponse.json(
      { error: 'Failed to lookup warranty' },
      { status: 500 }
    );
  }
}
