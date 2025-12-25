import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  value: number;
  showIcon?: boolean;
  showPercentage?: boolean;
}

export function TrendIndicator({ value, showIcon = true, showPercentage = true }: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const colorClass = isNeutral
    ? 'text-slate-400'
    : isPositive
    ? 'text-green-400'
    : 'text-red-400';

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <span className={`inline-flex items-center gap-1 ${colorClass}`}>
      {showIcon && <Icon className="w-4 h-4" />}
      {isPositive && '+'}
      {value.toFixed(1)}
      {showPercentage && '%'}
    </span>
  );
}
