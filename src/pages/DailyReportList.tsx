import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { apiGet, apiDelete } from '../api/client';

type DailyReport = {
  id: number;
  report_date: string;
  total_orders: number;
  total_revenue: string;
  total_items_sold: number;
  average_order_value: string;
  total_discounts: string;
  generated_at: string | null;
};

type Paginated<T> = {
  data: T[];
  meta: { current_page: number; last_page: number; total: number };
};

export function DailyReportList() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<DailyReport[]>([]);
  const [meta, setMeta] = useState<Paginated<DailyReport>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const load = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<Paginated<DailyReport>>(`/daily-reports?page=${p}`);
      setRows(res.data);
      setMeta(res.meta);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);

  const remove = async (id: number) => {
    if (!confirm('Delete this report?')) return;
    await apiDelete(`/daily-reports/${id}`);
    load(page);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Daily Reports</h1>
        <Link to="/daily-reports/new" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-amber-700 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New report
        </Link>
      </div>

      {loading && <div className="flex items-center gap-2 text-sm text-stone-500 p-6"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
      {error && <div className="flex items-center gap-2 text-sm text-red-600 p-4 rounded-lg bg-red-50 dark:bg-red-950/30"><AlertCircle className="w-4 h-4" /> {error}</div>}

      {!loading && !error && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 dark:bg-stone-950/50 text-stone-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Date</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Orders</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Revenue</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Items Sold</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Avg Order</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Discounts</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={7} className="text-center px-4 py-10 text-stone-400">No reports yet.</td></tr>}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-stone-100 dark:border-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-800/30">
                  <td className="px-4 py-3 font-medium text-stone-900 dark:text-stone-100">{row.report_date}</td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">{row.total_orders}</td>
                  <td className="px-4 py-3 font-medium text-stone-900 dark:text-stone-100">${Number(row.total_revenue).toFixed(2)}</td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">{row.total_items_sold}</td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">${Number(row.average_order_value).toFixed(2)}</td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">${Number(row.total_discounts).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => nav(`/daily-reports/${row.id}`)} className="inline-flex items-center px-2 py-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(row.id)} className="inline-flex items-center px-2 py-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
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
