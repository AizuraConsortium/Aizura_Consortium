import { CheckCircle, Lock } from 'lucide-react';

interface MilestoneCardProps {
  title: string;
  reward: number;
  achieved: number;
  description: string;
  progress: number;
}

export function MilestoneCard({
  title,
  reward,
  achieved,
  description,
  progress
}: MilestoneCardProps) {
  const isAchieved = achieved > 0;

  return (
    <div className={`p-4 rounded-lg border transition-all ${
      isAchieved
        ? 'bg-green-500/10 border-green-500/30'
        : 'bg-white/5 border-white/10'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isAchieved ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Lock className="w-4 h-4 text-slate-500" />
            )}
            <h5 className="font-semibold text-white text-sm">{title}</h5>
          </div>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
        <div className="text-right ml-3">
          <div className={`text-lg font-bold ${
            isAchieved ? 'text-green-400' : 'text-yellow-400'
          }`}>
            +{reward}
          </div>
          <div className="text-xs text-slate-500">points</div>
        </div>
      </div>

      {achieved > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">
              {achieved} referral{achieved !== 1 ? 's' : ''} achieved
            </span>
            <span className="text-green-400 font-medium">
              +{achieved * reward} total
            </span>
          </div>
        </div>
      )}

      {achieved === 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400">Progress</span>
            <span className="text-slate-300">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
