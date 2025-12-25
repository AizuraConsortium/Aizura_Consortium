import { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { api } from '../lib/api';
import { GetU2EStatsResponse } from '../../shared/types/u2e';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { ErrorAlert } from '../../shared/components/ErrorAlert';
import { U2EStatsCard } from '../components/u2e/U2EStatsCard';
import { BusinessBreakdownTable } from '../components/u2e/BusinessBreakdownTable';
import { UsageHistoryTable } from '../components/u2e/UsageHistoryTable';
import { RewardRatesDisplay } from '../components/u2e/RewardRatesDisplay';
import { ClaimableRewards } from '../components/u2e/ClaimableRewards';

export function U2EView() {
  const [stats, setStats] = useState<GetU2EStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'rates'>('overview');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<GetU2EStatsResponse>('/client/u2e/stats');
      setStats(data);
    } catch (err) {
      setError('Failed to load U2E statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert message={error || 'Failed to load U2E data'} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Zap className="w-8 h-8 text-blue-600" />
              Use-to-Earn (U2E)
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Earn AAIC tokens by using AAIC ecosystem platforms
            </p>
          </div>

          <div className="flex items-center gap-2">
            {stats.is_system_active ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <span className="w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                <span className="w-2 h-2 rounded-full bg-gray-600 mr-2"></span>
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>

      {!stats.is_system_active && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
                U2E System Currently Inactive
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                The Use-to-Earn program will be activated after the airdrop concludes.
                Your usage data is being tracked and rewards will be calculated once the system goes live.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <U2EStatsCard
          title="Total Earned"
          value={stats.total_earned.toFixed(2)}
          subtitle="AAIC tokens"
          icon={TrendingUp}
          trend={stats.current_month_earned > 0 ? 'up' : 'neutral'}
        />
        <U2EStatsCard
          title="This Month"
          value={stats.current_month_earned.toFixed(2)}
          subtitle="AAIC tokens"
          icon={Zap}
          trend="neutral"
        />
        <U2EStatsCard
          title="Projected Monthly"
          value={stats.projected_monthly.toFixed(2)}
          subtitle="AAIC tokens"
          icon={TrendingUp}
          trend={stats.projected_monthly > stats.current_month_earned ? 'up' : 'neutral'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ClaimableRewards
            claimableAmount={stats.claimable_at_launch}
            isSystemActive={stats.is_system_active}
          />
        </div>
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Activity Summary
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total_usage_count.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Actions
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.businesses_used}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Platforms Used
                </div>
              </div>
              {stats.top_business && (
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.top_business}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Top Platform
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Business Breakdown
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Usage History
            </button>
            <button
              onClick={() => setActiveTab('rates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'rates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Reward Rates
            </button>
          </nav>
        </div>
      </div>

      <div className="mb-8">
        {activeTab === 'overview' && <BusinessBreakdownTable />}
        {activeTab === 'history' && <UsageHistoryTable />}
        {activeTab === 'rates' && <RewardRatesDisplay />}
      </div>
    </div>
  );
}
