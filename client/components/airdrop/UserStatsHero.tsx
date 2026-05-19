import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Share2, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

interface UserStats {
  totalPoints: number;
  rank: number;
  totalUsers: number;
  estimatedAllocation: number;
  nextMilestone: number;
  progressToNextMilestone: number;
}

interface UserStatsHeroProps {
  userId: string;
}

export function UserStatsHero({ userId }: UserStatsHeroProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  async function loadStats() {
    try {
      const response = await api.get(`/client/airdrop/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    } finally {
      setLoading(false);
    }
  }

  function shareRank() {
    const text = `I'm ranked #${stats?.rank.toLocaleString()} on the @AizuraAI airdrop leaderboard with ${stats?.totalPoints.toLocaleString()} points! 🚀\n\nJoin the airdrop and earn AAIC tokens: https://aizura.ai/dashboard/airdrop`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const progressPercent = (stats.progressToNextMilestone / stats.nextMilestone) * 100;

  return (
    <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
                Your Total Points
              </h2>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-white">
                  {stats.totalPoints.toLocaleString()}
                </span>
                <span className="text-2xl text-slate-400">pts</span>
              </div>
            </div>
            <button
              onClick={shareRank}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Rank
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Progress to next milestone</span>
                <span className="text-sm font-medium text-white">
                  {stats.progressToNextMilestone.toLocaleString()} / {stats.nextMilestone.toLocaleString()} pts
                </span>
              </div>
              <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
            </div>

            <p className="text-sm text-slate-400">
              Keep earning points through social engagement, referrals, and content submissions to increase your airdrop allocation!
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-slate-400">Current Rank</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                #{stats.rank.toLocaleString()}
              </span>
              <span className="text-sm text-slate-400">
                of {stats.totalUsers.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-slate-400">Est. Allocation</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {stats.estimatedAllocation.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Estimate based on current points distribution
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
