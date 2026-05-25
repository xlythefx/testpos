import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiPost, apiGet } from '../api/client';

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
  is_active: boolean;
  last_login_at: string | null;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<{ user: User }>;
  register: (name: string, email: string, password: string) => Promise<{ user: User }>;
  logout: () => Promise<void>;
  me: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    loading: !!localStorage.getItem('token'),
  });

  useEffect(() => {
    if (state.token && !state.user) {
      apiGet<{ data: User }>('/me')
        .then((res) => setState((s) => ({ ...s, user: res.data, loading: false })))
        .catch(() => {
          localStorage.removeItem('token');
          setState({ user: null, token: null, loading: false });
        });
    } else {
      setState((s) => ({ ...s, loading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiPost<{ token: string; user: User }>('/login', { email, password });
    localStorage.setItem('token', res.token);
    setState({ user: res.user, token: res.token, loading: false });
    return { user: res.user };
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await apiPost<{ token: string; user: User }>('/register', { name, email, password });
    localStorage.setItem('token', res.token);
    setState({ user: res.user, token: res.token, loading: false });
    return { user: res.user };
  };

  const logout = async () => {
    try { await apiPost('/logout'); } catch { /* best-effort */ }
    localStorage.removeItem('token');
    setState({ user: null, token: null, loading: false });
    window.location.href = '/login';
  };

  const me = async () => {
    const res = await apiGet<{ data: User }>('/me');
    setState((s) => ({ ...s, user: res.data }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, me }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
