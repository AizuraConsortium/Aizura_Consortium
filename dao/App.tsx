import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { SkipNavigation } from '@shared/components/SkipNavigation';
import { ToastProvider } from '@shared/components/ToastProvider';
import { DAOLayout } from './components/layout/DAOLayout';
import Dashboard from './pages/Dashboard';
import Proposals from './pages/Proposals';
import Treasury from './pages/Treasury';
import Consortium from './pages/Consortium';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <ErrorBoundary theme="dark" appName="DAO Portal" enableLogging>
      <ToastProvider>
        <BrowserRouter>
          <SkipNavigation />
          <DAOLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/treasury" element={<Treasury />} />
              <Route path="/consortium" element={<Consortium />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DAOLayout>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}
