/**
 * RevenueChart Component (Client-specific)
 *
 * Displays revenue trends for a business with customized styling for the client dashboard.
 * Wraps the shared MetricTrendChart with client-specific features and styling.
 */

import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { MetricTrendChart } from '@shared/components/portfolio/MetricTrendChart';
import type { BusinessMetricsTimeSeries } from '@shared/types/portfolio';

interface RevenueChartProps {
  data: BusinessMetricsTimeSeries;
  businessName?: string;
  className?: string;
  loading?: boolean;
  showPeriodSelector?: boolean;
}

type TimePeriod = '7d' | '30d' | '90d' | '1y' | 'all';

const periodLabels: Record<TimePeriod, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  '1y': 'Last year',
  'all': 'All time',
};

function calculateTotalRevenue(data: BusinessMetricsTimeSeries): number {
  return data.data_points.reduce((sum, point) => sum + point.value, 0);
}

function calculateAverageRevenue(data: BusinessMetricsTimeSeries): number {
  if (data.data_points.length === 0) return 0;
  return calculateTotalRevenue(data) / data.data_points.length;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * RevenueChart displays revenue trends with summary statistics
 *
 * @example
 * <RevenueChart
 *   data={revenueData}
 *   businessName="AI Traders"
 *   showPeriodSelector
 * />
 */
export function RevenueChart({
  data,
  businessName,
  className = '',
  loading = false,
  showPeriodSelector = false,
}: RevenueChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');

  const totalRevenue = calculateTotalRevenue(data);
  const avgRevenue = calculateAverageRevenue(data);
  const trend = data.trend;

  if (loading) {
    return (
      <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse ${className}`}>
        <div className="h-6 bg-slate-700 rounded w-32 mb-4" />
        <div className="h-64 bg-slate-700 rounded" />
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {businessName ? `${businessName} Revenue` : 'Revenue'}
            </h3>
            {trend && (
              <div className="flex items-center gap-2 text-sm">
                {trend.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : trend.direction === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : null}
                <span
                  className={`font-medium ${
                    trend.direction === 'up'
                      ? 'text-green-400'
                      : trend.direction === 'down'
                      ? 'text-red-400'
                      : 'text-slate-400'
                  }`}
                >
                  {trend.change_percent > 0 ? '+' : ''}
                  {trend.change_percent}%
                </span>
                <span className="text-slate-500">vs previous period</span>
              </div>
            )}
          </div>
        </div>

        {showPeriodSelector && (
          <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-1">
            {(Object.keys(periodLabels) as TimePeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  selectedPeriod === period
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {periodLabels[period]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Average Revenue</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(avgRevenue)}</div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
        <MetricTrendChart data={data} showGrid={true} height={300} />
      </div>

      {data.data_points.length > 0 && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-4 h-4" />
          <span>
            Data from {new Date(data.data_points[0].period_start).toLocaleDateString()} to{' '}
            {new Date(data.data_points[data.data_points.length - 1].period_end).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}

interface RevenueComparisonProps {
  businesses: Array<{
    name: string;
    revenue: number;
    trend?: { direction: 'up' | 'down' | 'stable'; change_percent: number };
  }>;
  className?: string;
}

/**
 * RevenueComparison displays a simple comparison of revenues across businesses
 *
 * @example
 * <RevenueComparison businesses={[
 *   { name: 'AI Traders', revenue: 125000, trend: { direction: 'up', change_percent: 12 } },
 *   { name: 'Coinfusion', revenue: 83000, trend: { direction: 'up', change_percent: 8 } }
 * ]} />
 */
export function RevenueComparison({ businesses, className = '' }: RevenueComparisonProps) {
  const maxRevenue = Math.max(...businesses.map((b) => b.revenue));

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-bold text-white mb-4">Revenue Comparison</h3>
      <div className="space-y-4">
        {businesses.map((business, index) => {
          const percentage = (business.revenue / maxRevenue) * 100;
          return (
            <div key={index}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">{business.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{formatCurrency(business.revenue)}</span>
                  {business.trend && (
                    <span
                      className={`text-xs ${
                        business.trend.direction === 'up'
                          ? 'text-green-400'
                          : business.trend.direction === 'down'
                          ? 'text-red-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {business.trend.change_percent > 0 ? '+' : ''}
                      {business.trend.change_percent}%
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
