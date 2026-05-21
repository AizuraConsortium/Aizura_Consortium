import { useState } from 'react';
import { Search, Twitter, MessageCircle, Github, Send, Loader2, Plus, Minus, Flag, Ban } from 'lucide-react';
import { api } from '../../lib/api';

interface UserProfile {
  id: string;
  email: string;
  walletAddress?: string;
  totalPoints: number;
  rank: number;
  joinedAt: string;
  lastActivity: string;
  pointsBreakdown: {
    social: number;
    referrals: number;
    content: number;
    engagement: number;
    manual: number;
  };
  socialConnections: {
    twitter?: { username: string; verified: boolean };
    discord?: { username: string; verified: boolean };
    github?: { username: string; verified: boolean };
    telegram?: { username: string; verified: boolean };
  };
  referrals: {
    total: number;
    qualified: number;
    pending: number;
  };
  submissions: {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
  };
  activityLog: Array<{
    id: string;
    action: string;
    points: number;
    timestamp: string;
    details?: string;
  }>;
  flags: string[];
  banned: boolean;
}

export function UserLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [adjustmentPoints, setAdjustmentPoints] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [processing, setProcessing] = useState(false);

  async function handleSearch() {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setUserProfile(null);

    try {
      const data = await api.get<UserProfile>(`/admin/airdrop/users/search?q=${encodeURIComponent(searchQuery)}`);
      setUserProfile(data);
    } catch (error) {
      console.error('Failed to search user:', error);
      alert('User not found');
    } finally {
      setSearching(false);
    }
  }

  async function handlePointsAdjustment(type: 'add' | 'subtract') {
    if (!userProfile || !adjustmentPoints || !adjustmentReason.trim()) {
      alert('Please enter points amount and reason');
      return;
    }

    const points = parseInt(adjustmentPoints);
    if (isNaN(points) || points <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    setProcessing(true);

    try {
      await api.post(`/admin/airdrop/users/${userProfile.id}/adjust-points`, {
        points: type === 'subtract' ? -points : points,
        reason: adjustmentReason,
      });
      setAdjustmentPoints('');
      setAdjustmentReason('');
      handleSearch();
    } catch (error) {
      console.error('Failed to adjust points:', error);
      const message = error instanceof Error ? error.message : 'Failed to adjust points';
      alert(message);
    } finally {
      setProcessing(false);
    }
  }

  async function handleFlag() {
    if (!userProfile) return;

    const reason = prompt('Enter reason for flagging:');
    if (!reason) return;

    setProcessing(true);

    try {
      await api.post(`/admin/airdrop/users/${userProfile.id}/flag`, {
        reason,
      });
      handleSearch();
    } catch (error) {
      console.error('Failed to flag user:', error);
      alert('Failed to flag user');
    } finally {
      setProcessing(false);
    }
  }

  async function handleBan() {
    if (!userProfile) return;

    const confirmed = confirm(`Ban user ${userProfile.email}? This will prevent them from earning more points.`);
    if (!confirmed) return;

    const reason = prompt('Enter reason for ban:');
    if (!reason) return;

    setProcessing(true);

    try {
      await api.post(`/admin/airdrop/users/${userProfile.id}/ban`, {
        reason,
      });
      handleSearch();
    } catch (error) {
      console.error('Failed to ban user:', error);
      alert('Failed to ban user');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by wallet address, email, or social username..."
              className="w-full bg-slate-700 border border-white/10 text-white pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>
      </div>

      {userProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{userProfile.email}</h3>
                  {userProfile.walletAddress && (
                    <code className="text-sm text-slate-400 font-mono">
                      {userProfile.walletAddress}
                    </code>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleFlag}
                    disabled={processing}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleBan}
                    disabled={processing || userProfile.banned}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {userProfile.banned && (
                <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 font-medium">⚠️ This user is banned</p>
                </div>
              )}

              {userProfile.flags.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 font-medium mb-2">⚠️ Flagged User</p>
                  <ul className="text-sm text-yellow-200 space-y-1">
                    {userProfile.flags.map((flag, i) => (
                      <li key={i}>• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">Total Points</p>
                  <p className="text-2xl font-bold text-white">{userProfile.totalPoints.toLocaleString()}</p>
                </div>
                <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">Rank</p>
                  <p className="text-2xl font-bold text-white">#{userProfile.rank}</p>
                </div>
                <div className="bg-green-600/10 border border-green-500/20 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">Referrals</p>
                  <p className="text-2xl font-bold text-white">{userProfile.referrals.qualified}</p>
                </div>
                <div className="bg-orange-600/10 border border-orange-500/20 rounded-xl p-4">
                  <p className="text-sm text-slate-400 mb-1">Content</p>
                  <p className="text-2xl font-bold text-white">{userProfile.submissions.approved}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Points Breakdown</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(userProfile.pointsBreakdown).map(([key, value]) => (
                    <div key={key} className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-xs text-slate-400 capitalize mb-1">{key}</p>
                      <p className="text-lg font-semibold text-white">{value.toLocaleString()} pts</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Social Connections</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(userProfile.socialConnections).map(([platform, data]) => {
                  const icons = { twitter: Twitter, discord: MessageCircle, github: Github, telegram: Send };
                  const Icon = icons[platform as keyof typeof icons];
                  return data ? (
                    <div key={platform} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 capitalize">{platform}</p>
                        <p className="text-sm text-white truncate">@{data.username}</p>
                      </div>
                      {data.verified && (
                        <span className="text-xs text-green-400">✓</span>
                      )}
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Manual Points Adjustment</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Points Amount</label>
                  <input
                    type="number"
                    value={adjustmentPoints}
                    onChange={(e) => setAdjustmentPoints(e.target.value)}
                    placeholder="Enter points amount"
                    className="w-full bg-slate-700 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Reason</label>
                  <textarea
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    placeholder="Enter reason for adjustment"
                    rows={2}
                    className="w-full bg-slate-700 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePointsAdjustment('add')}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Points
                  </button>
                  <button
                    onClick={() => handlePointsAdjustment('subtract')}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                    Subtract Points
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Activity Log</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {userProfile.activityLog.map((activity) => (
                  <div key={activity.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm text-white">{activity.action}</p>
                      <span className={`text-xs font-medium ${activity.points >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {activity.points >= 0 ? '+' : ''}{activity.points}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                    {activity.details && (
                      <p className="text-xs text-slate-500 mt-1">{activity.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Account Info</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400">Joined</p>
                  <p className="text-sm text-white">{new Date(userProfile.joinedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Last Activity</p>
                  <p className="text-sm text-white">{new Date(userProfile.lastActivity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
