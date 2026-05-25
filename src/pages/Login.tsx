import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, LogIn, Coffee } from 'lucide-react';
import { useAuth } from '../auth/useAuth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/dashboard';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { user } = await login(email, password);
      nav(user?.role === 'admin' ? '/admin' : next, { replace: true });
    } catch (e: any) {
      setError(e?.body?.message || e?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-xl text-stone-900 dark:text-stone-100">Café POS</span>
        </div>

        <form
          onSubmit={submit}
          className="space-y-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-sm"
        >
          <div>
            <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Welcome back</h1>
            <p className="text-sm text-stone-500 mt-0.5">Sign in to your account.</p>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-amber-700 text-white disabled:opacity-50 text-sm font-medium transition-colors"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="text-sm text-stone-500 text-center">
            New here?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
