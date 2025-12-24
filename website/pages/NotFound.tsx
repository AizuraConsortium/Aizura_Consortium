import { useNavigate } from 'react-router-dom';
import { XCircle, Home, MessageSquare, Vote } from 'lucide-react';
import { Navigation } from '../components/layout/Navigation';
import { WebsiteHealthBadge } from '../components/WebsiteHealthBadge';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative">
        <Navigation variant="internal" />

        <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-12 text-center">
            <div className="mb-8 flex justify-center">
              <XCircle className="w-24 h-24 text-cyan-400" strokeWidth={1.5} />
            </div>

            <h1 className="text-6xl font-bold text-white mb-4">404</h1>
            <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              The page you're looking for doesn't exist. It may have been moved or deleted.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center space-x-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-4 px-6 rounded-lg transition-colors"
                aria-label="Go to home page"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </button>

              <button
                onClick={() => navigate('/room')}
                className="flex items-center justify-center space-x-3 bg-slate-700 hover:bg-slate-600 text-white font-medium py-4 px-6 rounded-lg transition-colors border border-slate-600"
                aria-label="View live debate room"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Live Room</span>
              </button>

              <button
                onClick={() => navigate('/governance')}
                className="flex items-center justify-center space-x-3 bg-slate-700 hover:bg-slate-600 text-white font-medium py-4 px-6 rounded-lg transition-colors border border-slate-600"
                aria-label="Browse proposals"
              >
                <Vote className="w-5 h-5" />
                <span>Governance</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <WebsiteHealthBadge />
    </div>
  );
}
