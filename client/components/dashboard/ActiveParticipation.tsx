import { Link } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface ParticipationItem {
  id: string;
  title: string;
  type: 'voted' | 'submitted' | 'governance';
  status: 'active' | 'pending' | 'approved' | 'rejected';
  timeRemaining: string;
  votesFor?: number;
  votesAgainst?: number;
}

interface ActiveParticipationProps {
  items: ParticipationItem[];
}

export function ActiveParticipation({ items }: ActiveParticipationProps) {
  if (items.length === 0) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <p className="text-slate-400">No active participation</p>
        <p className="text-sm text-slate-500 mt-2">
          Start voting on proposals or submit your own ideas
        </p>
        <Link
          to="/app/launchpad"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Explore Launchpad
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  item.type === 'voted' ? 'bg-blue-500/20 text-blue-400' :
                  item.type === 'submitted' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {item.type === 'voted' ? 'Voted' :
                   item.type === 'submitted' ? 'Your Proposal' :
                   'Governance'}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  item.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  item.status === 'approved' ? 'bg-cyan-500/20 text-cyan-400' :
                  item.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {item.status}
                </span>
              </div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              {item.votesFor !== undefined && item.votesAgainst !== undefined && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-400">FOR: {item.votesFor}%</span>
                  <span className="text-red-400">AGAINST: {item.votesAgainst}%</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              {item.timeRemaining}
            </div>
          </div>
          <Link
            to={`/app/launchpad/${item.id}`}
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ))}
    </div>
  );
}
