import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import Home from './pages/Home';
import Room from './pages/Room';
import PlanViewer from './pages/PlanViewer';
import Governance from './pages/Governance';
import About from './pages/About';
import NotFound from './pages/NotFound';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ErrorMonitor } from './pages/admin/ErrorMonitor';
import RateLimitMonitor from './pages/admin/RateLimitMonitor';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/room" element={<Room />} />
              <Route path="/plan/:topicId" element={<PlanViewer />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/about" element={<About />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/errors"
                element={
                  <AdminProtectedRoute>
                    <ErrorMonitor />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/rate-limits"
                element={
                  <AdminProtectedRoute>
                    <RateLimitMonitor />
                  </AdminProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
