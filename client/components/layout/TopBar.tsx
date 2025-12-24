import { LogOut, Wifi } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { useNavigate } from 'react-router-dom';

export function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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

          <div className="flex items-center gap-3 px-3 py-2 bg-slate-700 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-slate-300 hidden md:inline">
              {formatAddress(user?.id || '')}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
