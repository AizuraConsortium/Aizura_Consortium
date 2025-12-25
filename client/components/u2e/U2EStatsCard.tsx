import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface U2EStatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function U2EStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  trendValue,
}: U2EStatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        {trend !== 'neutral' && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          {title}
        </h3>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
