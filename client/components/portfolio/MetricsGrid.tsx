/**
 * MetricsGrid Component (Client-specific)
 *
 * Displays portfolio overview metrics in a grid layout for the client dashboard.
 * Shows key statistics about the user's portfolio exposure and business performance.
 */

import { Briefcase, TrendingUp, Activity, Target, DollarSign, Users } from 'lucide-react';
import type { PortfolioOverview, BusinessWithMetrics } from '@shared/types/portfolio';

interface MetricsGridProps {
  portfolio?: PortfolioOverview | null;
  loading?: boolean;
  className?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: value >= 10000 ? 'compact' : 'standard',
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: value >= 1000 ? 'compact' : 'standard',
    compactDisplay: 'short',
  }).format(value);
}

/**
 * MetricsGrid displays portfolio overview statistics
 *
 * @example
 * <MetricsGrid portfolio={portfolioData} />
 */
export function MetricsGrid({ portfolio, loading = false, className = '' }: MetricsGridProps) {
  if (loading) {
    return (
      <div className={`grid md:grid-cols-4 gap-6 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-24 mb-2" />
            <div className="h-8 bg-slate-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  const liveBusinesses = portfolio.businesses.filter((b) => b.status === 'live').length;
  const devBusinesses = portfolio.businesses.filter(
    (b) => b.status === 'development' || b.status === 'planning'
  ).length;

  return (
    <div className={`grid md:grid-cols-4 gap-6 ${className}`}>
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-400">Total Businesses</div>
          <Briefcase className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="text-3xl font-bold text-white">{portfolio.total_businesses}</div>
        <div className="text-xs text-slate-500 mt-2">
          {liveBusinesses} live, {devBusinesses} in development
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-400">Total Revenue</div>
          <DollarSign className="w-5 h-5 text-green-400" />
        </div>
        <div className="text-3xl font-bold text-green-400">
          {formatCurrency(portfolio.total_portfolio_revenue)}
        </div>
        <div className="text-xs text-slate-500 mt-2">Across all businesses</div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-400">Total Users</div>
          <Users className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-3xl font-bold text-blue-400">
          {formatNumber(portfolio.total_users ?? 0)}
        </div>
        <div className="text-xs text-slate-500 mt-2">Active users</div>
      </div>

      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-400">Exposure Score</div>
          <Target className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="text-3xl font-bold text-cyan-400">
          {(portfolio.total_exposure_score ?? 0).toFixed(1)}
        </div>
        <div className="text-xs text-slate-500 mt-2">Your participation level</div>
      </div>
    </div>
  );
}

interface BusinessMetricsGridProps {
  business: BusinessWithMetrics;
  loading?: boolean;
  className?: string;
}

/**
 * BusinessMetricsGrid displays metrics for a single business
 *
 * @example
 * <BusinessMetricsGrid business={businessData} />
 */
export function BusinessMetricsGrid({ business, loading = false, className = '' }: BusinessMetricsGridProps) {
  if (loading) {
    return (
      <div className={`grid md:grid-cols-3 gap-6 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-24 mb-2" />
            <div className="h-8 bg-slate-700 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const metrics = business.current_metrics;
  if (!metrics) {
    return null;
  }

  const metricCards = [];

  if (metrics.revenue !== undefined && metrics.revenue !== null) {
    metricCards.push({
      label: 'Monthly Revenue',
      value: formatCurrency(metrics.revenue),
      icon: <DollarSign className="w-5 h-5 text-green-400" />,
      color: 'green',
    });
  }

  if (metrics.users !== undefined && metrics.users !== null) {
    metricCards.push({
      label: 'Active Users',
      value: formatNumber(metrics.users),
      icon: <Users className="w-5 h-5 text-blue-400" />,
      color: 'blue',
    });
  }

  if (metrics.transactions !== undefined && metrics.transactions !== null) {
    metricCards.push({
      label: 'Transactions',
      value: formatNumber(metrics.transactions),
      icon: <Activity className="w-5 h-5 text-purple-400" />,
      color: 'purple',
    });
  }

  if (metrics.api_calls !== undefined && metrics.api_calls !== null) {
    metricCards.push({
      label: 'API Calls',
      value: formatNumber(metrics.api_calls),
      icon: <TrendingUp className="w-5 h-5 text-cyan-400" />,
      color: 'cyan',
    });
  }

  if (metricCards.length === 0) {
    return (
      <div className={`text-center py-8 text-slate-400 ${className}`}>
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No metrics available yet</p>
      </div>
    );
  }

  const colorClasses = {
    green: 'bg-green-500/10 border-green-500/30 hover:border-green-500/50',
    blue: 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50',
    purple: 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500/50',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/50',
  };

  const textColorClasses = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
  };

  return (
    <div className={`grid md:grid-cols-${Math.min(metricCards.length, 3)} gap-6 ${className}`}>
      {metricCards.map((card, index) => (
        <div
          key={index}
          className={`border rounded-xl p-6 transition-colors ${
            colorClasses[card.color as keyof typeof colorClasses]
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-slate-400">{card.label}</div>
            {card.icon}
          </div>
          <div className={`text-3xl font-bold ${textColorClasses[card.color as keyof typeof textColorClasses]}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
