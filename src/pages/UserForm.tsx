import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { apiGet, apiPost, apiPut } from '../api/client';

type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'cashier';
  is_active: boolean;
};

const EMPTY: UserFormData = { name: '', email: '', password: '', role: 'cashier', is_active: true };

export function UserForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState<UserFormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    apiGet<{ data: UserFormData }>(`/users/${id}`)
      .then((res) => setForm({ ...res.data, password: '' }))
      .catch((e) => setLoadError(String(e)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = <K extends keyof UserFormData>(key: K, value: UserFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const fieldError = (k: string) => errors[k]?.[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload: Partial<UserFormData> = { ...form };
      if (isEdit && !payload.password) delete payload.password;
      if (isEdit) await apiPut(`/users/${id}`, payload);
      else await apiPost('/users', payload);
      nav('/users');
    } catch (e: any) {
      if (e?.status === 422 && e?.body?.errors) setErrors(e.body.errors);
      else setErrors({ _form: [String(e?.message ?? e)] });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30';

  if (loading) return <div className="p-6 flex items-center gap-2 text-sm text-stone-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>;
  if (loadError) return <div className="p-6 flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" /> {loadError}</div>;

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <button type="button" onClick={() => nav('/users')} className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100">
        <ArrowLeft className="w-4 h-4" /> Back to users
      </button>
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{isEdit ? 'Edit' : 'New'} User</h1>

      <form onSubmit={submit} className="space-y-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm">
        {errors._form && <div className="text-sm text-red-600 dark:text-red-400 p-3 rounded-lg bg-red-50 dark:bg-red-950/30">{errors._form[0]}</div>}

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Name</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} required className={inputCls} />
          {fieldError('name') && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldError('name')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required className={inputCls} />
          {fieldError('email') && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldError('email')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
            Password {isEdit && <span className="text-stone-400 font-normal">(leave blank to keep current)</span>}
          </label>
          <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required={!isEdit} minLength={8} className={inputCls} placeholder={isEdit ? 'Leave blank to keep current' : 'Min. 8 characters'} />
          {fieldError('password') && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldError('password')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Role</label>
          <select value={form.role} onChange={(e) => set('role', e.target.value as 'admin' | 'cashier')} className={inputCls}>
            <option value="cashier">Cashier</option>
            <option value="admin">Admin</option>
          </select>
          {fieldError('role') && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fieldError('role')}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} className="rounded border-stone-300 dark:border-stone-700 text-primary" />
          <label htmlFor="is_active" className="text-sm text-stone-700 dark:text-stone-300">Active</label>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-amber-700 text-white disabled:opacity-50 text-sm font-medium transition-colors">
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create user'}
          </button>
          <button type="button" onClick={() => nav('/users')} className="px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-sm text-stone-700 dark:text-stone-300">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
