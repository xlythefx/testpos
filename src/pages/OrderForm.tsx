import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { apiGet, apiPost, apiPut } from '../api/client';
import { useAuth } from '../auth/useAuth';

type CafeTable = { id: number; name: string };

type OrderFormData = {
  cafe_table_id: number | string;
  cashier_id: number | string;
  order_type: 'dine_in' | 'takeaway';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  payment_method: string;
  subtotal: number | string;
  tax_rate: number | string;
  tax_amount: number | string;
  discount: number | string;
  total: number | string;
  notes: string;
};

const EMPTY: OrderFormData = {
  cafe_table_id: '', cashier_id: '', order_type: 'dine_in', status: 'pending',
  payment_method: '', subtotal: '0', tax_rate: '10', tax_amount: '0', discount: '0', total: '0', notes: '',
};

export function OrderForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const nav = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState<OrderFormData>({ ...EMPTY, cashier_id: user?.id ?? '' });
  const [tables, setTables] = useState<CafeTable[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const tbl = await apiGet<{ data: CafeTable[] }>('/cafe-tables?per_page=100');
        setTables(tbl.data);
        if (isEdit) {
          const res = await apiGet<{ data: OrderFormData }>(`/orders/${id}`);
          setForm({ ...res.data, payment_method: res.data.payment_method ?? '', notes: res.data.notes ?? '', cafe_table_id: res.data.cafe_table_id ?? '' });
        }
      } catch (e) {
        setLoadError(String(e));
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isEdit]);

  const set = <K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const fieldError = (k: string) => errors[k]?.[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (isEdit) await apiPut(`/orders/${id}`, form);
      else await apiPost('/orders', form);
      nav('/orders');
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
      <button type="button" onClick={() => nav('/orders')} className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100">
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </button>
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{isEdit ? 'Edit' : 'New'} Order</h1>

      <form onSubmit={submit} className="space-y-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm">
        {errors._form && <div className="text-sm text-red-600 p-3 rounded-lg bg-red-50 dark:bg-red-950/30">{errors._form[0]}</div>}

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Order Type</label>
          <select value={form.order_type} onChange={(e) => set('order_type', e.target.value as OrderFormData['order_type'])} className={inputCls}>
            <option value="dine_in">Dine In</option>
            <option value="takeaway">Takeaway</option>
          </select>
          {fieldError('order_type') && <p className="text-xs text-red-600 mt-1">{fieldError('order_type')}</p>}
        </div>

        {form.order_type === 'dine_in' && (
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Table (optional)</label>
            <select value={form.cafe_table_id} onChange={(e) => set('cafe_table_id', e.target.value)} className={inputCls}>
              <option value="">No table / select later</option>
              {tables.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            {fieldError('cafe_table_id') && <p className="text-xs text-red-600 mt-1">{fieldError('cafe_table_id')}</p>}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Status</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value as OrderFormData['status'])} className={inputCls}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {fieldError('status') && <p className="text-xs text-red-600 mt-1">{fieldError('status')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Payment Method</label>
          <select value={form.payment_method} onChange={(e) => set('payment_method', e.target.value)} className={inputCls}>
            <option value="">Not paid yet</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="e_wallet">E-Wallet</option>
          </select>
          {fieldError('payment_method') && <p className="text-xs text-red-600 mt-1">{fieldError('payment_method')}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Subtotal</label>
            <input type="number" value={form.subtotal} onChange={(e) => set('subtotal', e.target.value)} min={0} step={0.01} className={inputCls} />
            {fieldError('subtotal') && <p className="text-xs text-red-600 mt-1">{fieldError('subtotal')}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Tax Rate (%)</label>
            <input type="number" value={form.tax_rate} onChange={(e) => set('tax_rate', e.target.value)} min={0} step={0.01} className={inputCls} />
            {fieldError('tax_rate') && <p className="text-xs text-red-600 mt-1">{fieldError('tax_rate')}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Tax Amount</label>
            <input type="number" value={form.tax_amount} onChange={(e) => set('tax_amount', e.target.value)} min={0} step={0.01} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Discount</label>
            <input type="number" value={form.discount} onChange={(e) => set('discount', e.target.value)} min={0} step={0.01} className={inputCls} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Total</label>
          <input type="number" value={form.total} onChange={(e) => set('total', e.target.value)} min={0} step={0.01} className={inputCls} />
          {fieldError('total') && <p className="text-xs text-red-600 mt-1">{fieldError('total')}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Notes</label>
          <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} className={inputCls} placeholder="Any special instructions…" />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-amber-700 text-white disabled:opacity-50 text-sm font-medium transition-colors">
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create order'}
          </button>
          <button type="button" onClick={() => nav('/orders')} className="px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-sm text-stone-700 dark:text-stone-300">Cancel</button>
        </div>
      </form>
    </div>
  );
}
