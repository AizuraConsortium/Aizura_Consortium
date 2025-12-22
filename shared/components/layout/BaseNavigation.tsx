import { Menu } from 'lucide-react';
import { cn } from '@shared/styles';
import { useNavigation } from '@shared/hooks/useNavigation';
import { NavigationLink } from './NavigationLink';
import { MobileMenu } from './MobileMenu';
import type { NavigationConfig } from '@shared/types/navigation';

/**
 * BaseNavigation component - Flexible, reusable navigation system
 *
 * A comprehensive navigation component that provides:
 * - Responsive design with mobile menu
 * - Multiple visual variants (light, dark, minimal)
 * - Flexible positioning (static, sticky, fixed)
 * - Active state management
 * - Customizable active indicators
 * - Icon and badge support
 * - Full accessibility (ARIA, keyboard navigation)
 * - Smooth transitions and animations
 *
 * @example
 * ```tsx
 * // Basic light navigation
 * <BaseNavigation
 *   brand={{ name: 'My App', icon: <Logo /> }}
 *   links={[
 *     { id: '1', label: 'Home', path: '/', icon: <Home /> },
 *     { id: '2', label: 'About', path: '/about', icon: <Info /> },
 *   ]}
 * />
 *
 * // Dark themed sticky navigation
 * <BaseNavigation
 *   brand={{ name: 'Dashboard', onClick: () => navigate('/') }}
 *   links={links}
 *   variant="dark"
 *   position="sticky"
 *   activeIndicator="border"
 * />
 *
 * // Minimal navigation with custom extra content
 * <BaseNavigation
 *   brand={{ name: 'Site' }}
 *   links={links}
 *   variant="minimal"
 *   renderExtra={() => <UserMenu />}
 * />
 * ```
 *
 * @param config - Navigation configuration object
 * @returns A fully-featured navigation bar with mobile support
 */
export function BaseNavigation({
  brand,
  links,
  variant = 'light',
  mobileBreakpoint = 'md',
  activeIndicator = 'background',
  position = 'static',
  className,
  renderExtra,
}: NavigationConfig) {
  const { isActive, mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useNavigation();

  const positionClasses = {
    static: '',
    sticky: 'sticky top-0 z-30',
    fixed: 'fixed top-0 inset-x-0 z-30',
  };

  const variantClasses = {
    light: 'bg-white border-b border-slate-200',
    dark: 'bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50',
    minimal: 'bg-transparent',
  };

  const brandClasses = {
    light: 'text-slate-900 hover:opacity-80',
    dark: 'text-white hover:opacity-80',
    minimal: 'text-slate-900 hover:opacity-80',
  };

  const mobileButtonClasses = {
    light: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
    dark: 'text-slate-300 hover:text-white hover:bg-slate-700/50',
    minimal: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
  };

  const breakpointClasses = {
    sm: { hide: 'sm:hidden', show: 'hidden sm:flex' },
    md: { hide: 'md:hidden', show: 'hidden md:flex' },
    lg: { hide: 'lg:hidden', show: 'hidden lg:flex' },
  };

  const handleBrandClick = () => {
    if (brand.onClick) {
      brand.onClick();
    }
  };

  return (
    <nav
      className={cn(positionClasses[position], variantClasses[variant], className)}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 py-4">
          {brand.onClick ? (
            <button
              onClick={handleBrandClick}
              className={cn(
                'flex items-center space-x-2 sm:space-x-3 transition-opacity',
                brandClasses[variant]
              )}
              aria-label={brand.ariaLabel || `Go to ${brand.name}`}
            >
              {brand.icon && (
                <span className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true">
                  {brand.icon}
                </span>
              )}
              <h1 className="text-lg sm:text-2xl font-bold">{brand.name}</h1>
            </button>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              {brand.icon && (
                <span className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true">
                  {brand.icon}
                </span>
              )}
              <h1 className="text-lg sm:text-2xl font-bold">{brand.name}</h1>
            </div>
          )}

          <div className={cn('items-center space-x-2', breakpointClasses[mobileBreakpoint].show)}>
            {links.map((link) => (
              <NavigationLink
                key={link.id}
                link={link}
                isActive={isActive(link.path)}
                variant={variant}
                activeIndicator={activeIndicator}
              />
            ))}
            {renderExtra && <div className="ml-4">{renderExtra()}</div>}
          </div>

          <button
            onClick={toggleMobileMenu}
            className={cn(
              'p-2 rounded-lg transition-colors',
              breakpointClasses[mobileBreakpoint].hide,
              mobileButtonClasses[variant]
            )}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu
        links={links}
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        isActive={isActive}
        variant={variant}
        activeIndicator={activeIndicator}
      />
    </nav>
  );
}
