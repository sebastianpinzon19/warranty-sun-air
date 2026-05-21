import { NextResponse, NextRequest } from 'next/server';

// Simple in-memory rate limiter. Per-process only — suitable as a first layer.
type Counter = { count: number; resetAt: number };
const counters = new Map<string, Counter>();

function now() {
  return Date.now();
}

async function checkLimit(key: string, limit: number, windowMs: number) {
  // If Upstash config present, use distributed counter
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const windowSec = Math.ceil(windowMs / 1000);
  if (upstashUrl && upstashToken) {
    try {
      // Increment and get value
      const incRes = await fetch(upstashUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${upstashToken}`,
        },
        body: JSON.stringify({ cmd: ['INCR', key] }),
      });
      const incJson = await incRes.json();
      const value = typeof incJson.result === 'number' ? incJson.result : Number(incJson.result);

      if (value === 1) {
        // newly created key — set expiry
        await fetch(upstashUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${upstashToken}`,
          },
          body: JSON.stringify({ cmd: ['EXPIRE', key, windowSec] }),
        });
      }

      if (value > limit) {
        // get TTL for Retry-After
        try {
          const ttlRes = await fetch(upstashUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${upstashToken}`,
            },
            body: JSON.stringify({ cmd: ['TTL', key] }),
          });
          const ttlJson = await ttlRes.json();
          const ttl = Number(ttlJson.result || ttlJson);
          return { limited: true, remaining: 0, retryAfter: ttl > 0 ? ttl : windowSec };
        } catch (e) {
          return { limited: true, remaining: 0, retryAfter: windowSec };
        }
      }

      return { limited: false, remaining: limit - value, retryAfter: windowSec };
    } catch (e: unknown) {
      // Fall through to in-memory
      const message = e instanceof Error ? e.message : String(e);
      console.error('Upstash rate limiter failed, falling back to in-memory', message);
    }
  }

  // In-memory fallback
  const entry = counters.get(key);
  const t = now();
  if (!entry || entry.resetAt <= t) {
    counters.set(key, { count: 1, resetAt: t + windowMs });
    return { limited: false, remaining: limit - 1, retryAfter: Math.ceil(windowMs / 1000) };
  }

  entry.count += 1;
  counters.set(key, entry);
  if (entry.count > limit) {
    return { limited: true, remaining: 0, retryAfter: Math.ceil((entry.resetAt - t) / 1000) };
  }
  return { limited: false, remaining: limit - entry.count, retryAfter: Math.ceil((entry.resetAt - t) / 1000) };
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Derive a client identifier. Prefer X-Forwarded-For, fall back to a header or 'unknown'.
  const xff = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const ip = String(xff).split(',')[0].trim();

  // Apply stricter limits for sensitive POST endpoints
  if (request.method === 'POST' && pathname.startsWith('/api/warranty')) {
    // Heavier throttling per IP for register & lookup endpoints
    const key = `${ip}:${pathname}`;
    const limit = pathname.includes('/register') || pathname.includes('/lookup') ? 10 : 60; // 10 req/hr for register/lookup, 60/hr for other warranty POSTs
    const windowMs = 60 * 60 * 1000; // 1 hour
    // checkLimit may be async when using Upstash
    // eslint-disable-next-line no-await-in-loop
    const res = await checkLimit(key, limit, windowMs);
    if (res.limited) {
      const body = JSON.stringify({ error: 'Too many requests' });
      const r = new NextResponse(body, { status: 429 });
      r.headers.set('Content-Type', 'application/json');
      r.headers.set('Retry-After', String(res.retryAfter));
      return r;
    }
  }

  // Global API rate limiting (per 10 minutes)
  if (pathname.startsWith('/api/')) {
    const key = `${ip}:global_api`;
    const { limited, remaining, retryAfter } = await checkLimit(key, 200, 10 * 60 * 1000);
    if (limited) {
      const body = JSON.stringify({ error: 'Too many requests' });
      const r = new NextResponse(body, { status: 429 });
      r.headers.set('Content-Type', 'application/json');
      r.headers.set('Retry-After', String(retryAfter));
      return r;
    }
  }

  // Security headers applied to all responses
  const response = NextResponse.next();
  // Content Security Policy — keep strict but allow inline styles for Tailwind where needed
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
  );
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Permissions-Policy', "geolocation=(), microphone=()");

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/register', '/lookup', '/success'],
};
