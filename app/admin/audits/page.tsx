'use client';

import { FormEvent, useMemo, useState } from 'react';

type AuditRow = {
  id: string | number;
  action: string;
  actor: string | null;
  outcome: 'success' | 'failure' | 'forbidden' | string;
  severity: 'info' | 'warning' | 'critical' | string;
  resource: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

type AuditSummary = {
  total: number;
  success: number;
  failure: number;
  forbidden: number;
  critical: number;
  warning: number;
  info: number;
  last24h: number;
};

type AuditResponse = {
  audits: AuditRow[];
  summary: AuditSummary;
};

const defaultSummary: AuditSummary = {
  total: 0,
  success: 0,
  failure: 0,
  forbidden: 0,
  critical: 0,
  warning: 0,
  info: 0,
  last24h: 0,
};

export default function AdminAuditsPage() {
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audits, setAudits] = useState<AuditRow[]>([]);
  const [summary, setSummary] = useState<AuditSummary>(defaultSummary);

  const [limit, setLimit] = useState('100');
  const [action, setAction] = useState('');
  const [outcome, setOutcome] = useState('');
  const [severity, setSeverity] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const summaryCards = useMemo(
    () => [
      { label: 'Total eventos', value: summary.total, className: 'bg-card' },
      { label: 'Ultimas 24h', value: summary.last24h, className: 'bg-card' },
      { label: 'Exitos', value: summary.success, className: 'bg-green-500/10 border-green-500/30' },
      { label: 'Fallos', value: summary.failure, className: 'bg-red-500/10 border-red-500/30' },
      { label: 'Forbidden', value: summary.forbidden, className: 'bg-orange-500/10 border-orange-500/30' },
      { label: 'Criticos', value: summary.critical, className: 'bg-red-600/10 border-red-600/30' },
    ],
    [summary]
  );

  async function fetchAudits(e?: FormEvent) {
    e?.preventDefault();

    if (!adminKey.trim()) {
      setError('Ingresa la ADMIN_API_KEY para consultar auditorias.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (limit) params.set('limit', limit);
      if (action) params.set('action', action);
      if (outcome) params.set('outcome', outcome);
      if (severity) params.set('severity', severity);
      if (from) params.set('from', from);
      if (to) params.set('to', to);

      const res = await fetch(`/api/admin/audits?${params.toString()}`, {
        headers: {
          'x-admin-key': adminKey.trim(),
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(body.error || `Request failed (${res.status})`);
      }

      const data = (await res.json()) as AuditResponse;
      setAudits(data.audits || []);
      setSummary(data.summary || defaultSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar auditorias');
    } finally {
      setLoading(false);
    }
  }

  function outcomeBadge(outcomeValue: string) {
    if (outcomeValue === 'success') return 'bg-green-500/15 text-green-700 border-green-500/30';
    if (outcomeValue === 'forbidden') return 'bg-orange-500/15 text-orange-700 border-orange-500/30';
    return 'bg-red-500/15 text-red-700 border-red-500/30';
  }

  function severityBadge(severityValue: string) {
    if (severityValue === 'critical') return 'bg-red-600/15 text-red-700 border-red-600/30';
    if (severityValue === 'warning') return 'bg-amber-500/15 text-amber-700 border-amber-500/30';
    return 'bg-blue-500/15 text-blue-700 border-blue-500/30';
  }

  return (
    <main className="container-custom py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Admin Audit Dashboard</h1>
        <p className="text-muted-foreground">
          Revisa eventos de seguridad, accesos admin y estado de operaciones del sistema.
        </p>
      </div>

      <form onSubmit={fetchAudits} className="mb-6 grid gap-4 rounded-xl border bg-card p-4 md:grid-cols-3">
        <div className="md:col-span-3">
          <label className="label" htmlFor="adminKey">ADMIN_API_KEY</label>
          <input
            id="adminKey"
            type="password"
            className="input-field"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Ingresa la clave admin para consultar auditorias"
          />
        </div>

        <div>
          <label className="label" htmlFor="limit">Limite</label>
          <input id="limit" className="input-field" value={limit} onChange={(e) => setLimit(e.target.value)} />
        </div>

        <div>
          <label className="label" htmlFor="action">Accion</label>
          <input id="action" className="input-field" value={action} onChange={(e) => setAction(e.target.value)} placeholder="warranty_created" />
        </div>

        <div>
          <label className="label" htmlFor="outcome">Outcome</label>
          <select id="outcome" className="input-field" value={outcome} onChange={(e) => setOutcome(e.target.value)}>
            <option value="">Todos</option>
            <option value="success">success</option>
            <option value="failure">failure</option>
            <option value="forbidden">forbidden</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="severity">Severidad</label>
          <select id="severity" className="input-field" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="">Todas</option>
            <option value="info">info</option>
            <option value="warning">warning</option>
            <option value="critical">critical</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="from">Desde (ISO)</label>
          <input id="from" className="input-field" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="2026-05-21T00:00:00Z" />
        </div>

        <div>
          <label className="label" htmlFor="to">Hasta (ISO)</label>
          <input id="to" className="input-field" value={to} onChange={(e) => setTo(e.target.value)} placeholder="2026-05-22T00:00:00Z" />
        </div>

        <div className="md:col-span-3 flex gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : 'Consultar auditorias'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setAction('');
              setOutcome('');
              setSeverity('');
              setFrom('');
              setTo('');
            }}
          >
            Limpiar filtros
          </button>
        </div>

        {error ? <p className="md:col-span-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700">{error}</p> : null}
      </form>

      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <article key={card.label} className={`rounded-lg border p-4 ${card.className}`}>
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-2xl font-bold">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-4 py-3 text-sm text-muted-foreground">
          Eventos recientes: {audits.length}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Accion</th>
                <th className="px-4 py-3 font-semibold">Outcome</th>
                <th className="px-4 py-3 font-semibold">Severidad</th>
                <th className="px-4 py-3 font-semibold">Actor</th>
                <th className="px-4 py-3 font-semibold">Recurso</th>
                <th className="px-4 py-3 font-semibold">Detalles</th>
              </tr>
            </thead>
            <tbody>
              {audits.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>
                    Sin eventos. Ejecuta acciones del sistema y vuelve a consultar.
                  </td>
                </tr>
              ) : (
                audits.map((row) => (
                  <tr key={String(row.id)} className="border-t">
                    <td className="px-4 py-3">{new Date(row.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium">{row.action}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-1 text-xs ${outcomeBadge(row.outcome || 'failure')}`}>{row.outcome || 'unknown'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-1 text-xs ${severityBadge(row.severity || 'info')}`}>{row.severity || 'info'}</span>
                    </td>
                    <td className="px-4 py-3">{row.actor || 'unknown'}</td>
                    <td className="px-4 py-3">{row.resource || '-'}</td>
                    <td className="px-4 py-3">
                      <pre className="max-w-[420px] overflow-auto whitespace-pre-wrap rounded bg-muted/40 p-2 text-xs">
                        {JSON.stringify(row.details || {}, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
