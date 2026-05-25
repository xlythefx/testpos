import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Clock } from 'lucide-react';
import { apiGet, apiDelete } from '../api/client';

type Order = {
  id: number;
  order_number: string;
  cafe_table_id: number | null;
  cashier_id: number;
  order_type: string;
  status: string;
  payment_method: string | null;
  subtotal: string;
  total: string;
  created_at: string;
};

type Paginated<T> = {
  data: T[];
  meta: { current_page: number; last_page: number; total: number };
};

const statusColor = (s: string) => ({
  pending: 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400',
  in_progress: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  completed: 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400',
  cancelled: 'bg-stone-100 dark:bg-stone-800 text-stone-500',
}[s] ?? 'bg-stone-100 text-stone-500');

export function OrderList() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Order[]>([]);
  const [meta, setMeta] = useState<Paginated<Order>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const load = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<Paginated<Order>>(`/orders?page=${p}`);
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
    if (!confirm('Delete this order?')) return;
    await apiDelete(`/orders/${id}`);
    load(page);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Orders</h1>
        <Link to="/orders/new" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-amber-700 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New order
        </Link>
      </div>

      {loading && <div className="flex items-center gap-2 text-sm text-stone-500 p-6"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
      {error && <div className="flex items-center gap-2 text-sm text-red-600 p-4 rounded-lg bg-red-50 dark:bg-red-950/30"><AlertCircle className="w-4 h-4" /> {error}</div>}

      {!loading && !error && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 dark:bg-stone-950/50 text-stone-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Order #</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Total</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Date</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={7} className="text-center px-4 py-10 text-stone-400">No orders yet.</td></tr>}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-stone-100 dark:border-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-800/30">
                  <td className="px-4 py-3 font-mono text-xs text-stone-600 dark:text-stone-400">{row.order_number}</td>
                  <td className="px-4 py-3 capitalize text-stone-700 dark:text-stone-300">{row.order_type.replace('_', ' ')}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(row.status)}`}>
                      <Clock className="w-3 h-3" />
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-stone-500">{row.payment_method?.replace('_', ' ') || '—'}</td>
                  <td className="px-4 py-3 font-medium text-stone-900 dark:text-stone-100">${Number(row.total).toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs text-stone-400">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => nav(`/orders/${row.id}`)} className="inline-flex items-center px-2 py-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400">
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
