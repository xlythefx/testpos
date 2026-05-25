import { Link } from 'react-router-dom';
import {
  Users,
  Coffee,
  UtensilsCrossed,
  Table2,
  ShoppingCart,
  ClipboardList,
  BarChart3,
  FileText,
  ChevronRight,
} from 'lucide-react';

const SECTIONS = [
  {
    label: 'Staff',
    items: [
      { label: 'Users', desc: 'Manage staff accounts and roles', to: '/users', icon: <Users className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Menu',
    items: [
      { label: 'Categories', desc: 'Organise menu sections', to: '/categories', icon: <Coffee className="w-5 h-5" /> },
      { label: 'Menu Items', desc: 'Add, edit and price menu items', to: '/menu-items', icon: <UtensilsCrossed className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Café Tables', desc: 'Configure tables and capacity', to: '/cafe-tables', icon: <Table2 className="w-5 h-5" /> },
      { label: 'Orders', desc: 'View and manage all orders', to: '/orders', icon: <ShoppingCart className="w-5 h-5" /> },
      { label: 'Order Items', desc: 'Inspect individual order line items', to: '/order-items', icon: <ClipboardList className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Reports',
    items: [
      { label: 'Daily Reports', desc: 'Sales summaries and breakdowns', to: '/daily-reports', icon: <BarChart3 className="w-5 h-5" /> },
      { label: 'Audit Logs', desc: 'Track all system changes', to: '/audit-logs', icon: <FileText className="w-5 h-5" /> },
    ],
  },
];

export function Admin() {
  return (
    <div className="p-6 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Admin Panel</h1>
        <p className="text-sm text-stone-500 mt-1">Manage all aspects of the Café POS system.</p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.label}>
          <h2 className="text-xs font-semibold text-stone-400 dark:text-stone-600 uppercase tracking-wider mb-3">
            {section.label}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {section.items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-start gap-3 p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-primary/50 hover:shadow-sm transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-stone-900 dark:text-stone-100 text-sm">{item.label}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{item.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
