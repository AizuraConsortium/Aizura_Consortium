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
import { ProfileView } from './pages/ProfileView';

export default function App() {
  const signInPath = '/auth/sign-in';

  return (
    <ErrorBoundary theme="light" appName="Client Portal" enableLogging>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter basename="/client">
            <Routes>
              <Route path={signInPath} element={<Login />} />
              <Route path="/login" element={<Navigate to={signInPath} replace />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute redirectTo={signInPath}>
                    <DashboardHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/launchpad"
                element={
                  <ProtectedRoute redirectTo={signInPath}>
                    <LaunchpadView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/governance"
                element={
                  <ProtectedRoute redirectTo={signInPath}>
                    <GovernanceView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/portfolio"
                element={
                  <ProtectedRoute redirectTo={signInPath}>
                    <PortfolioView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/rewards"
                element={
                  <ProtectedRoute redirectTo={signInPath}>
                    <RewardsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/token"
                element={
                  <ProtectedRoute redirectTo={signInPath}>
                    <TokenView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/settings"
                element={
                  <ProtectedRoute redirectTo={signInPath}>
                    <SettingsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/airdrop"
                element={
                  <ProtectedRoute redirectTo={signInPath}>
                    <AirdropView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/app/profile"
                element={
                  <ProtectedRoute redirectTo={signInPath}>
                    <ProfileView />
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
