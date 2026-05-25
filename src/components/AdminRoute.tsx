import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Loader2 } from 'lucide-react';
import { type ReactNode } from 'react';

export function AdminRoute({ children }: { children: ReactNode }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
