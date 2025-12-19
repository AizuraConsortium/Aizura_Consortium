import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { SkipNavigation } from './components/SkipNavigation';
import Home from './pages/Home';
import Room from './pages/Room';
import PlanViewer from './pages/PlanViewer';
import Governance from './pages/Governance';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ErrorBoundary theme="dark" appName="Website" enableLogging>
      <AuthProvider>
        <BrowserRouter>
          <SkipNavigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room" element={<Room />} />
            <Route path="/plan/:topicId" element={<PlanViewer />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
