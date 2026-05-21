import { NextResponse, NextRequest } from 'next/server';
import { hasAdminAccess } from '@/lib/security';
import { getRecentAudits, getAuditSummary, logAudit, getRequestActor, AuditOutcome, AuditSeverity } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!hasAdminAccess(request)) {
      await logAudit({
        action: 'admin_audits_forbidden',
        actor: getRequestActor(request.headers),
        outcome: 'forbidden',
        severity: 'warning',
        resource: '/api/admin/audits',
        details: {},
      });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const params = request.nextUrl.searchParams;
    const limit = Number(params.get('limit') || '100');
    const action = params.get('action') || undefined;
    const outcome = (params.get('outcome') as AuditOutcome | null) || undefined;
    const severity = (params.get('severity') as AuditSeverity | null) || undefined;
    const from = params.get('from') || undefined;
    const to = params.get('to') || undefined;

    const [audits, summary] = await Promise.all([
      getRecentAudits({ limit, action, outcome, severity, from, to }),
      getAuditSummary(),
    ]);

    await logAudit({
      action: 'admin_audits_viewed',
      actor: getRequestActor(request.headers),
      outcome: 'success',
      severity: 'info',
      resource: '/api/admin/audits',
      details: { count: audits.length },
    });

    return NextResponse.json({ audits, summary });
  } catch (err) {
    console.error('Failed to fetch audits', err);
    return NextResponse.json({ error: 'Failed to fetch audits' }, { status: 500 });
  }
}
