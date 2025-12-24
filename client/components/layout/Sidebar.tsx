import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Rocket, Vote, Briefcase, Award, Coins, Settings, X
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'Launchpad', href: '/app/launchpad', icon: Rocket },
  { name: 'Governance', href: '/app/governance', icon: Vote },
  { name: 'Portfolio', href: '/app/portfolio', icon: Briefcase },
  { name: 'Rewards', href: '/app/rewards', icon: Award },
  { name: 'Token', href: '/app/token', icon: Coins },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-slate-800 border-r border-slate-700">
          <div className="flex items-center flex-shrink-0 px-6 py-4 border-b border-slate-700">
            <h1 className="text-xl font-bold text-cyan-400">AAIC Portal</h1>
          </div>
          <nav className="flex-1 flex flex-col px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/app'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <button
        type="button"
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-cyan-600 rounded-full shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <LayoutDashboard className="w-6 h-6 text-white" />
      </button>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900">
          <div className="flex flex-col h-full bg-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h1 className="text-xl font-bold text-cyan-400">AAIC Portal</h1>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/app'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
