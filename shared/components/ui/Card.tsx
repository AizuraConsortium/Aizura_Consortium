import { ReactNode } from 'react';
import { cn, themeClasses } from '@shared/styles/theme';

/**
 * Props for the Card component.
 */
interface CardProps {
  /**
   * Content to display inside the card.
   */
  children: ReactNode;

  /**
   * Additional CSS classes to apply to the card.
   */
  className?: string;

  /**
   * Padding size for the card interior.
   * - `none`: No padding
   * - `sm`: Small padding (1rem)
   * - `md`: Medium padding (1.5rem) - default
   * - `lg`: Large padding (2rem)
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card component for containing and grouping related content.
 *
 * A versatile container component with consistent styling including
 * background, border, border-radius, and shadow. Used throughout
 * the application to group related content visually.
 *
 * @example
 * ```tsx
 * // Basic card with default padding
 * <Card>
 *   <p>Card content goes here</p>
 * </Card>
 *
 * // Card with header and title
 * <Card>
 *   <CardHeader>
 *     <CardTitle>User Profile</CardTitle>
 *   </CardHeader>
 *   <div>Profile content here</div>
 * </Card>
 *
 * // Card with custom padding
 * <Card padding="lg">
 *   <p>Large padding content</p>
 * </Card>
 *
 * // Card with no padding (for full-width elements)
 * <Card padding="none">
 *   <img src="banner.jpg" alt="Banner" className="w-full" />
 * </Card>
 * ```
 *
 * @param props - Card props including padding, className, and children
 * @returns A styled card container element
 */
export function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={cn(themeClasses.card.default, paddingClasses[padding], className)}>
      {children}
    </div>
  );
}

/**
 * Props for the CardHeader component.
 */
interface CardHeaderProps {
  /**
   * Header content (typically CardTitle or other header elements).
   */
  children: ReactNode;

  /**
   * Additional CSS classes to apply to the header.
   */
  className?: string;
}

/**
 * CardHeader component for card title and header content.
 *
 * Optional header section for cards that includes a bottom border
 * to visually separate the header from the main card content.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Settings</CardTitle>
 *   </CardHeader>
 *   <div>Settings content</div>
 * </Card>
 * ```
 *
 * @param props - CardHeader props including className and children
 * @returns A styled header section for cards
 */
export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Props for the CardTitle component.
 */
interface CardTitleProps {
  /**
   * Title text or content.
   */
  children: ReactNode;

  /**
   * Additional CSS classes to apply to the title.
   */
  className?: string;
}

/**
 * CardTitle component for card headings.
 *
 * Renders a semantic h3 heading with consistent styling for card titles.
 * Typically used within CardHeader.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Dashboard Overview</CardTitle>
 *   </CardHeader>
 *   <div>Dashboard content</div>
 * </Card>
 * ```
 *
 * @param props - CardTitle props including className and children
 * @returns A styled h3 heading element
 */
export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}
