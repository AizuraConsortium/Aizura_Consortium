import { Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { useDAOStats } from '../../hooks/useDAOStats';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';

export function DAOSidebar() {
  const { stats, loading } = useDAOStats();

  if (loading) {
    return (
      <aside className="hidden lg:block lg:w-64 bg-slate-900 border-l border-slate-800 p-6">
        <LoadingSpinner size="sm" />
      </aside>
    );
  }

  return (
    <aside className="hidden lg:block lg:w-64 bg-slate-900 border-l border-slate-800 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">Active Proposals</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.proposals.active || 0}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-400">Participation</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats?.governance.participationRate.toFixed(1) || 0}%
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-slate-400">Active Voters</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats?.governance.activeVoters30d || 0}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Treasury Overview
          </h3>
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Total Value</p>
            <p className="text-xl font-bold text-white">
              ${stats?.treasury.totalValue.toLocaleString() || 0}
            </p>
            <p className="text-xs text-green-400 mt-1">
              +{stats?.treasury.revenueGrowth.toFixed(1)}% growth
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
