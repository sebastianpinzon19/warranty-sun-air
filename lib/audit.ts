import { getDbPool } from './database';

export type AuditOutcome = 'success' | 'failure' | 'forbidden';
export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditFilters {
  limit?: number;
  action?: string;
  outcome?: AuditOutcome;
  severity?: AuditSeverity;
  from?: string;
  to?: string;
  // Pagination and sorting
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuditLogInput {
  action: string;
  actor?: string | null;
  outcome?: AuditOutcome;
  severity?: AuditSeverity;
  resource?: string | null;
  details?: Record<string, unknown>;
}

export async function ensureAuditTable() {
  const pool = getDbPool();
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS audits (
      id BIGSERIAL PRIMARY KEY,
      action TEXT NOT NULL,
      actor TEXT,
      outcome TEXT,
      severity TEXT,
      resource TEXT,
      details JSONB,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  // Keep schema compatible across deployments where table already exists.
  await pool.query(`ALTER TABLE audits ADD COLUMN IF NOT EXISTS outcome TEXT;`);
  await pool.query(`ALTER TABLE audits ADD COLUMN IF NOT EXISTS severity TEXT;`);
  await pool.query(`ALTER TABLE audits ADD COLUMN IF NOT EXISTS resource TEXT;`);
}

export function getRequestActor(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const actor = xff || realIp || 'unknown';
  return String(actor).split(',')[0].trim();
}

export async function logAudit(input: AuditLogInput) {
  const pool = getDbPool();
  const action = input.action;
  const actor = input.actor || null;
  const outcome = input.outcome || 'success';
  const severity = input.severity || 'info';
  const resource = input.resource || null;
  const details = input.details || {};

  if (!pool) {
    // No DB: best-effort to console for dev
    try {
      console.info('[AUDIT]', { action, actor, outcome, severity, resource, details });
    } catch (e) {}
    return;
  }

  await ensureAuditTable();
  try {
    await pool.query(
      `INSERT INTO audits (action, actor, outcome, severity, resource, details) VALUES ($1,$2,$3,$4,$5,$6)`,
      [action, actor, outcome, severity, resource, JSON.stringify(details)]
    );
  } catch (e) {
    console.error('Failed to write audit log', e);
  }
}

export async function getRecentAudits(filters: AuditFilters = {}) {
  const pool = getDbPool();
  if (!pool) return [];
  await ensureAuditTable();

  const limit = Math.min(Math.max(Number(filters.limit || 100), 1), 500);
  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.action) {
    params.push(filters.action);
    where.push(`action = $${params.length}`);
  }

  if (filters.outcome) {
    params.push(filters.outcome);
    where.push(`outcome = $${params.length}`);
  }

  if (filters.severity) {
    params.push(filters.severity);
    where.push(`severity = $${params.length}`);
  }

  if (filters.from) {
    params.push(filters.from);
    where.push(`created_at >= $${params.length}::timestamp`);
  }

  if (filters.to) {
    params.push(filters.to);
    where.push(`created_at <= $${params.length}::timestamp`);
  }

  params.push(limit);
  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
  const query = `SELECT * FROM audits ${whereClause} ORDER BY created_at DESC LIMIT $${params.length}`;
  const res = await pool.query(query, params as any[]);
  return res.rows;
}

export async function getPaginatedAudits(filters: AuditFilters = {}) {
  const pool = getDbPool();
  if (!pool) return { rows: [], total: 0 };
  await ensureAuditTable();

  const page = Math.max(Number(filters.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(filters.pageSize || 100), 1), 500);
  const offset = (page - 1) * pageSize;

  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.action) {
    params.push(filters.action);
    where.push(`action = $${params.length}`);
  }

  if (filters.outcome) {
    params.push(filters.outcome);
    where.push(`outcome = $${params.length}`);
  }

  if (filters.severity) {
    params.push(filters.severity);
    where.push(`severity = $${params.length}`);
  }

  if (filters.from) {
    params.push(filters.from);
    where.push(`created_at >= $${params.length}::timestamp`);
  }

  if (filters.to) {
    params.push(filters.to);
    where.push(`created_at <= $${params.length}::timestamp`);
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  // Safe sort column whitelist to avoid SQL injection
  const allowedSort: Record<string, string> = {
    created_at: 'created_at',
    action: 'action',
    severity: 'severity',
    outcome: 'outcome',
  };

  const sortBy = allowedSort[filters.sortBy || 'created_at'] || 'created_at';
  const sortOrder = (filters.sortOrder === 'asc' ? 'ASC' : 'DESC');

  // Count total
  const countQuery = `SELECT COUNT(*)::int AS total FROM audits ${whereClause}`;
  const countRes = await pool.query(countQuery, params as any[]);
  const total = (countRes.rows[0]?.total as number) || 0;

  // Add pagination params
  params.push(pageSize);
  params.push(offset);

  const query = `SELECT * FROM audits ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT $${params.length - 1} OFFSET $${params.length}`;
  const res = await pool.query(query, params as any[]);

  return { rows: res.rows, total };
}

export async function getAuditSummary() {
  const pool = getDbPool();
  if (!pool) {
    return {
      total: 0,
      success: 0,
      failure: 0,
      forbidden: 0,
      critical: 0,
      warning: 0,
      info: 0,
      last24h: 0,
    };
  }

  await ensureAuditTable();
  const res = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE outcome = 'success')::int AS success,
      COUNT(*) FILTER (WHERE outcome = 'failure')::int AS failure,
      COUNT(*) FILTER (WHERE outcome = 'forbidden')::int AS forbidden,
      COUNT(*) FILTER (WHERE severity = 'critical')::int AS critical,
      COUNT(*) FILTER (WHERE severity = 'warning')::int AS warning,
      COUNT(*) FILTER (WHERE severity = 'info')::int AS info,
      COUNT(*) FILTER (WHERE created_at >= now() - interval '24 hours')::int AS last24h
    FROM audits;
  `);

  return res.rows[0] || {
    total: 0,
    success: 0,
    failure: 0,
    forbidden: 0,
    critical: 0,
    warning: 0,
    info: 0,
    last24h: 0,
  };
}
