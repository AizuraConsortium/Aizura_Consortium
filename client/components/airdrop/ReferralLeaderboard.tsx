import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Users, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

interface LeaderEntry {
  rank: number;
  walletAddress: string;
  referralCount: number;
  qualifiedCount: number;
  totalPointsEarned: number;
  isCurrentUser: boolean;
}

export function ReferralLeaderboard({ userId }: { userId: string }) {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    try {
      const response = await api.get('/client/airdrop/referrals/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaders(data);
      }
    } catch (error) {
      console.error('Failed to load referral leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Top Referrers</h3>
        </div>
        <p className="text-slate-300 text-sm">
          These community members are leading the way in bringing new users to Aizura.
          The more qualified referrals you have, the higher you rank!
        </p>
      </div>

      <div className="space-y-2">
        {leaders.map((entry, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition-all ${
              entry.isCurrentUser
                ? 'bg-cyan-500/10 border-cyan-500/30'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0 ${
                entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                entry.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900' :
                entry.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                'bg-slate-700 text-slate-300'
              }`}>
                {entry.rank}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-white truncate">
                    {entry.isCurrentUser ? 'You' : entry.walletAddress}
                  </span>
                  {entry.isCurrentUser && (
                    <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">
                      Your Rank
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {entry.referralCount} referral{entry.referralCount !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {entry.qualifiedCount} qualified
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  +{entry.totalPointsEarned.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">points earned</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {leaders.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-400">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No leaderboard data yet. Start referring to claim your spot!</p>
        </div>
      )}
    </div>
  );
}
