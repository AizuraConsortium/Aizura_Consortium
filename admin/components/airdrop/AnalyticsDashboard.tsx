import { useState, useEffect } from 'react';
import { TrendingUp, Users, Award, FileText, Share2, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

interface AnalyticsData {
  overview: {
    totalPointsDistributed: number;
    totalUsers: number;
    averagePointsPerUser: number;
    totalReferrals: number;
    totalSubmissions: number;
    submissionsApprovalRate: number;
  };
  pointsDistribution: Array<{
    range: string;
    count: number;
  }>;
  dailyNewUsers: Array<{
    date: string;
    count: number;
  }>;
  dailyPoints: Array<{
    date: string;
    points: number;
  }>;
  contentTypes: Array<{
    type: string;
    count: number;
    approvedCount: number;
    totalPoints: number;
  }>;
  referralFunnel: {
    totalReferrals: number;
    activeReferrals: number;
    qualifiedReferrals: number;
    conversionRate: number;
  };
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const response = await api.get(`/api/admin/airdrop/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
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

  if (!analytics) {
    return (
      <div className="text-center text-slate-400 py-12">
        Failed to load analytics
      </div>
    );
  }

  const maxDailyUsers = Math.max(...analytics.dailyNewUsers.map(d => d.count), 1);
  const maxDailyPoints = Math.max(...analytics.dailyPoints.map(d => d.points), 1);
  const maxDistribution = Math.max(...analytics.pointsDistribution.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="bg-slate-700 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-blue-400" />
            <h3 className="text-sm font-medium text-slate-300">Total Points Distributed</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {analytics.overview.totalPointsDistributed.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-purple-400" />
            <h3 className="text-sm font-medium text-slate-300">Total Participants</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {analytics.overview.totalUsers.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-sm font-medium text-slate-300">Avg Points/User</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {Math.round(analytics.overview.averagePointsPerUser).toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-orange-400" />
            <h3 className="text-sm font-medium text-slate-300">Content Submissions</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {analytics.overview.totalSubmissions.toLocaleString()}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {analytics.overview.submissionsApprovalRate.toFixed(1)}% approval rate
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Share2 className="w-6 h-6 text-yellow-400" />
            <h3 className="text-sm font-medium text-slate-300">Total Referrals</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {analytics.overview.totalReferrals.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Points Distribution</h3>
          <div className="space-y-3">
            {analytics.pointsDistribution.map((item) => (
              <div key={item.range}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-400">{item.range} points</span>
                  <span className="text-sm font-medium text-white">{item.count} users</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
                    style={{ width: `${(item.count / maxDistribution) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Content Types Performance</h3>
          <div className="space-y-4">
            {analytics.contentTypes.map((item) => (
              <div key={item.type} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-white">{item.type}</h4>
                  <span className="text-sm text-slate-400">
                    {item.approvedCount}/{item.count}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400">Total Submissions</p>
                    <p className="text-white font-medium">{item.count}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Points Awarded</p>
                    <p className="text-green-400 font-medium">{item.totalPoints.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(item.approvedCount / item.count) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daily New Users</h3>
          <div className="space-y-2">
            {analytics.dailyNewUsers.slice(-14).map((item) => (
              <div key={item.date} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-20">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 h-8 bg-slate-700 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-end px-2"
                    style={{ width: `${(item.count / maxDailyUsers) * 100}%` }}
                  >
                    {item.count > 0 && (
                      <span className="text-xs font-medium text-white">{item.count}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Points Earned</h3>
          <div className="space-y-2">
            {analytics.dailyPoints.slice(-14).map((item) => (
              <div key={item.date} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-20">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 h-8 bg-slate-700 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-end px-2"
                    style={{ width: `${(item.points / maxDailyPoints) * 100}%` }}
                  >
                    {item.points > 0 && (
                      <span className="text-xs font-medium text-white">
                        {item.points.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Referral Funnel</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-full h-32 bg-gradient-to-b from-blue-600 to-blue-700 rounded-t-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {analytics.referralFunnel.totalReferrals}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-b-lg p-3">
              <p className="text-sm font-medium text-white">Total Referrals</p>
              <p className="text-xs text-slate-400">100%</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-full h-32 bg-gradient-to-b from-cyan-600 to-cyan-700 rounded-t-lg flex items-center justify-center"
              style={{ height: `${(analytics.referralFunnel.activeReferrals / analytics.referralFunnel.totalReferrals) * 128}px` }}
            >
              <span className="text-2xl font-bold text-white">
                {analytics.referralFunnel.activeReferrals}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-b-lg p-3">
              <p className="text-sm font-medium text-white">Active Users</p>
              <p className="text-xs text-slate-400">
                {((analytics.referralFunnel.activeReferrals / analytics.referralFunnel.totalReferrals) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-full h-32 bg-gradient-to-b from-green-600 to-green-700 rounded-t-lg flex items-center justify-center"
              style={{ height: `${(analytics.referralFunnel.qualifiedReferrals / analytics.referralFunnel.totalReferrals) * 128}px` }}
            >
              <span className="text-2xl font-bold text-white">
                {analytics.referralFunnel.qualifiedReferrals}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-b-lg p-3">
              <p className="text-sm font-medium text-white">Qualified (1000+ pts)</p>
              <p className="text-xs text-slate-400">
                {((analytics.referralFunnel.qualifiedReferrals / analytics.referralFunnel.totalReferrals) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="text-center flex flex-col justify-center">
            <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-lg p-6">
              <p className="text-sm text-slate-400 mb-2">Conversion Rate</p>
              <p className="text-4xl font-bold text-emerald-400">
                {analytics.referralFunnel.conversionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
