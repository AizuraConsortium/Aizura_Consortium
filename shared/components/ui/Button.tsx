import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn, themeClasses } from '@shared/styles/theme';

/**
 * Props for the Button component.
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant of the button.
   * - `primary`: Blue background for main actions (default)
   * - `secondary`: Gray background for secondary actions
   * - `danger`: Red background for destructive actions
   * - `ghost`: Transparent background for subtle actions
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';

  /**
   * Size of the button.
   * - `sm`: Small padding and text
   * - `md`: Medium padding and text (default)
   * - `lg`: Large padding and text
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the button is in a loading state.
   * When true, shows a spinner and disables the button.
   */
  loading?: boolean;

  /**
   * Content to display inside the button.
   */
  children: ReactNode;
}

/**
 * Button component with multiple variants, sizes, and loading states.
 *
 * This is the primary button component used across all applications.
 * It supports different visual styles, sizes, and states including loading.
 *
 * @example
 * ```tsx
 * // Primary button (default)
 * <Button onClick={handleSubmit}>Submit</Button>
 *
 * // Secondary button
 * <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
 *
 * // Danger button for destructive actions
 * <Button variant="danger" onClick={handleDelete}>Delete</Button>
 *
 * // Ghost button for subtle actions
 * <Button variant="ghost" onClick={handleEdit}>Edit</Button>
 *
 * // Different sizes
 * <Button size="sm">Small</Button>
 * <Button size="md">Medium</Button>
 * <Button size="lg">Large</Button>
 *
 * // Loading state
 * <Button loading={isSubmitting}>Submit</Button>
 *
 * // Disabled state
 * <Button disabled>Disabled</Button>
 * ```
 *
 * @param props - Button props including variant, size, loading, and all standard button attributes
 * @returns A styled button element
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: themeClasses.button.primary,
    secondary: themeClasses.button.secondary,
    danger: themeClasses.button.danger,
    ghost: themeClasses.button.ghost,
  };

  const sizeClasses = {
    sm: themeClasses.button.sizes.sm,
    md: themeClasses.button.sizes.md,
    lg: themeClasses.button.sizes.lg,
  };

  return (
    <button
      className={cn(
        themeClasses.button.base,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
