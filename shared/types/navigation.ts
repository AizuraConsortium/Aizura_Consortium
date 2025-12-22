import { ReactNode } from 'react';

/**
 * Navigation link configuration
 */
export interface NavigationLink {
  /**
   * Unique identifier for the link
   */
  id: string;

  /**
   * Display label for the link
   */
  label: string;

  /**
   * Path or URL to navigate to
   */
  path: string;

  /**
   * Optional icon to display alongside the label
   */
  icon?: ReactNode;

  /**
   * Optional badge content (e.g., notification count)
   */
  badge?: string | number;

  /**
   * Whether the link should be highlighted
   */
  highlighted?: boolean;

  /**
   * Custom ARIA label for accessibility
   */
  ariaLabel?: string;

  /**
   * Whether the link is disabled
   */
  disabled?: boolean;

  /**
   * Custom click handler (if not using default navigation)
   */
  onClick?: () => void;
}

/**
 * Brand/logo configuration for navigation
 */
export interface NavigationBrand {
  /**
   * Brand name/title
   */
  name: string;

  /**
   * Optional icon/logo
   */
  icon?: ReactNode;

  /**
   * Click handler for the brand (usually navigates to home)
   */
  onClick?: () => void;

  /**
   * Custom ARIA label
   */
  ariaLabel?: string;
}

/**
 * Navigation visual variants
 */
export type NavigationVariant = 'light' | 'dark' | 'minimal';

/**
 * Active link indicator styles
 */
export type ActiveIndicator = 'underline' | 'background' | 'border';

/**
 * Navigation position modes
 */
export type NavigationPosition = 'static' | 'sticky' | 'fixed';

/**
 * Responsive breakpoints
 */
export type MobileBreakpoint = 'sm' | 'md' | 'lg';

/**
 * Complete navigation configuration
 */
export interface NavigationConfig {
  /**
   * Brand/logo configuration
   */
  brand: NavigationBrand;

  /**
   * Array of navigation links
   */
  links: NavigationLink[];

  /**
   * Visual variant of the navigation
   * @default 'light'
   */
  variant?: NavigationVariant;

  /**
   * Breakpoint at which to show mobile menu
   * @default 'md'
   */
  mobileBreakpoint?: MobileBreakpoint;

  /**
   * Active link indicator style
   * @default 'background'
   */
  activeIndicator?: ActiveIndicator;

  /**
   * Navigation position mode
   * @default 'static'
   */
  position?: NavigationPosition;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom render function for additional nav items (e.g., user menu)
   */
  renderExtra?: () => ReactNode;
}
