import type { NextRequest } from 'next/server';

export function hasAdminAccess(request: NextRequest): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return false;
  }

  const providedKey = request.headers.get('x-admin-key');
  return providedKey === adminKey;
}
