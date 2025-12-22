import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Navigation state management hook
 *
 * Provides utilities for managing navigation state including:
 * - Active link detection based on current route
 * - Mobile menu open/close state
 * - Keyboard navigation support
 *
 * @example
 * ```tsx
 * const { isActive, mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useNavigation();
 *
 * <button onClick={toggleMobileMenu}>Menu</button>
 * {mobileMenuOpen && <MobileMenu onClose={closeMobileMenu} />}
 * ```
 *
 * @returns Navigation state and control functions
 */
export function useNavigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Check if a given path matches the current location
   * Supports exact matching and prefix matching
   */
  const isActive = useCallback(
    (path: string, exact: boolean = true): boolean => {
      if (exact) {
        return location.pathname === path;
      }
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  /**
   * Toggle mobile menu open/closed
   */
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  /**
   * Close mobile menu
   */
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  /**
   * Open mobile menu
   */
  const openMobileMenu = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  /**
   * Close mobile menu when route changes
   */
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  /**
   * Prevent body scroll when mobile menu is open
   */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return {
    isActive,
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu,
    currentPath: location.pathname,
  };
}
