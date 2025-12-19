import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { ErrorMonitor } from './pages/ErrorMonitor';
import RateLimitMonitor from './pages/RateLimitMonitor';

export default function App() {
  return (
    <ErrorBoundary theme="light" appName="Admin Portal" enableLogging>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route
              path="/"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/errors"
              element={
                <AdminProtectedRoute>
                  <ErrorMonitor />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/rate-limits"
              element={
                <AdminProtectedRoute>
                  <RateLimitMonitor />
                </AdminProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}
