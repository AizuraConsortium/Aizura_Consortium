import { Link } from 'react-router-dom';
import { Award, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface RewardsPreviewProps {
  pending: string;
  claimable: string;
  lastDistribution: string;
}

export function RewardsPreview({ pending, claimable, lastDistribution }: RewardsPreviewProps) {
  return (
    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Rewards</h3>
        </div>
        <Link
          to="/app/rewards"
          className="text-sm text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
        >
          View Full Rewards
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Clock className="w-4 h-4" />
            Pending
          </div>
          <div className="text-2xl font-bold text-white">{pending}</div>
          <div className="text-xs text-slate-500 mt-1">AAIC</div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <CheckCircle className="w-4 h-4" />
            Claimable
          </div>
          <div className="text-2xl font-bold text-green-400">{claimable}</div>
          <div className="text-xs text-slate-500 mt-1">AAIC</div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <Clock className="w-4 h-4" />
            Last Distribution
          </div>
          <div className="text-lg font-bold text-white">{lastDistribution}</div>
          <div className="text-xs text-slate-500 mt-1">Days ago</div>
        </div>
      </div>

      {parseFloat(claimable) > 0 && (
        <Link
          to="/app/rewards"
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
        >
          Claim {claimable} AAIC
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
