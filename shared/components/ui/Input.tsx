import { InputHTMLAttributes, forwardRef } from 'react';
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
}

/**
 * Input component for text input fields with label and error handling.
 *
 * A fully accessible input component that handles labels, errors, and helper text.
 * Supports all standard HTML input attributes and provides proper ARIA attributes
 * for accessibility.
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
 * // Disabled input
 * <Input label="ID" value={id} disabled />
 * ```
 *
 * @param props - Input props including label, error, helperText, and all standard input attributes
 * @param ref - Forwarded ref to the input element
 * @returns A styled input field with label, error, and helper text support
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          {...props}
          ref={ref}
          id={inputId}
          className={cn(
            themeClasses.input.base,
            error && themeClasses.input.error,
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId || helperId}
        />
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
            {error}
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
