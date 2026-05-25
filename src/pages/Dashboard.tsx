import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Coffee, Table2, TrendingUp, Plus, Clock, CheckCircle2 } from 'lucide-react';
import { apiGet } from '../api/client';
import { useAuth } from '../auth/useAuth';

type OrderSummary = {
  data: Array<{
    id: number;
    order_number: string;
    status: string;
    order_type: string;
    total: string;
    created_at: string;
  }>;
  meta: { total: number };
};

export function Dashboard() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<OrderSummary['data']>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<OrderSummary>('/orders?page=1&per_page=5')
      .then((res) => {
        setRecentOrders(res.data);
        setTotalOrders(res.meta?.total ?? res.data.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400',
      in_progress: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
      completed: 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400',
      cancelled: 'bg-stone-100 dark:bg-stone-800 text-stone-500',
    };
    return map[status] ?? 'bg-stone-100 text-stone-500';
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Good day, {user?.name?.split(' ')[0]} ☕
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">Here's what's happening at the café.</p>
        </div>
        <Link
          to="/orders/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-amber-700 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New order
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Orders", value: loading ? '…' : String(totalOrders), icon: <ShoppingCart className="w-5 h-5" />, color: 'text-primary' },
          { label: 'Menu Items', value: '—', icon: <Coffee className="w-5 h-5" />, color: 'text-amber-500', link: '/menu-items' },
          { label: 'Tables', value: '—', icon: <Table2 className="w-5 h-5" />, color: 'text-stone-500', link: '/cafe-tables' },
          { label: 'Revenue', value: '—', icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-600', link: '/daily-reports' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm"
          >
            <div className={`${kpi.color} mb-3`}>{kpi.icon}</div>
            <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">{kpi.value}</div>
            <div className="text-xs text-stone-500 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'New Order', to: '/orders/new', icon: <Plus className="w-4 h-4" /> },
          { label: 'View Orders', to: '/orders', icon: <ShoppingCart className="w-4 h-4" /> },
          { label: 'Menu', to: '/menu-items', icon: <Coffee className="w-4 h-4" /> },
          { label: 'Tables', to: '/cafe-tables', icon: <Table2 className="w-4 h-4" /> },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm font-medium text-stone-700 dark:text-stone-300 hover:border-primary/50 hover:text-primary transition-colors shadow-sm"
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-800">
          <h2 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">Recent Orders</h2>
          <Link to="/orders" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-stone-400">Loading…</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center text-sm text-stone-400">No orders yet. Create the first one!</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-stone-50 dark:bg-stone-950/50">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-stone-500 uppercase tracking-wider">Order #</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-stone-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-stone-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-stone-100 dark:border-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-800/30">
                  <td className="px-4 py-2.5 font-mono text-xs text-stone-600 dark:text-stone-400">{order.order_number}</td>
                  <td className="px-4 py-2.5 capitalize text-stone-700 dark:text-stone-300">{order.order_type.replace('_', ' ')}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(order.status)}`}>
                      {order.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-stone-900 dark:text-stone-100">
                    ${Number(order.total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
