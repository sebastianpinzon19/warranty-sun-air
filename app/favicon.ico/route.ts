import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Use an absolute URL based on the incoming request to avoid prerender errors
  const target = new URL('/favicon_io/favicon.ico', request.url);
  return NextResponse.redirect(target.toString(), 302);
}
