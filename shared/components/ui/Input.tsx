import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn, themeClasses } from '@shared/styles';

/**
 * Props for the Input component.
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label text to display above the input field.
   */
  label?: string;

  /**
   * Error message to display below the input field.
   * When provided, the input will be styled with error colors.
   */
  error?: string;

  /**
   * Helper text to display below the input field when there's no error.
   * Provides additional context or instructions for the input.
   */
  helperText?: string;

  /**
   * Icon or element to display at the start (left) of the input.
   */
  prefixIcon?: ReactNode;

  /**
   * Icon or element to display at the end (right) of the input.
   */
  suffixIcon?: ReactNode;

  /**
   * Additional className for the wrapper div.
   */
  wrapperClassName?: string;

  /**
   * Additional className for the input container div.
   */
  containerClassName?: string;
}

/**
 * Input component for text input fields with label and error handling.
 *
 * A fully accessible input component that handles labels, errors, and helper text.
 * Supports all standard HTML input attributes and provides proper ARIA attributes
 * for accessibility. Now includes support for prefix and suffix icons.
 *
 * @example
 * ```tsx
 * // Basic input with label
 * <Input label="Email" type="email" value={email} onChange={handleChange} />
 *
 * // Input with error
 * <Input
 *   label="Username"
 *   value={username}
 *   onChange={handleChange}
 *   error="Username is required"
 * />
 *
 * // Required input with helper text
 * <Input
 *   label="Full Name"
 *   value={name}
 *   onChange={handleChange}
 *   required
 *   helperText="Enter your first and last name"
 * />
 *
 * // Input with prefix icon
 * <Input
 *   label="Search"
 *   value={query}
 *   onChange={handleChange}
 *   prefixIcon={<Search className="h-5 w-5" />}
 * />
 *
 * // Input with suffix icon
 * <Input
 *   label="Website"
 *   value={url}
 *   onChange={handleChange}
 *   suffixIcon={<ExternalLink className="h-5 w-5" />}
 * />
 *
 * // Disabled input
 * <Input label="ID" value={id} disabled />
 * ```
 *
 * @param props - Input props including label, error, helperText, icons, and all standard input attributes
 * @param ref - Forwarded ref to the input element
 * @returns A styled input field with label, error, helper text, and icon support
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      prefixIcon,
      suffixIcon,
      className = '',
      wrapperClassName = '',
      containerClassName = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className={cn(
            'block text-sm font-medium mb-1',
            error ? 'text-red-700' : 'text-gray-700',
            disabled && 'opacity-60'
          )}>
            {label}
            {props.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
          </label>
        )}

        <div className={cn('relative', containerClassName)}>
          {prefixIcon && (
            <div className={cn(
              'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none',
              error ? 'text-red-500' : 'text-gray-400',
              disabled && 'opacity-50'
            )}>
              {prefixIcon}
            </div>
          )}

          <input
            {...props}
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              themeClasses.input.base,
              error && themeClasses.input.error,
              prefixIcon && 'pl-10',
              suffixIcon && 'pr-10',
              disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId || helperId}
          />

          {suffixIcon && (
            <div className={cn(
              'absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none',
              error ? 'text-red-500' : 'text-gray-400',
              disabled && 'opacity-50'
            )}>
              {suffixIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600 flex items-start" role="alert" aria-live="polite">
            <span className="inline-block mt-0.5 mr-1">⚠</span>
            <span>{error}</span>
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
