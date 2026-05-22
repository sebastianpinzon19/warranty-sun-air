import { NextResponse, NextRequest } from 'next/server';
import { hasAdminAccess } from '@/lib/security';
import { getPaginatedAudits, getAuditSummary, logAudit, getRequestActor, AuditOutcome, AuditSeverity } from '@/lib/audit';

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
    const page = Math.max(Number(params.get('page') || '1'), 1);
    const pageSize = Math.min(Math.max(Number(params.get('pageSize') || params.get('limit') || '100'), 1), 500);
    const action = params.get('action') || undefined;
    const outcome = (params.get('outcome') as AuditOutcome | null) || undefined;
    const severity = (params.get('severity') as AuditSeverity | null) || undefined;
    const from = params.get('from') || undefined;
    const to = params.get('to') || undefined;
    const sortBy = params.get('sortBy') || 'created_at';
    const sortOrder = (params.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const [paged, summary] = await Promise.all([
      getPaginatedAudits({ page, pageSize, action, outcome, severity, from, to, sortBy, sortOrder }),
      getAuditSummary(),
    ]);

    const audits = paged.rows || [];
    const total = paged.total || 0;
    const totalPages = Math.max(Math.ceil(total / pageSize), 1);

    await logAudit({
      action: 'admin_audits_viewed',
      actor: getRequestActor(request.headers),
      outcome: 'success',
      severity: 'info',
      resource: '/api/admin/audits',
      details: { count: audits.length, page, pageSize, total, totalPages, sortBy, sortOrder },
    });

    return NextResponse.json({ audits, summary, pagination: { total, page, pageSize, totalPages } });
  } catch (err) {
    console.error('Failed to fetch audits', err);
    return NextResponse.json({ error: 'Failed to fetch audits' }, { status: 500 });
  }
}
