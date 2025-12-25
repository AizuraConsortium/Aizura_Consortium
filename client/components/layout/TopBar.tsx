import { LogOut, Wifi, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showUserMenu]);

  const handleViewProfile = () => {
    setShowUserMenu(false);
    navigate('/app/profile');
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 bg-slate-800 border-b border-slate-700">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="hidden sm:inline">Mainnet</span>
          </div>

          <NotificationCenter onViewAll={() => navigate('/app/notifications')} />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-slate-300 hidden md:inline">
                {formatAddress(user?.id || '')}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={handleViewProfile}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  View Profile
                </button>
                <div className="border-t border-slate-600" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
