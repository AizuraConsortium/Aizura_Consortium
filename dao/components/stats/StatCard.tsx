import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-400',
  trend,
}: StatCardProps) {
  return (
    <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 bg-slate-800 rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <span className="text-xs text-slate-400">{title}</span>
      </div>
      <div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        {trend && (
          <p className={`text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.isPositive ? '+' : ''}{trend.value.toFixed(1)}%
          </p>
        )}
      </div>
    </div>
  );
}
