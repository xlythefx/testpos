import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { AppShell } from './components/AppShell';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';

import { UserList } from './pages/UserList';
import { UserForm } from './pages/UserForm';
import { CategoryList } from './pages/CategoryList';
import { CategoryForm } from './pages/CategoryForm';
import { MenuItemList } from './pages/MenuItemList';
import { MenuItemForm } from './pages/MenuItemForm';
import { CafeTableList } from './pages/CafeTableList';
import { CafeTableForm } from './pages/CafeTableForm';
import { OrderList } from './pages/OrderList';
import { OrderForm } from './pages/OrderForm';
import { OrderItemList } from './pages/OrderItemList';
import { OrderItemForm } from './pages/OrderItemForm';
import { DailyReportList } from './pages/DailyReportList';
import { DailyReportForm } from './pages/DailyReportForm';
import { AuditLogList } from './pages/AuditLogList';

function DarkModeInit() {
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // default to dark
      document.documentElement.classList.add('dark');
    }
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <DarkModeInit />
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected (all authenticated users) */}
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/new" element={<OrderForm />} />
            <Route path="/orders/:id" element={<OrderForm />} />
            <Route path="/menu-items" element={<MenuItemList />} />
            <Route path="/menu-items/new" element={<MenuItemForm />} />
            <Route path="/menu-items/:id" element={<MenuItemForm />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/new" element={<CategoryForm />} />
            <Route path="/categories/:id" element={<CategoryForm />} />
            <Route path="/cafe-tables" element={<CafeTableList />} />
            <Route path="/cafe-tables/new" element={<CafeTableForm />} />
            <Route path="/cafe-tables/:id" element={<CafeTableForm />} />
          </Route>

          {/* Admin-only */}
          <Route
            element={
              <AdminRoute>
                <AppShell />
              </AdminRoute>
            }
          >
            <Route path="/admin" element={<Admin />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/:id" element={<UserForm />} />
            <Route path="/order-items" element={<OrderItemList />} />
            <Route path="/order-items/new" element={<OrderItemForm />} />
            <Route path="/order-items/:id" element={<OrderItemForm />} />
            <Route path="/daily-reports" element={<DailyReportList />} />
            <Route path="/daily-reports/new" element={<DailyReportForm />} />
            <Route path="/daily-reports/:id" element={<DailyReportForm />} />
            <Route path="/audit-logs" element={<AuditLogList />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
