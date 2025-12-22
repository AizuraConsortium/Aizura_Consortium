import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary, ToastProvider } from '@shared/components';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { ProtectedRoute } from '@shared/components';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { ErrorMonitor } from './pages/ErrorMonitor';
import RateLimitMonitor from './pages/RateLimitMonitor';

export default function App() {
  return (
    <ErrorBoundary theme="light" appName="Admin Portal" enableLogging>
      <ToastProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<AdminLogin />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute requireAdmin redirectTo="/login">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/errors"
                element={
                  <ProtectedRoute requireAdmin redirectTo="/login">
                    <ErrorMonitor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rate-limits"
                element={
                  <ProtectedRoute requireAdmin redirectTo="/login">
                    <RateLimitMonitor />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
