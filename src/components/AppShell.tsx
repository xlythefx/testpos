import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Coffee,
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Table2,
  Users,
  BarChart3,
  ClipboardList,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Orders', to: '/orders', icon: <ShoppingCart className="w-4 h-4" /> },
  { label: 'Menu Items', to: '/menu-items', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { label: 'Categories', to: '/categories', icon: <Coffee className="w-4 h-4" /> },
  { label: 'Tables', to: '/cafe-tables', icon: <Table2 className="w-4 h-4" /> },
  { label: 'Order Items', to: '/order-items', icon: <ClipboardList className="w-4 h-4" />, adminOnly: true },
  { label: 'Users', to: '/users', icon: <Users className="w-4 h-4" />, adminOnly: true },
  { label: 'Daily Reports', to: '/daily-reports', icon: <BarChart3 className="w-4 h-4" />, adminOnly: true },
  { label: 'Audit Logs', to: '/audit-logs', icon: <FileText className="w-4 h-4" />, adminOnly: true },
];

function useDarkMode() {
  const stored = localStorage.getItem('theme');
  const [dark, setDark] = useState(() => {
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return true; // default dark
  });

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  return { dark, toggle };
}

export function AppShell() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dark, toggle } = useDarkMode();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || user?.role === 'admin',
  );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100',
    ].join(' ');

  const sidebar = (
    <aside className="flex flex-col h-full w-60 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-stone-200 dark:border-stone-800">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Coffee className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">Café POS</span>
        <button
          className="ml-auto lg:hidden p-1 rounded text-stone-500 hover:text-stone-900 dark:hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {visibleItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/dashboard'}>
            {item.icon}
            {item.label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <>
            <div className="pt-4 pb-1 px-3">
              <span className="text-xs font-medium text-stone-400 dark:text-stone-600 uppercase tracking-wider">Admin</span>
            </div>
            <NavLink to="/admin" className={linkClass}>
              <ChevronRight className="w-4 h-4" />
              Admin Panel
            </NavLink>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-stone-200 dark:border-stone-800 space-y-1">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">{user?.name}</p>
            <p className="text-xs text-stone-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-1">
          <button
            onClick={toggle}
            className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {dark ? 'Light mode' : 'Dark mode'}
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-stone-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 w-60">
        {sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-60 z-50">{sidebar}</div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800">
            <Menu className="w-5 h-5 text-stone-600 dark:text-stone-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Coffee className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">Café POS</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
