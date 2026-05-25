import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { apiGet } from '../api/client';

type AuditLog = {
  id: number;
  user_id: number | null;
  event: string;
  auditable_type: string;
  auditable_id: number;
  ip_address: string | null;
  created_at: string;
};

type Paginated<T> = {
  data: T[];
  meta: { current_page: number; last_page: number; total: number };
};

export function AuditLogList() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<Paginated<AuditLog>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<Paginated<AuditLog>>(`/audit-logs?page=${p}`);
      setRows(res.data);
      setMeta(res.meta);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);

  const eventColor = (ev: string) => {
    if (ev.includes('created')) return 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400';
    if (ev.includes('updated')) return 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400';
    if (ev.includes('deleted')) return 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400';
    return 'bg-stone-100 dark:bg-stone-800 text-stone-500';
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Audit Logs</h1>
        <p className="text-sm text-stone-500 mt-0.5">Read-only history of all system changes.</p>
      </div>

      {loading && <div className="flex items-center gap-2 text-sm text-stone-500 p-6"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
      {error && <div className="flex items-center gap-2 text-sm text-red-600 p-4 rounded-lg bg-red-50 dark:bg-red-950/30"><AlertCircle className="w-4 h-4" /> {error}</div>}

      {!loading && !error && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 dark:bg-stone-950/50 text-stone-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Event</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Resource</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Resource ID</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">User ID</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">IP</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={6} className="text-center px-4 py-10 text-stone-400">No audit logs yet.</td></tr>}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-stone-100 dark:border-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-800/30">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${eventColor(row.event)}`}>{row.event}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-500">{row.auditable_type.split('\\').pop()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-500">#{row.auditable_id}</td>
                  <td className="px-4 py-3 text-stone-500">{row.user_id ?? '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-400">{row.ip_address ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-stone-400">{new Date(row.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-500">Page {meta.current_page} of {meta.last_page} · {meta.total} total</span>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 rounded-lg border border-stone-200 dark:border-stone-700 disabled:opacity-40">Prev</button>
            <button onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={page >= meta.last_page} className="px-3 py-1 rounded-lg border border-stone-200 dark:border-stone-700 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
