import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@shared/styles';
import { useFocusTrap, useEscapeKey } from '@shared/hooks';
import { NavigationLink } from './NavigationLink';
import type { NavigationLink as NavigationLinkType, NavigationVariant, ActiveIndicator } from '@shared/types/navigation';

interface MobileMenuProps {
  /**
   * Array of navigation links
   */
  links: NavigationLinkType[];

  /**
   * Whether the menu is open
   */
  isOpen: boolean;

  /**
   * Callback when menu should close
   */
  onClose: () => void;

  /**
   * Function to check if a link is active
   */
  isActive: (path: string) => boolean;

  /**
   * Visual variant for styling
   */
  variant: NavigationVariant;

  /**
   * Active indicator style
   */
  activeIndicator: ActiveIndicator;
}

/**
 * MobileMenu component for responsive navigation
 *
 * A slide-out drawer menu for mobile devices with:
 * - Smooth slide animation from top
 * - Focus trap to keep keyboard navigation within menu
 * - ESC key to close
 * - Backdrop overlay
 * - Accessibility features
 *
 * @param props - MobileMenu props
 * @returns A mobile navigation drawer
 */
export function MobileMenu({
  links,
  isOpen,
  onClose,
  isActive,
  variant,
  activeIndicator,
}: MobileMenuProps) {
  const containerRef = useFocusTrap(isOpen);
  useEscapeKey(onClose, isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
    }, 0);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose, containerRef]);

  if (!isOpen) return null;

  const variantClasses = {
    light: 'bg-white border-slate-200',
    dark: 'bg-slate-900/95 backdrop-blur-sm border-slate-700/50',
    minimal: 'bg-white border-slate-200',
  };

  const headerClasses = {
    light: 'text-slate-900 border-slate-200',
    dark: 'text-white border-slate-700/50',
    minimal: 'text-slate-900 border-slate-200',
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        aria-hidden="true"
      />

      <div
        ref={containerRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={cn(
          'fixed inset-x-0 top-0 z-50 md:hidden border-b transition-transform duration-300',
          variantClasses[variant],
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div className={cn('flex items-center justify-between px-4 py-4 border-b', headerClasses[variant])}>
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg transition-colors',
              variant === 'dark'
                ? 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            )}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="px-4 py-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
          {links.map((link) => (
            <NavigationLink
              key={link.id}
              link={link}
              isActive={isActive(link.path)}
              variant={variant}
              activeIndicator={activeIndicator}
              isMobile
              onClick={onClose}
            />
          ))}
        </nav>
      </div>
    </>
  );
}
