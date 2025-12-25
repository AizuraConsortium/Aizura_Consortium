import { ReactNode } from 'react';
import { Crown, Star, Shield, LucideIcon } from 'lucide-react';
import { cn } from '@shared/styles/theme';

interface BadgeProps {
  variant: 'tier' | 'achievement' | 'status' | 'label';
  tier?: 1 | 2 | 3;
  label?: string;
  icon?: LucideIcon;
  tooltip?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const iconSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

function getTierConfig(tier: 1 | 2 | 3): { icon: LucideIcon; color: string; label: string } {
  switch (tier) {
    case 1:
      return {
        icon: Crown,
        color: 'bg-yellow-500 text-white',
        label: 'Gold',
      };
    case 2:
      return {
        icon: Star,
        color: 'bg-gray-400 text-white',
        label: 'Silver',
      };
    case 3:
      return {
        icon: Shield,
        color: 'bg-amber-700 text-white',
        label: 'Bronze',
      };
  }
}

export function Badge({
  variant,
  tier,
  label,
  icon: IconComponent,
  tooltip,
  size = 'md',
  className = '',
  children,
}: BadgeProps) {
  let content: ReactNode = null;
  let badgeClasses = cn(
    'inline-flex items-center justify-center gap-1 rounded-full font-medium',
    sizeClasses[size],
    className
  );

  if (variant === 'tier' && tier) {
    const tierConfig = getTierConfig(tier);
    const TierIcon = tierConfig.icon;

    badgeClasses = cn(badgeClasses, tierConfig.color);
    content = (
      <>
        <TierIcon className={iconSizeClasses[size]} />
        <span>{label || tierConfig.label}</span>
      </>
    );
  } else if (variant === 'achievement') {
    badgeClasses = cn(badgeClasses, 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300');
    content = (
      <>
        {IconComponent && <IconComponent className={iconSizeClasses[size]} />}
        <span>{label || children}</span>
      </>
    );
  } else if (variant === 'status') {
    badgeClasses = cn(badgeClasses, 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300');
    content = (
      <>
        {IconComponent && <IconComponent className={iconSizeClasses[size]} />}
        <span>{label || children}</span>
      </>
    );
  } else if (variant === 'label') {
    badgeClasses = cn(badgeClasses, 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300');
    content = (
      <>
        {IconComponent && <IconComponent className={iconSizeClasses[size]} />}
        <span>{label || children}</span>
      </>
    );
  }

  const badge = (
    <span className={badgeClasses} role="status" aria-label={label || tooltip}>
      {content}
    </span>
  );

  if (tooltip) {
    return (
      <span title={tooltip} className="inline-block">
        {badge}
      </span>
    );
  }

  return badge;
}
