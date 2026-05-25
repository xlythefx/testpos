import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { apiGet, apiPost, apiPut } from '../api/client';

type DailyReportFormData = {
  report_date: string;
  total_orders: number | string;
  total_revenue: number | string;
  total_items_sold: number | string;
  average_order_value: number | string;
  total_discounts: number | string;
};

const EMPTY: DailyReportFormData = {
  report_date: new Date().toISOString().split('T')[0],
  total_orders: 0, total_revenue: '0', total_items_sold: 0,
  average_order_value: '0', total_discounts: '0',
};

export function DailyReportForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const nav = useNavigate();
  const [form, setForm] = useState<DailyReportFormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    apiGet<{ data: DailyReportFormData }>(`/daily-reports/${id}`)
      .then((res) => setForm(res.data))
      .catch((e) => setLoadError(String(e)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = <K extends keyof DailyReportFormData>(key: K, value: DailyReportFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const fieldError = (k: string) => errors[k]?.[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (isEdit) await apiPut(`/daily-reports/${id}`, form);
      else await apiPost('/daily-reports', form);
      nav('/daily-reports');
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
      <button type="button" onClick={() => nav('/daily-reports')} className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100">
        <ArrowLeft className="w-4 h-4" /> Back to reports
      </button>
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{isEdit ? 'Edit' : 'New'} Daily Report</h1>

      <form onSubmit={submit} className="space-y-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm">
        {errors._form && <div className="text-sm text-red-600 p-3 rounded-lg bg-red-50 dark:bg-red-950/30">{errors._form[0]}</div>}

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Report Date</label>
          <input type="date" value={form.report_date} onChange={(e) => set('report_date', e.target.value)} required className={inputCls} />
          {fieldError('report_date') && <p className="text-xs text-red-600 mt-1">{fieldError('report_date')}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Total Orders</label>
            <input type="number" value={form.total_orders} onChange={(e) => set('total_orders', e.target.value)} min={0} className={inputCls} />
            {fieldError('total_orders') && <p className="text-xs text-red-600 mt-1">{fieldError('total_orders')}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Total Revenue</label>
            <input type="number" value={form.total_revenue} onChange={(e) => set('total_revenue', e.target.value)} min={0} step={0.01} className={inputCls} />
            {fieldError('total_revenue') && <p className="text-xs text-red-600 mt-1">{fieldError('total_revenue')}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Items Sold</label>
            <input type="number" value={form.total_items_sold} onChange={(e) => set('total_items_sold', e.target.value)} min={0} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Avg Order Value</label>
            <input type="number" value={form.average_order_value} onChange={(e) => set('average_order_value', e.target.value)} min={0} step={0.01} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Total Discounts</label>
            <input type="number" value={form.total_discounts} onChange={(e) => set('total_discounts', e.target.value)} min={0} step={0.01} className={inputCls} />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-amber-700 text-white disabled:opacity-50 text-sm font-medium transition-colors">
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create report'}
          </button>
          <button type="button" onClick={() => nav('/daily-reports')} className="px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-sm text-stone-700 dark:text-stone-300">Cancel</button>
        </div>
      </form>
    </div>
  );
}
