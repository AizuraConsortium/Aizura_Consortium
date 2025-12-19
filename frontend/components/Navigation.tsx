import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Home, MessageSquare, Vote, Info } from 'lucide-react';

interface NavigationProps {
  variant?: 'home' | 'internal';
}

export function Navigation({ variant = 'internal' }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      isActive(path)
        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
    }`;

  return (
    <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            aria-label="Go to home page"
          >
            <Sparkles className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">Aizura Consortium</h1>
          </button>

          <div className="flex items-center space-x-2">
            {variant === 'internal' && (
              <button
                onClick={() => navigate('/')}
                className={linkClass('/')}
                aria-label="Go to home page"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
            )}
            <button
              onClick={() => navigate('/room')}
              className={linkClass('/room')}
              aria-label="Go to live debate room"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Room</span>
            </button>
            <button
              onClick={() => navigate('/governance')}
              className={linkClass('/governance')}
              aria-label="Go to governance page"
            >
              <Vote className="w-4 h-4" />
              <span>Governance</span>
            </button>
            <button
              onClick={() => navigate('/about')}
              className={linkClass('/about')}
              aria-label="Learn about the system"
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
