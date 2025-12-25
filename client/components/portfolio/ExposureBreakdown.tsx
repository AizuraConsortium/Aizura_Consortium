/**
 * ExposureBreakdown Component (Client-specific)
 *
 * Displays a breakdown of user's exposure across businesses, showing how participation
 * translates to portfolio exposure through voting, usage, and proposals.
 */

import { Target, Vote, Zap, FileText, TrendingUp } from 'lucide-react';
import { StatusBadge } from '@shared/components/portfolio/StatusBadge';
import type { UserExposure, PortfolioOverview } from '@shared/types/portfolio';

interface ExposureBreakdownProps {
  portfolio?: PortfolioOverview | null;
  loading?: boolean;
  className?: string;
}

function calculateExposureBreakdown(portfolio: PortfolioOverview) {
  const breakdown = {
    voting: 0,
    usage: 0,
    proposal: 0,
    mixed: 0,
  };

  portfolio.businesses.forEach((business) => {
    if (business.exposure) {
      breakdown[business.exposure.exposure_type] += business.exposure.exposure_score;
    }
  });

  return breakdown;
}

function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * ExposureBreakdown displays how user exposure is distributed
 *
 * @example
 * <ExposureBreakdown portfolio={portfolioData} />
 */
export function ExposureBreakdown({ portfolio, loading = false, className = '' }: ExposureBreakdownProps) {
  if (loading) {
    return (
      <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse ${className}`}>
        <div className="h-6 bg-slate-700 rounded w-32 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-slate-700 rounded w-20 mb-2" />
              <div className="h-6 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!portfolio || portfolio.total_exposure_score === 0) {
    return (
      <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 ${className}`}>
        <h3 className="text-lg font-bold text-white mb-4">Exposure Breakdown</h3>
        <div className="text-center py-8 text-slate-400">
          <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No exposure data available</p>
          <p className="text-xs text-slate-500 mt-1">
            Start participating in governance to build your portfolio exposure
          </p>
        </div>
      </div>
    );
  }

  const breakdown = calculateExposureBreakdown(portfolio);
  const total = portfolio.total_exposure_score;

  const exposureTypes = [
    {
      type: 'voting' as const,
      label: 'Voting Participation',
      description: 'Exposure from voting on proposals',
      icon: <Vote className="w-5 h-5 text-cyan-400" />,
      value: breakdown.voting,
      color: 'cyan',
    },
    {
      type: 'usage' as const,
      label: 'Usage-to-Earn',
      description: 'Exposure from using AI businesses',
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      value: breakdown.usage,
      color: 'yellow',
    },
    {
      type: 'proposal' as const,
      label: 'Proposal Submission',
      description: 'Exposure from submitting proposals',
      icon: <FileText className="w-5 h-5 text-purple-400" />,
      value: breakdown.proposal,
      color: 'purple',
    },
    {
      type: 'mixed' as const,
      label: 'Mixed Activity',
      description: 'Multiple participation types',
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      value: breakdown.mixed,
      color: 'green',
    },
  ].filter((item) => item.value > 0);

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Exposure Breakdown</h3>
        <div className="text-sm text-slate-400">
          Total: <span className="font-bold text-cyan-400">{total.toFixed(1)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {exposureTypes.map((item) => {
          const percentage = calculatePercentage(item.value, total);
          return (
            <div key={item.type}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div>
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{item.value.toFixed(1)}</div>
                  <div className="text-xs text-slate-400">{percentage}%</div>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    item.color === 'cyan'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      : item.color === 'yellow'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : item.color === 'purple'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700">
        <h4 className="text-sm font-semibold text-white mb-3">Top Exposures</h4>
        <div className="space-y-2">
          {portfolio.businesses
            .filter((b) => b.exposure)
            .sort((a, b) => (b.exposure?.exposure_score || 0) - (a.exposure?.exposure_score || 0))
            .slice(0, 3)
            .map((business) => (
              <div
                key={business.id}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-slate-300">{business.display_name}</div>
                  {business.exposure && (
                    <StatusBadge exposureType={business.exposure.exposure_type} size="sm" showIcon={false} />
                  )}
                </div>
                <div className="text-sm font-bold text-cyan-400">
                  {business.exposure?.exposure_score.toFixed(1)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

interface BusinessExposureDetailProps {
  exposure: UserExposure;
  businessName: string;
  className?: string;
}

/**
 * BusinessExposureDetail shows detailed exposure information for a single business
 *
 * @example
 * <BusinessExposureDetail
 *   exposure={exposureData}
 *   businessName="AI Traders"
 * />
 */
export function BusinessExposureDetail({ exposure, businessName, className = '' }: BusinessExposureDetailProps) {
  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-bold text-white mb-4">Your Exposure to {businessName}</h3>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Exposure Score</div>
          <div className="text-2xl font-bold text-cyan-400">{exposure.exposure_score.toFixed(1)}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Activity Level</div>
          <div className="mt-2">
            <StatusBadge activityLevel={exposure.activity_level} showIcon />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
          <span className="text-sm text-slate-400">Votes Cast</span>
          <span className="font-semibold text-white">{exposure.votes_cast}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
          <span className="text-sm text-slate-400">Proposals Submitted</span>
          <span className="font-semibold text-white">{exposure.proposals_submitted}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
          <span className="text-sm text-slate-400">Usage Rewards Earned</span>
          <span className="font-semibold text-white">{exposure.usage_rewards_earned.toFixed(2)} AIZ</span>
        </div>
        {exposure.last_activity_at && (
          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
            <span className="text-sm text-slate-400">Last Activity</span>
            <span className="font-semibold text-white">
              {new Date(exposure.last_activity_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
