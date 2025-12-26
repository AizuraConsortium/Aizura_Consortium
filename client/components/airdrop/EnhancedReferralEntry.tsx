import { User, CheckCircle, Clock, ChevronRight } from 'lucide-react';

interface EnhancedReferralEntryProps {
  referral: {
    username: string;
    status: 'pending' | 'qualified' | 'active';
    points: number;
    progress: number;
    joinedAt: string;
    connectedSocials?: string[];
    milestonesAchieved?: string[];
  };
  onViewDetails: () => void;
}

export function EnhancedReferralEntry({ referral, onViewDetails }: EnhancedReferralEntryProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'qualified':
      case 'active':
        return {
          color: 'text-green-400 bg-green-400/10 border-green-400/30',
          icon: <CheckCircle className="w-3 h-3" />,
          label: 'Qualified'
        };
      case 'pending':
        return {
          color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
          icon: <Clock className="w-3 h-3" />,
          label: 'Pending'
        };
      default:
        return {
          color: 'text-slate-400 bg-slate-400/10 border-slate-400/30',
          icon: <User className="w-3 h-3" />,
          label: 'New'
        };
    }
  };

  const statusConfig = getStatusConfig(referral.status);
  const milestonesCount = referral.milestonesAchieved?.length || 0;

  return (
    <div
      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-cyan-500/30 transition-all cursor-pointer group"
      onClick={onViewDetails}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-medium text-white truncate">
                {referral.username}
              </span>
              <span className={`text-xs px-2 py-0.5 border rounded-full flex items-center gap-1 ${statusConfig.color}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
              <span>Joined {new Date(referral.joinedAt).toLocaleDateString()}</span>
              {milestonesCount > 0 && (
                <>
                  <span>•</span>
                  <span className="text-green-400">{milestonesCount} milestone{milestonesCount !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-right flex items-center gap-3">
          <div>
            <div className="text-lg font-bold text-white">
              +{referral.points}
            </div>
            <div className="text-xs text-slate-400">points</div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400">Activity Progress</span>
          <span className="text-cyan-400">{referral.progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${referral.progress}%` }}
          />
        </div>
      </div>

      {referral.connectedSocials && referral.connectedSocials.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {referral.connectedSocials.map(social => (
            <span
              key={social}
              className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded text-slate-300 capitalize"
            >
              {social}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
