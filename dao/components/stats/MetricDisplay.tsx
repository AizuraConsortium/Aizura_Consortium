import { ReactNode } from 'react';

interface MetricDisplayProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: ReactNode;
  className?: string;
}

export function MetricDisplay({ label, value, subValue, trend, className = '' }: MetricDisplayProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm text-slate-400">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && <div className="text-sm">{trend}</div>}
      </div>
      {subValue && <p className="text-xs text-slate-500">{subValue}</p>}
    </div>
  );
}
