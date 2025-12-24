import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, Globe, Palette, Shield, LogOut } from 'lucide-react';
import { NotificationPreferences } from '../components/notifications/NotificationPreferences';

export default function SettingsView() {
  const { user, logout } = useAuth();
  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'dark'
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Wallet & Security</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-2">Connected Wallet</div>
              <div className="text-white font-mono">{user?.id || 'Not connected'}</div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-2">Network</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-white">Mainnet</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors">
                Reconnect Wallet
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        </div>

        <NotificationPreferences />

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Preferences</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-white font-medium mb-3 block">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <div>
              <label className="text-white font-medium mb-3 block">Theme</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    preferences.theme === 'dark'
                      ? 'border-cyan-500 bg-slate-700'
                      : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                  }`}
                >
                  <Palette className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                  <div className="text-white font-medium">Dark</div>
                  <div className="text-sm text-slate-400">Default theme</div>
                </button>
                <button
                  onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                  className={`p-4 rounded-lg border-2 transition-colors opacity-50 cursor-not-allowed ${
                    preferences.theme === 'light'
                      ? 'border-cyan-500 bg-slate-700'
                      : 'border-slate-600 bg-slate-700/30'
                  }`}
                  disabled
                >
                  <Palette className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                  <div className="text-white font-medium">Light</div>
                  <div className="text-sm text-slate-400">Coming soon</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Security</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Your security is managed through your connected wallet. Always verify transactions before signing.
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-sm text-yellow-400">
              Never share your private keys or seed phrase with anyone. The team will never ask for this information.
            </p>
          </div>
        </div>

        <button className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors">
          Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
}
