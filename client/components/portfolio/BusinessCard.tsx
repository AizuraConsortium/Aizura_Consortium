/**
 * BusinessCard Component (Client-specific)
 *
 * Displays a business card with status, exposure, progress, and metrics.
 * Used in the client portfolio view.
 */

import { Link } from 'react-router-dom';
import { Briefcase, ExternalLink, Github, Globe } from 'lucide-react';
import { StatusBadge, ProgressBadge, StatusBadgeGroup } from '@shared/components/portfolio/StatusBadge';
import type { BusinessWithMetrics } from '@shared/types/portfolio';

interface BusinessCardProps {
  business: BusinessWithMetrics;
  showExposure?: boolean;
  className?: string;
}

function formatRevenue(revenue: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: revenue >= 10000 ? 'compact' : 'standard',
  }).format(revenue);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: value >= 1000 ? 'compact' : 'standard',
    compactDisplay: 'short',
  }).format(value);
}

/**
 * BusinessCard displays a business in the portfolio list
 *
 * @example
 * <BusinessCard business={businessData} showExposure />
 */
export function BusinessCard({ business, showExposure = true, className = '' }: BusinessCardProps) {
  const hasRevenue = business.current_metrics?.revenue && business.current_metrics.revenue > 0;
  const hasUsers = business.current_metrics?.users && business.current_metrics.users > 0;

  return (
    <div
      className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {business.logo_url ? (
              <img
                src={business.logo_url}
                alt={`${business.display_name} logo`}
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <Briefcase className="w-6 h-6 text-cyan-400" />
            )}
            <h3 className="font-bold text-white text-lg">{business.display_name}</h3>
          </div>

          {business.description && (
            <p className="text-sm text-slate-400 mb-3 line-clamp-2">{business.description}</p>
          )}

          <StatusBadgeGroup>
            <StatusBadge status={business.status} showIcon />
            {business.category && (
              <span className="inline-flex items-center gap-1.5 font-medium rounded-full border bg-slate-700/50 text-slate-300 border-slate-600 text-sm px-2.5 py-1">
                {business.category}
              </span>
            )}
            {showExposure && business.exposure && (
              <StatusBadge exposureType={business.exposure.exposure_type} showIcon size="sm" />
            )}
          </StatusBadgeGroup>
        </div>

        <div className="flex gap-2">
          {business.website_url && (
            <a
              href={business.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
              aria-label="Visit website"
            >
              <Globe className="w-5 h-5" />
            </a>
          )}
          {business.github_url && (
            <a
              href={business.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {(hasRevenue || hasUsers) && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {hasRevenue && (
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Current Revenue</div>
              <div className="text-lg font-bold text-green-400">
                {formatRevenue(business.current_metrics.revenue)}
              </div>
            </div>
          )}
          {hasUsers && (
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Active Users</div>
              <div className="text-lg font-bold text-blue-400">
                {formatNumber(business.current_metrics.users)}
              </div>
            </div>
          )}
        </div>
      )}

      {showExposure && business.exposure && (
        <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Your Exposure Score</span>
            <span className="font-bold text-cyan-400">{business.exposure.exposure_score.toFixed(1)}</span>
          </div>
          {business.exposure.votes_cast > 0 && (
            <div className="text-xs text-slate-400 mt-1">
              {business.exposure.votes_cast} vote{business.exposure.votes_cast !== 1 ? 's' : ''} cast
            </div>
          )}
        </div>
      )}

      {business.status !== 'live' && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">Development Progress</span>
            <ProgressBadge progress={business.development_progress} size="sm" />
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${business.development_progress}%` }}
            />
          </div>
        </div>
      )}

      <Link
        to={`/dashboard/portfolio/${business.slug || business.id}`}
        className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium"
      >
        View Business Details
        <ExternalLink className="w-4 h-4" />
      </Link>
    </div>
  );
}

interface BusinessCardListProps {
  businesses: BusinessWithMetrics[];
  showExposure?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * BusinessCardList displays a list of business cards
 *
 * @example
 * <BusinessCardList businesses={businesses} showExposure />
 */
export function BusinessCardList({
  businesses,
  showExposure = true,
  emptyMessage = 'No businesses found',
  className = '',
}: BusinessCardListProps) {
  if (businesses.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} showExposure={showExposure} />
      ))}
    </div>
  );
}
