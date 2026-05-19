import { useState, useEffect } from 'react';
import { AlertTriangle, Eye, CheckCircle, Ban, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

interface FlaggedUser {
  id: string;
  userId: string;
  email: string;
  walletAddress?: string;
  reason: string;
  flaggedAt: string;
  totalPoints: number;
  suspiciousActivities: string[];
  flagType: 'auto' | 'manual';
  reviewed: boolean;
}

export function FlaggedUsers() {
  const [flaggedUsers, setFlaggedUsers] = useState<FlaggedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<FlaggedUser | null>(null);
  const [processing, setProcessing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'auto' | 'manual'>('all');

  useEffect(() => {
    loadFlaggedUsers();
  }, []);

  async function loadFlaggedUsers() {
    try {
      const response = await api.get('/admin/airdrop/flagged-users');
      if (response.ok) {
        const data = await response.json();
        setFlaggedUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to load flagged users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(userId: string) {
    window.open(`#users?search=${userId}`, '_blank');
  }

  async function handleClearFlag(flagId: string) {
    const confirmed = confirm('Clear this flag? The user will no longer appear in this list.');
    if (!confirmed) return;

    setProcessing(true);

    try {
      const response = await api.post(`/admin/airdrop/flags/${flagId}/clear`, {});
      if (response.ok) {
        loadFlaggedUsers();
      } else {
        alert('Failed to clear flag');
      }
    } catch (error) {
      console.error('Failed to clear flag:', error);
      alert('Failed to clear flag');
    } finally {
      setProcessing(false);
    }
  }

  async function handleBan(user: FlaggedUser) {
    const confirmed = confirm(`Ban user ${user.email}? This will prevent them from earning more points.`);
    if (!confirmed) return;

    const reason = prompt('Enter reason for ban:', user.reason);
    if (!reason) return;

    setProcessing(true);

    try {
      const response = await api.post(`/admin/airdrop/users/${user.userId}/ban`, {
        reason,
      });

      if (response.ok) {
        loadFlaggedUsers();
      } else {
        alert('Failed to ban user');
      }
    } catch (error) {
      console.error('Failed to ban user:', error);
      alert('Failed to ban user');
    } finally {
      setProcessing(false);
    }
  }

  const filteredUsers = flaggedUsers.filter(user =>
    filterType === 'all' || user.flagType === filterType
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">
            Flagged Users ({filteredUsers.length})
          </h2>
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="bg-slate-700 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Flags</option>
          <option value="auto">Auto-detected</option>
          <option value="manual">Manual Flags</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Flagged Users</h3>
          <p className="text-slate-400">
            All users are in good standing. Auto-detection is monitoring for suspicious activity.
          </p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Points</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Flagged</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-white">{user.email}</p>
                        {user.walletAddress && (
                          <code className="text-xs text-slate-400 font-mono">
                            {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                          </code>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-white mb-1">{user.reason}</p>
                        {user.suspiciousActivities.length > 0 && (
                          <details className="text-xs text-slate-400">
                            <summary className="cursor-pointer hover:text-slate-300">
                              {user.suspiciousActivities.length} suspicious activities
                            </summary>
                            <ul className="mt-2 space-y-1 ml-4">
                              {user.suspiciousActivities.map((activity, i) => (
                                <li key={i}>• {activity}</li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded border ${
                        user.flagType === 'auto'
                          ? 'bg-orange-600/20 border-orange-500/30 text-orange-300'
                          : 'bg-purple-600/20 border-purple-500/30 text-purple-300'
                      }`}>
                        {user.flagType === 'auto' ? 'Auto-detected' : 'Manual'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-yellow-400">
                        {user.totalPoints.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-slate-400">
                        {new Date(user.flaggedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded border ${
                        user.reviewed
                          ? 'bg-blue-600/20 border-blue-500/30 text-blue-300'
                          : 'bg-yellow-600/20 border-yellow-500/30 text-yellow-300'
                      }`}>
                        {user.reviewed ? 'Reviewed' : 'Pending Review'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReview(user.userId)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          title="Review User"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleClearFlag(user.id)}
                          disabled={processing}
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                          title="Clear Flag"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleBan(user)}
                          disabled={processing}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                          title="Ban User"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Auto-Detection Criteria</h4>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• Multiple accounts from same IP address</li>
              <li>• Similar social media patterns across multiple accounts</li>
              <li>• Rapid points accumulation in short time period</li>
              <li>• Suspicious referral patterns (circular referrals, etc.)</li>
              <li>• Content submission spam or low-quality submissions</li>
              <li>• Unusual activity patterns (bot-like behavior)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Review Actions</h4>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• <strong>Review:</strong> Opens user profile in User Lookup tab for detailed investigation</li>
              <li>• <strong>Clear Flag:</strong> Removes flag if user is determined to be legitimate</li>
              <li>• <strong>Ban:</strong> Prevents user from earning additional points (existing points remain)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
