import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { apiGet, apiDelete } from '../api/client';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
};

type Paginated<T> = {
  data: T[];
  meta: { current_page: number; last_page: number; total: number };
};

export function UserList() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<User[]>([]);
  const [meta, setMeta] = useState<Paginated<User>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const load = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<Paginated<User>>(`/users?page=${p}`);
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
    if (!confirm('Delete this user?')) return;
    await apiDelete(`/users/${id}`);
    load(page);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Users</h1>
        <Link to="/users/new" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-amber-700 text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New user
        </Link>
      </div>

      {loading && <div className="flex items-center gap-2 text-sm text-stone-500 p-6"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>}
      {error && <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 p-4 rounded-lg bg-red-50 dark:bg-red-950/30"><AlertCircle className="w-4 h-4" /> {error}</div>}

      {!loading && !error && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 dark:bg-stone-950/50 text-stone-500 dark:text-stone-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Active</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider">Last Login</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} className="text-center px-4 py-10 text-stone-400">No users yet.</td></tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-stone-100 dark:border-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-800/30">
                  <td className="px-4 py-3 font-medium text-stone-900 dark:text-stone-100">{row.name}</td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">{row.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${row.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'}`}>
                      {row.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.is_active
                      ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                      : <XCircle className="w-4 h-4 text-stone-400" />}
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-400">{row.last_login_at ? new Date(row.last_login_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => nav(`/users/${row.id}`)} className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400" title="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(row.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" title="Delete">
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
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 rounded-lg border border-stone-200 dark:border-stone-700 disabled:opacity-40 hover:bg-stone-50 dark:hover:bg-stone-800">Prev</button>
            <button onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={page >= meta.last_page} className="px-3 py-1 rounded-lg border border-stone-200 dark:border-stone-700 disabled:opacity-40 hover:bg-stone-50 dark:hover:bg-stone-800">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
