import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { apiGet, apiPost, apiPut } from '../api/client';

type OrderItemFormData = {
  order_id: number | string;
  menu_item_id: number | string;
  quantity: number | string;
  unit_price: number | string;
  subtotal: number | string;
  notes: string;
};

const EMPTY: OrderItemFormData = { order_id: '', menu_item_id: '', quantity: '', unit_price: '', subtotal: '', notes: '' };

export function OrderItemForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState<OrderItemFormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    apiGet<{ data: OrderItemFormData }>(`/order-items/${id}`)
      .then((res) => setForm({ ...res.data, notes: res.data.notes ?? '' }))
      .catch((e) => setLoadError(String(e)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = <K extends keyof OrderItemFormData>(key: K, value: OrderItemFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const fieldError = (k: string) => errors[k]?.[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (isEdit) await apiPut(`/order-items/${id}`, form);
      else await apiPost('/order-items', form);
      nav('/order-items');
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
      <button type="button" onClick={() => nav('/order-items')} className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100">
        <ArrowLeft className="w-4 h-4" /> Back to order items
      </button>
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{isEdit ? 'Edit' : 'New'} Order Item</h1>

      <form onSubmit={submit} className="space-y-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm">
        {errors._form && <div className="text-sm text-red-600 p-3 rounded-lg bg-red-50 dark:bg-red-950/30">{errors._form[0]}</div>}

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Order ID</label>
          <input type="number" value={form.order_id} onChange={(e) => set('order_id', e.target.value)} required min={1} className={inputCls} placeholder="Enter order ID" />
          {fieldError('order_id') && <p className="text-xs text-red-600 mt-1">{fieldError('order_id')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Menu Item ID</label>
          <input type="number" value={form.menu_item_id} onChange={(e) => set('menu_item_id', e.target.value)} required min={1} className={inputCls} placeholder="Enter menu item ID" />
          {fieldError('menu_item_id') && <p className="text-xs text-red-600 mt-1">{fieldError('menu_item_id')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Quantity</label>
          <input type="number" value={form.quantity} onChange={(e) => set('quantity', e.target.value)} required min={1} className={inputCls} />
          {fieldError('quantity') && <p className="text-xs text-red-600 mt-1">{fieldError('quantity')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Unit Price</label>
          <input type="number" value={form.unit_price} onChange={(e) => set('unit_price', e.target.value)} required min={0} step={0.01} className={inputCls} placeholder="0.00" />
          {fieldError('unit_price') && <p className="text-xs text-red-600 mt-1">{fieldError('unit_price')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Subtotal</label>
          <input type="number" value={form.subtotal} onChange={(e) => set('subtotal', e.target.value)} required min={0} step={0.01} className={inputCls} placeholder="0.00" />
          {fieldError('subtotal') && <p className="text-xs text-red-600 mt-1">{fieldError('subtotal')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Notes</label>
          <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} className={inputCls} placeholder="e.g. no sugar, extra hot…" />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-amber-700 text-white disabled:opacity-50 text-sm font-medium transition-colors">
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create item'}
          </button>
          <button type="button" onClick={() => nav('/order-items')} className="px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-sm text-stone-700 dark:text-stone-300">Cancel</button>
        </div>
      </form>
    </div>
  );
}
