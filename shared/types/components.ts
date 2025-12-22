/**
 * Common component type definitions shared across all applications.
 * These types ensure consistency in component props and behavior.
 */

/**
 * Standard size options for components like buttons, inputs, spinners, etc.
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Button variant types for different visual styles and semantic meanings.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/**
 * Card padding options for different content densities.
 */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Toast notification types for different message severities.
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Theme mode options (currently not fully implemented but reserved for future use).
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Common props that many components accept for styling and accessibility.
 */
export interface CommonComponentProps {
  /**
   * Additional CSS classes to apply to the component.
   */
  className?: string;

  /**
   * Inline styles to apply to the component.
   */
  style?: React.CSSProperties;

  /**
   * Accessible label for screen readers.
   */
  'aria-label'?: string;

  /**
   * ID of element that labels this component.
   */
  'aria-labelledby'?: string;

  /**
   * ID of element that describes this component.
   */
  'aria-describedby'?: string;
}

/**
 * Props for components that can be disabled.
 */
export interface DisableableProps {
  /**
   * Whether the component is disabled and cannot be interacted with.
   */
  disabled?: boolean;
}

/**
 * Props for components that can show a loading state.
 */
export interface LoadableProps {
  /**
   * Whether the component is in a loading state.
   */
  loading?: boolean;
}

/**
 * Props for components that accept children.
 */
export interface ChildrenProps {
  /**
   * Child elements to render inside the component.
   */
  children: React.ReactNode;
}

/**
 * Props for form input components with error handling.
 */
export interface FormInputProps extends CommonComponentProps {
  /**
   * Label text for the input field.
   */
  label: string;

  /**
   * Error message to display below the input.
   */
  error?: string;

  /**
   * Help text to display below the input.
   */
  helpText?: string;

  /**
   * Whether the field is required.
   */
  required?: boolean;
}

/**
 * Props for clickable components like buttons and links.
 */
export interface ClickableProps {
  /**
   * Click event handler.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Standard status types used across the application.
 */
export type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Health status for system components.
 */
export type HealthStatus = 'healthy' | 'degraded' | 'down';

/**
 * Alignment options for components.
 */
export type Alignment = 'left' | 'center' | 'right';

/**
 * Position options for popovers, tooltips, etc.
 */
export type Position = 'top' | 'right' | 'bottom' | 'left';

/**
 * Standard color options for badges, alerts, etc.
 */
export type SemanticColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
