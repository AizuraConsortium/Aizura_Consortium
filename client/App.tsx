import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary, ToastProvider } from '@shared/components';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from '@shared/components';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyProposals from './pages/MyProposals';
import Governance from './pages/Governance';

export default function App() {
  return (
    <ErrorBoundary theme="light" appName="Client Portal" enableLogging>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute authContextType="client" redirectTo="/login">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/proposals"
                element={
                  <ProtectedRoute authContextType="client" redirectTo="/login">
                    <MyProposals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/governance"
                element={
                  <ProtectedRoute authContextType="client" redirectTo="/login">
                    <Governance />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
