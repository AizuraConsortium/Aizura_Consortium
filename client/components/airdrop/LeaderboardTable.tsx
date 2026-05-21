import { useState, useEffect } from 'react';
import { Trophy, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  walletAddress: string;
  totalPoints: number;
  referralCount: number;
  contentCount: number;
  isCurrentUser: boolean;
}

interface LeaderboardTableProps {
  currentUserId: string;
}

export function LeaderboardTable({ currentUserId }: LeaderboardTableProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [page]);

  async function loadLeaderboard(showRefreshing = false) {
    if (showRefreshing) setRefreshing(true);
    try {
      const data = await api.get<{ entries: LeaderboardEntry[]; totalPages: number }>(`/client/airdrop/leaderboard?page=${page}&limit=100`);
      setEntries(data.entries || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function getRankDisplay(rank: number) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  }

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Top 100 Leaderboard</h3>
        </div>
        <button
          onClick={() => loadLeaderboard(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Rank</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Wallet</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Points</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Referrals</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Content</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.userId}
                className={`border-b border-white/5 transition-colors ${
                  entry.isCurrentUser
                    ? 'bg-blue-600/20 border-blue-500/30'
                    : 'hover:bg-white/5'
                }`}
              >
                <td className="py-4 px-4">
                  <span className="text-lg font-bold text-white">
                    {getRankDisplay(entry.rank)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-white">
                      {truncateAddress(entry.walletAddress)}
                    </code>
                    {entry.isCurrentUser && (
                      <span className="px-2 py-0.5 bg-blue-600/30 border border-blue-500/50 text-blue-300 text-xs font-medium rounded">
                        YOU
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-white font-semibold">
                    {entry.totalPoints.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-slate-300">
                    {entry.referralCount}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-slate-300">
                    {entry.contentCount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-slate-400 px-4">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-slate-300">
          <strong className="text-white">Privacy Note:</strong> Leaderboard shows wallet addresses for anonymity. Social usernames are not displayed publicly.
        </p>
      </div>
    </div>
  );
}
