import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { apiGet, apiPost, apiPut } from '../api/client';

type Category = { id: number; name: string };

type MenuItemFormData = {
  category_id: number | string;
  name: string;
  description: string;
  price: number | string;
  image_path: string;
  is_available: boolean;
};

const EMPTY: MenuItemFormData = { category_id: '', name: '', description: '', price: '', image_path: '', is_available: true };

export function MenuItemForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState<MenuItemFormData>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await apiGet<{ data: Category[] }>('/categories?per_page=100');
        setCategories(catRes.data);
        if (isEdit) {
          const res = await apiGet<{ data: MenuItemFormData }>(`/menu-items/${id}`);
          setForm({ ...res.data, description: res.data.description ?? '', image_path: res.data.image_path ?? '' });
        }
      } catch (e) {
        setLoadError(String(e));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const set = <K extends keyof MenuItemFormData>(key: K, value: MenuItemFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const fieldError = (k: string) => errors[k]?.[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (isEdit) await apiPut(`/menu-items/${id}`, form);
      else await apiPost('/menu-items', form);
      nav('/menu-items');
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
      <button type="button" onClick={() => nav('/menu-items')} className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100">
        <ArrowLeft className="w-4 h-4" /> Back to menu items
      </button>
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{isEdit ? 'Edit' : 'New'} Menu Item</h1>

      <form onSubmit={submit} className="space-y-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm">
        {errors._form && <div className="text-sm text-red-600 p-3 rounded-lg bg-red-50 dark:bg-red-950/30">{errors._form[0]}</div>}

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Category</label>
          <select value={form.category_id} onChange={(e) => set('category_id', e.target.value)} required className={inputCls}>
            <option value="">Select a category…</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {fieldError('category_id') && <p className="text-xs text-red-600 mt-1">{fieldError('category_id')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Name</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} required className={inputCls} />
          {fieldError('name') && <p className="text-xs text-red-600 mt-1">{fieldError('name')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={inputCls} />
          {fieldError('description') && <p className="text-xs text-red-600 mt-1">{fieldError('description')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Price</label>
          <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} required min={0} step={0.01} className={inputCls} placeholder="0.00" />
          {fieldError('price') && <p className="text-xs text-red-600 mt-1">{fieldError('price')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Image Path</label>
          <input value={form.image_path} onChange={(e) => set('image_path', e.target.value)} className={inputCls} placeholder="e.g. images/latte.jpg" />
          {fieldError('image_path') && <p className="text-xs text-red-600 mt-1">{fieldError('image_path')}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_available" checked={form.is_available} onChange={(e) => set('is_available', e.target.checked)} className="rounded border-stone-300 text-primary" />
          <label htmlFor="is_available" className="text-sm text-stone-700 dark:text-stone-300">Available</label>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-amber-700 text-white disabled:opacity-50 text-sm font-medium transition-colors">
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create item'}
          </button>
          <button type="button" onClick={() => nav('/menu-items')} className="px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-sm text-stone-700 dark:text-stone-300">Cancel</button>
        </div>
      </form>
    </div>
  );
}
