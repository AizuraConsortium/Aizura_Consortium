import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, Globe, Palette, Shield, LogOut, UserCircle, Loader2 } from 'lucide-react';
import { NotificationPreferences } from '../components/notifications/NotificationPreferences';
import { useUserProfile } from '@shared/hooks/useUserProfile';
import { useProfileUpdate } from '@shared/hooks/useProfileUpdate';
import { useToast } from '@shared/components/ToastProvider';
import { api } from '../lib/api';

export default function SettingsView() {
  const { user, logout, session } = useAuth();
  const { showToast } = useToast();
  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'dark'
  });

  const [profileData, setProfileData] = useState({
    display_name: '',
    bio: '',
    avatar_url: ''
  });

  const [hasProfileChanges, setHasProfileChanges] = useState(false);

  const { profile, loading: loadingProfile, refetch } = useUserProfile(
    api,
    session?.access_token,
    {
      skip: !session?.access_token,
      onSuccess: (data) => {
        setProfileData({
          display_name: data.display_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        });
      },
    }
  );

  const { updateProfile, loading: updatingProfile } = useProfileUpdate(
    api,
    session?.access_token,
    {
      onSuccess: () => {
        showToast('Profile updated successfully!', 'success');
        setHasProfileChanges(false);
        refetch();
      },
      onError: (error) => {
        showToast(error.message || 'Failed to update profile', 'error');
      },
    }
  );

  useEffect(() => {
    if (profile) {
      const hasChanges =
        profileData.display_name !== (profile.display_name || '') ||
        profileData.bio !== (profile.bio || '') ||
        profileData.avatar_url !== (profile.avatar_url || '');
      setHasProfileChanges(hasChanges);
    }
  }, [profileData, profile]);

  const handleProfileChange = (field: 'display_name' | 'bio' | 'avatar_url', value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        display_name: profileData.display_name || null,
        bio: profileData.bio || null,
        avatar_url: profileData.avatar_url || null
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserCircle className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          </div>

          {loadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-white font-medium mb-3 block">Display Name</label>
                <input
                  type="text"
                  value={profileData.display_name}
                  onChange={(e) => handleProfileChange('display_name', e.target.value)}
                  placeholder="Enter your display name"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  maxLength={50}
                />
                <p className="text-sm text-slate-400 mt-2">
                  Your display name will be visible to other users
                </p>
              </div>

              <div>
                <label className="text-white font-medium mb-3 block">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
                  maxLength={500}
                />
                <p className="text-sm text-slate-400 mt-2">
                  {profileData.bio.length}/500 characters
                </p>
              </div>

              <div>
                <label className="text-white font-medium mb-3 block">Avatar URL</label>
                <input
                  type="url"
                  value={profileData.avatar_url}
                  onChange={(e) => handleProfileChange('avatar_url', e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
                <p className="text-sm text-slate-400 mt-2">
                  Enter a URL to an image for your profile avatar
                </p>
                {profileData.avatar_url && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-400 mb-2">Preview:</p>
                    <img
                      src={profileData.avatar_url}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-slate-600"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {hasProfileChanges && (
                <button
                  onClick={handleSaveProfile}
                  disabled={updatingProfile}
                  className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                >
                  {updatingProfile ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Profile Changes'
                  )}
                </button>
              )}
            </div>
          )}
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
      </div>
    </DashboardLayout>
  );
}
