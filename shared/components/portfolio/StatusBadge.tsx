/**
 * StatusBadge Component
 *
 * Displays status badges for business status, activity levels, and exposure types
 * with appropriate colors and icons.
 */

import { CheckCircle, Clock, Rocket, Pause, Circle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@shared/styles/theme';
import type { BusinessStatus, ActivityLevel, ExposureType } from '@shared/types/portfolio';

type BadgeVariant = 'success' | 'warning' | 'info' | 'neutral' | 'danger';

interface StatusBadgeProps {
  status?: BusinessStatus;
  activityLevel?: ActivityLevel;
  exposureType?: ExposureType;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface BadgeConfig {
  label: string;
  variant: BadgeVariant;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

function getBusinessStatusConfig(status: BusinessStatus): BadgeConfig {
  switch (status) {
    case 'live':
      return {
        label: 'Live',
        variant: 'success',
        icon: <CheckCircle className="w-3 h-3" />,
      };
    case 'development':
      return {
        label: 'In Development',
        variant: 'info',
        icon: <Rocket className="w-3 h-3" />,
      };
    case 'planning':
      return {
        label: 'Planning',
        variant: 'warning',
        icon: <Clock className="w-3 h-3" />,
      };
    case 'paused':
      return {
        label: 'Paused',
        variant: 'neutral',
        icon: <Pause className="w-3 h-3" />,
      };
  }
}

function getActivityLevelConfig(level: ActivityLevel): BadgeConfig {
  switch (level) {
    case 'high':
      return {
        label: 'High Activity',
        variant: 'success',
        icon: <TrendingUp className="w-3 h-3" />,
      };
    case 'medium':
      return {
        label: 'Medium Activity',
        variant: 'warning',
        icon: <Minus className="w-3 h-3" />,
      };
    case 'low':
      return {
        label: 'Low Activity',
        variant: 'neutral',
        icon: <TrendingDown className="w-3 h-3" />,
      };
  }
}

function getExposureTypeConfig(type: ExposureType): BadgeConfig {
  switch (type) {
    case 'voting':
      return {
        label: 'Voting',
        variant: 'info',
        icon: <Circle className="w-3 h-3 fill-current" />,
      };
    case 'usage':
      return {
        label: 'Usage',
        variant: 'success',
        icon: <Circle className="w-3 h-3 fill-current" />,
      };
    case 'proposal':
      return {
        label: 'Proposal',
        variant: 'warning',
        icon: <Circle className="w-3 h-3 fill-current" />,
      };
    case 'mixed':
      return {
        label: 'Mixed',
        variant: 'info',
        icon: <Circle className="w-3 h-3 fill-current" />,
      };
  }
}

/**
 * StatusBadge displays status indicators for businesses, activities, and exposures
 *
 * @example
 * // Business status
 * <StatusBadge status="live" showIcon />
 *
 * // Activity level
 * <StatusBadge activityLevel="high" />
 *
 * // Exposure type
 * <StatusBadge exposureType="usage" size="sm" />
 */
export function StatusBadge({
  status,
  activityLevel,
  exposureType,
  className,
  showIcon = true,
  size = 'md',
}: StatusBadgeProps) {
  let config: BadgeConfig | null = null;

  if (status) {
    config = getBusinessStatusConfig(status);
  } else if (activityLevel) {
    config = getActivityLevelConfig(activityLevel);
  } else if (exposureType) {
    config = getExposureTypeConfig(exposureType);
  }

  if (!config) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variantStyles[config.variant],
        sizeStyles[size],
        className
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
}

interface StatusBadgeGroupProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * StatusBadgeGroup for displaying multiple badges together
 *
 * @example
 * <StatusBadgeGroup>
 *   <StatusBadge status="live" />
 *   <StatusBadge activityLevel="high" />
 * </StatusBadgeGroup>
 */
export function StatusBadgeGroup({ children, className }: StatusBadgeGroupProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {children}
    </div>
  );
}

interface ProgressBadgeProps {
  progress: number;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ProgressBadge shows development progress percentage
 *
 * @example
 * <ProgressBadge progress={75} label="Development" />
 */
export function ProgressBadge({
  progress,
  label,
  className,
  size = 'md',
}: ProgressBadgeProps) {
  const percentage = Math.min(Math.max(progress, 0), 100);

  let variant: BadgeVariant = 'neutral';
  if (percentage >= 80) {
    variant = 'success';
  } else if (percentage >= 50) {
    variant = 'info';
  } else if (percentage >= 25) {
    variant = 'warning';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-medium rounded-full border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {label && <span>{label}:</span>}
      <span className="font-semibold">{percentage}%</span>
    </span>
  );
}
