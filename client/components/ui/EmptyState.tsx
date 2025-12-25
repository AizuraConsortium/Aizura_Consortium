import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: 'light' | 'dark';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'dark'
}: EmptyStateProps) {
  const textColorClass = variant === 'dark' ? 'text-white' : 'text-slate-900';
  const mutedTextClass = variant === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const iconColorClass = variant === 'dark' ? 'text-slate-500' : 'text-slate-400';
  const bgClass = variant === 'dark'
    ? 'bg-slate-800/50 border-slate-700'
    : 'bg-slate-50 border-slate-200';

  return (
    <div className={`${bgClass} border rounded-xl p-12 text-center`}>
      <div className="flex flex-col items-center max-w-md mx-auto space-y-4">
        <div className={`${iconColorClass} mb-2`}>
          <Icon className="w-16 h-16" strokeWidth={1.5} />
        </div>

        <h3 className={`text-xl font-bold ${textColorClass}`}>
          {title}
        </h3>

        {description && (
          <p className={`${mutedTextClass} text-base`}>
            {description}
          </p>
        )}

        {action && (
          <div className="mt-6">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
