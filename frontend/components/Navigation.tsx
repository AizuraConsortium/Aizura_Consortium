import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Home, MessageSquare, Vote, Info, Menu, X } from 'lucide-react';

interface NavigationProps {
  variant?: 'home' | 'internal';
}

export function Navigation({ variant = 'internal' }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      isActive(path)
        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
    }`;

  const mobileLinkClass = (path: string) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-lg ${
      isActive(path)
        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
    }`;

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm" role="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigate('/')}
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
            aria-label="Go to home page"
          >
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
            <h1 className="text-lg sm:text-2xl font-bold text-white">Aizura Consortium</h1>
          </button>

          <div className="hidden md:flex items-center space-x-2">
            {variant === 'internal' && (
              <button
                onClick={() => handleNavigate('/')}
                className={linkClass('/')}
                aria-label="Go to home page"
                aria-current={isActive('/') ? 'page' : undefined}
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                <span>Home</span>
              </button>
            )}
            <button
              onClick={() => handleNavigate('/room')}
              className={linkClass('/room')}
              aria-label="Go to live debate room"
              aria-current={isActive('/room') ? 'page' : undefined}
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span>Live Room</span>
            </button>
            <button
              onClick={() => handleNavigate('/governance')}
              className={linkClass('/governance')}
              aria-label="Go to governance page"
              aria-current={isActive('/governance') ? 'page' : undefined}
            >
              <Vote className="w-4 h-4" aria-hidden="true" />
              <span>Governance</span>
            </button>
            <button
              onClick={() => handleNavigate('/about')}
              className={linkClass('/about')}
              aria-label="Learn about the system"
              aria-current={isActive('/about') ? 'page' : undefined}
            >
              <Info className="w-4 h-4" aria-hidden="true" />
              <span>About</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-sm"
        >
          <div className="px-4 py-4 space-y-2">
            {variant === 'internal' && (
              <button
                onClick={() => handleNavigate('/')}
                className={mobileLinkClass('/')}
                aria-label="Go to home page"
                aria-current={isActive('/') ? 'page' : undefined}
              >
                <Home className="w-5 h-5" aria-hidden="true" />
                <span>Home</span>
              </button>
            )}
            <button
              onClick={() => handleNavigate('/room')}
              className={mobileLinkClass('/room')}
              aria-label="Go to live debate room"
              aria-current={isActive('/room') ? 'page' : undefined}
            >
              <MessageSquare className="w-5 h-5" aria-hidden="true" />
              <span>Live Room</span>
            </button>
            <button
              onClick={() => handleNavigate('/governance')}
              className={mobileLinkClass('/governance')}
              aria-label="Go to governance page"
              aria-current={isActive('/governance') ? 'page' : undefined}
            >
              <Vote className="w-5 h-5" aria-hidden="true" />
              <span>Governance</span>
            </button>
            <button
              onClick={() => handleNavigate('/about')}
              className={mobileLinkClass('/about')}
              aria-label="Learn about the system"
              aria-current={isActive('/about') ? 'page' : undefined}
            >
              <Info className="w-5 h-5" aria-hidden="true" />
              <span>About</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
