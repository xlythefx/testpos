import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { apiGet, apiDelete } from '../api/client';

type OrderItem = {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
  notes: string | null;
  created_at: string;
};

type Paginated<T> = {
  data: T[];
  meta: { current_page: number; last_page: number; total: number };
};

export function OrderItemList() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<OrderItem[]>([]);
  const [meta, setMeta] = useState<Paginated<OrderItem>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const load = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<Paginated<OrderItem>>(`/order-items?page=${p}`);
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
    if (!confirm('Delete this order item?')) return;
    await apiDelete(`/order-items/${id}`);
    load(page);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Order Items</h1>
        <Link to="/order-items/new" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-amber-700 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New item
        </Link>
      </div>

      {loading && <div className="flex items-center gap-2 text-sm text-stone-500 p-6"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
      {error && <div className="flex items-center gap-2 text-sm text-red-600 p-4 rounded-lg bg-red-50 dark:bg-red-950/30"><AlertCircle className="w-4 h-4" /> {error}</div>}

      {!loading && !error && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 dark:bg-stone-950/50 text-stone-500">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Order ID</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Menu Item ID</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Qty</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Unit Price</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Subtotal</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Notes</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={7} className="text-center px-4 py-10 text-stone-400">No order items yet.</td></tr>}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-stone-100 dark:border-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-800/30">
                  <td className="px-4 py-3 font-mono text-xs text-stone-500">#{row.order_id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-500">#{row.menu_item_id}</td>
                  <td className="px-4 py-3 text-stone-700 dark:text-stone-300">{row.quantity}</td>
                  <td className="px-4 py-3 text-stone-700 dark:text-stone-300">${Number(row.unit_price).toFixed(2)}</td>
                  <td className="px-4 py-3 font-medium text-stone-900 dark:text-stone-100">${Number(row.subtotal).toFixed(2)}</td>
                  <td className="px-4 py-3 text-stone-500 max-w-xs truncate">{row.notes || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => nav(`/order-items/${row.id}`)} className="inline-flex items-center px-2 py-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400">
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
