import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '@shared/hooks/useUserProfile';
import { useToast } from '@shared/components/ToastProvider';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { api } from '../lib/api';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { ActivityTimeline } from '../components/profile/ActivityTimeline';
import { BadgeCollection } from '../components/profile/BadgeCollection';
import { UserStatsHero } from '../components/airdrop/UserStatsHero';
import { PointsBreakdown } from '../components/airdrop/PointsBreakdown';
import { SocialConnections } from '../components/airdrop/SocialConnections';
import { ReferralCard } from '../components/airdrop/ReferralCard';
import type { UserProfile } from '@shared/types/profile';

type TabId = 'overview' | 'activity' | 'social' | 'referrals';

export function ProfileView() {
  const { user, session } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showEditModal, setShowEditModal] = useState(false);

  const { profile, loading, error, refetch } = useUserProfile(
    api,
    session?.access_token,
    {
      skip: !session?.access_token,
      onError: (err) => {
        showToast(err.message || 'Failed to load profile', 'error');
      },
    }
  );

  useEffect(() => {
    document.title = 'Profile - Aizura';
  }, []);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    refetch();
    showToast('Profile updated successfully!', 'success');
  };

  if (!user || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
          <p className="text-slate-300 mb-6">
            Please sign in to view your profile.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Profile</h2>
          <p className="text-slate-300 mb-6">
            {error || 'Failed to load profile data'}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TabId, label: 'Overview' },
    { id: 'activity' as TabId, label: 'Activity' },
    { id: 'social' as TabId, label: 'Social' },
    { id: 'referrals' as TabId, label: 'Referrals' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-slate-400">
            View and manage your profile, achievements, and activity
          </p>
        </div>

        <ProfileHeader
          profile={profile}
          isOwnProfile={true}
          onEdit={() => setShowEditModal(true)}
        />

        <div className="border-b border-white/10">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-blue-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <UserStatsHero userId={user.id} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PointsBreakdown userId={user.id} />
                <BadgeCollection profile={profile} />
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Activity Timeline</h2>
              <ActivityTimeline userId={user.id} />
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Social Connections</h2>
                <p className="text-slate-400 mb-6">
                  Connect your social media accounts to earn bonus points and unlock exclusive features
                </p>
                <SocialConnections userId={user.id} />
              </div>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Referral Program</h2>
                <p className="text-slate-400 mb-6">
                  Invite friends to join Aizura and earn rewards when they participate
                </p>
                <ReferralCard userId={user.id} />
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profile={profile}
          onSuccess={handleProfileUpdate}
          token={session?.access_token}
        />
      )}
    </div>
  );
}
