import { Link } from 'react-router-dom';
import { cn } from '@shared/styles/theme';
import type { NavigationLink as NavigationLinkType, NavigationVariant, ActiveIndicator } from '@shared/types/navigation';

interface NavigationLinkProps {
  /**
   * Link configuration
   */
  link: NavigationLinkType;

  /**
   * Whether this link is currently active
   */
  isActive: boolean;

  /**
   * Visual variant for styling
   */
  variant: NavigationVariant;

  /**
   * Active indicator style
   */
  activeIndicator: ActiveIndicator;

  /**
   * Whether this is a mobile link (larger touch targets)
   */
  isMobile?: boolean;

  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * NavigationLink component for individual navigation items
 *
 * Handles styling, active states, icons, and badges for navigation links.
 * Supports different visual variants and active indicators.
 *
 * @param props - NavigationLink props
 * @returns A styled navigation link with icon and badge support
 */
export function NavigationLink({
  link,
  isActive,
  variant,
  activeIndicator,
  isMobile = false,
  onClick,
}: NavigationLinkProps) {
  const baseClasses = cn(
    'flex items-center space-x-2 px-4 rounded-lg transition-colors font-medium',
    isMobile ? 'py-3 text-lg space-x-3' : 'py-2',
    link.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
  );

  const variantClasses = {
    light: isActive
      ? 'bg-blue-50 text-blue-700 border border-blue-200'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
    dark: isActive
      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
      : 'text-slate-300 hover:text-white hover:bg-slate-700/50',
    minimal: isActive
      ? 'text-blue-600 font-semibold'
      : 'text-slate-600 hover:text-slate-900',
  };

  const indicatorClasses = {
    underline: isActive ? 'border-b-2 border-current rounded-none' : '',
    background: '',
    border: '',
  };

  const linkClasses = cn(
    baseClasses,
    variantClasses[variant],
    indicatorClasses[activeIndicator],
    link.highlighted && !isActive && 'text-blue-600 font-semibold'
  );

  const content = (
    <>
      {link.icon && (
        <span className={cn('shrink-0', isMobile ? 'w-5 h-5' : 'w-4 h-4')} aria-hidden="true">
          {link.icon}
        </span>
      )}
      <span>{link.label}</span>
      {link.badge && (
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-semibold rounded-full',
            variant === 'dark'
              ? 'bg-cyan-500/30 text-cyan-300'
              : 'bg-blue-100 text-blue-700'
          )}
          aria-label={`${link.badge} notifications`}
        >
          {link.badge}
        </span>
      )}
    </>
  );

  const handleClick = () => {
    if (link.onClick) {
      link.onClick();
    }
    if (onClick) {
      onClick();
    }
  };

  if (link.onClick && !link.path) {
    return (
      <button
        onClick={handleClick}
        className={linkClasses}
        aria-label={link.ariaLabel || link.label}
        aria-current={isActive ? 'page' : undefined}
        disabled={link.disabled}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={link.path}
      onClick={handleClick}
      className={linkClasses}
      aria-label={link.ariaLabel || link.label}
      aria-current={isActive ? 'page' : undefined}
    >
      {content}
    </Link>
  );
}
