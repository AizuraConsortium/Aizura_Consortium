import { useDAOStats } from '../hooks/useDAOStats';
import { useTreasuryStats } from '../hooks/useTreasuryStats';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { ErrorAlert } from '@shared/components/ErrorAlert';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { stats, loading: statsLoading, error: statsError } = useDAOStats();
  const { treasury, loading: treasuryLoading, error: treasuryError } = useTreasuryStats();

  if (statsLoading || treasuryLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (statsError || treasuryError) {
    return (
      <ErrorAlert
        message="Failed to load dashboard data"
        details={statsError || treasuryError || 'Unknown error'}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">DAO Dashboard</h1>
        <p className="text-slate-400">
          Real-time overview of governance activity and treasury metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs text-slate-400">Governance</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">
              {stats?.proposals.active || 0}
            </p>
            <p className="text-sm text-slate-400">Active Proposals</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-slate-400">Participation</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">
              {stats?.governance.participationRate.toFixed(1)}%
            </p>
            <p className="text-sm text-slate-400">30-Day Rate</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-slate-400">Community</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">
              {stats?.governance.activeVoters30d || 0}
            </p>
            <p className="text-sm text-slate-400">Active Voters</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-slate-400">Treasury</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">
              ${treasury?.summary.totalValue.toLocaleString()}
            </p>
            <p className="text-sm text-green-400">
              +{treasury?.summary.revenueGrowth.toFixed(1)}% growth
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <h2 className="text-xl font-semibold text-white mb-4">Proposal Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Proposals</span>
              <span className="text-white font-semibold">{stats?.proposals.total || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Passed</span>
              <span className="text-green-400 font-semibold">{stats?.proposals.passed || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Rejected</span>
              <span className="text-red-400 font-semibold">{stats?.proposals.rejected || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Queued</span>
              <span className="text-yellow-400 font-semibold">{stats?.proposals.queued || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
          <h2 className="text-xl font-semibold text-white mb-4">Treasury Allocation</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Foundation</span>
                <span className="text-white font-semibold">
                  {treasury?.allocation.foundationPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${treasury?.allocation.foundationPercentage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Live Businesses</span>
                <span className="text-white font-semibold">
                  {treasury?.allocation.liveBusinessesPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${treasury?.allocation.liveBusinessesPercentage}%` }}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Businesses</span>
                <span className="text-white font-semibold">
                  {treasury?.summary.activeBusinesses || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
