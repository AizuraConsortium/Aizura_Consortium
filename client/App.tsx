import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { ToastProvider } from '@shared/components/ToastProvider';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import LaunchpadView from './pages/LaunchpadView';
import GovernanceView from './pages/GovernanceView';
import PortfolioView from './pages/PortfolioView';
import RewardsView from './pages/RewardsView';
import TokenView from './pages/TokenView';
import SettingsView from './pages/SettingsView';
import { AirdropView } from './pages/AirdropView';

export default function App() {
  return (
    <ErrorBoundary theme="light" appName="Client Portal" enableLogging>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <DashboardHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/launchpad"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <LaunchpadView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/governance"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <GovernanceView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/portfolio"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <PortfolioView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/rewards"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <RewardsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/token"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <TokenView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/settings"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <SettingsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/airdrop"
                element={
                  <ProtectedRoute redirectTo="/login">
                    <AirdropView />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/app" replace />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
