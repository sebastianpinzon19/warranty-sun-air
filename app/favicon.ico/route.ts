import { NextResponse } from 'next/server';

export async function GET() {
  // Redirect requests for /favicon.ico to the prepared favicon in /favicon_io
  return NextResponse.redirect('/favicon_io/favicon.ico', 302);
}
