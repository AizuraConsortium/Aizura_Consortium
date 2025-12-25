/**
 * BusinessMetricCard Component
 *
 * Displays a business metric with optional trend indicator and change percentage.
 * Used for showing key performance indicators like revenue, users, transactions, etc.
 */

import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Activity, Zap } from 'lucide-react';
import { Card } from '../ui/Card.js';
import { cn } from '@shared/styles/theme';
import type { MetricType, MetricTrend } from '@shared/types/portfolio';

interface BusinessMetricCardProps {
  title: string;
  value: number | string;
  metricType?: MetricType;
  trend?: MetricTrend | null;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  valueFormatter?: (value: number | string) => string;
  loading?: boolean;
}

function getDefaultIcon(metricType?: MetricType): React.ReactNode {
  switch (metricType) {
    case 'revenue':
      return <DollarSign className="w-5 h-5" />;
    case 'users':
      return <Users className="w-5 h-5" />;
    case 'transactions':
      return <Activity className="w-5 h-5" />;
    case 'api_calls':
      return <Zap className="w-5 h-5" />;
    default:
      return <Activity className="w-5 h-5" />;
  }
}

function formatDefaultValue(value: number | string, metricType?: MetricType): string {
  if (typeof value === 'string') return value;

  switch (metricType) {
    case 'revenue':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'users':
    case 'transactions':
    case 'api_calls':
      return new Intl.NumberFormat('en-US', {
        notation: value >= 1000000 ? 'compact' : 'standard',
        compactDisplay: 'short',
      }).format(value);
    default:
      return String(value);
  }
}

function TrendIndicator({ trend }: { trend: MetricTrend }) {
  const isPositive = trend.direction === 'up';
  const isNeutral = trend.direction === 'stable';

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  const colorClasses = isNeutral
    ? 'text-gray-500 bg-gray-100'
    : isPositive
    ? 'text-green-600 bg-green-50'
    : 'text-red-600 bg-red-50';

  return (
    <div className={cn('flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium', colorClasses)}>
      <Icon className="w-4 h-4" />
      <span>{trend.change_percent}%</span>
    </div>
  );
}

/**
 * BusinessMetricCard displays a single business metric with optional trend
 *
 * @example
 * <BusinessMetricCard
 *   title="Total Revenue"
 *   value={125000}
 *   metricType="revenue"
 *   trend={{ direction: 'up', change_percent: 12.5 }}
 *   subtitle="Last 30 days"
 * />
 */
export function BusinessMetricCard({
  title,
  value,
  metricType,
  trend,
  subtitle,
  icon,
  className,
  valueFormatter,
  loading = false,
}: BusinessMetricCardProps) {
  const displayIcon = icon || getDefaultIcon(metricType);
  const displayValue = valueFormatter
    ? valueFormatter(value)
    : formatDefaultValue(value, metricType);

  if (loading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-32" />
          {subtitle && <div className="h-3 bg-gray-200 rounded w-20" />}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-600">{title}</h4>
          <div className="text-gray-400">{displayIcon}</div>
        </div>

        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">{displayValue}</div>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>

        {trend && (
          <div className="pt-2 border-t border-gray-100">
            <TrendIndicator trend={trend} />
          </div>
        )}
      </div>
    </Card>
  );
}

interface BusinessMetricGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

/**
 * BusinessMetricGrid for laying out multiple metric cards
 *
 * @example
 * <BusinessMetricGrid columns={3}>
 *   <BusinessMetricCard {...} />
 *   <BusinessMetricCard {...} />
 *   <BusinessMetricCard {...} />
 * </BusinessMetricGrid>
 */
export function BusinessMetricGrid({
  children,
  className,
  columns = 3,
}: BusinessMetricGridProps) {
  const gridColsClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridColsClasses[columns], className)}>
      {children}
    </div>
  );
}
