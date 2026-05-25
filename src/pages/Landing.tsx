import { Link } from 'react-router-dom';
import { Coffee, BarChart3, ShoppingCart, Table2, CheckCircle2 } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Coffee className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">Café POS</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-primary hover:bg-amber-700 text-white text-sm font-medium transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
          <Coffee className="w-3.5 h-3.5" />
          Modern POS for cafés
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-50 leading-tight mb-6">
          Run your café
          <br />
          <span className="text-primary">smoother, faster.</span>
        </h1>
        <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto mb-10">
          A complete point-of-sale system built for small cafés. Manage your menu, take orders, track tables, and generate daily reports — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="px-6 py-3 rounded-lg bg-primary hover:bg-amber-700 text-white font-medium transition-colors shadow-sm"
          >
            Start for free
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <ShoppingCart className="w-5 h-5 text-primary" />,
              title: 'Order Management',
              desc: 'Handle dine-in and takeaway orders with real-time status tracking from pending to completed.',
            },
            {
              icon: <Table2 className="w-5 h-5 text-primary" />,
              title: 'Table Tracking',
              desc: 'Monitor table availability, capacity and reservations at a glance on your POS dashboard.',
            },
            {
              icon: <BarChart3 className="w-5 h-5 text-primary" />,
              title: 'Daily Reports',
              desc: 'Automatically generate daily sales summaries with hourly breakdowns and top-selling items.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">{f.title}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-6 text-center">Everything you need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Menu & category management',
              'Dine-in & takeaway orders',
              'Real-time table status',
              'Role-based access (admin / cashier)',
              'CSV & PDF exports',
              'Audit log for all changes',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-6 text-center text-sm text-stone-400">
        © {new Date().getFullYear()} Café POS. Built with ☕.
      </footer>
    </div>
  );
}
