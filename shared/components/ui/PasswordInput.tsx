import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn, themeClasses } from '@shared/styles';

/**
 * Props for the PasswordInput component.
 */
interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Label text to display above the password field.
   */
  label?: string;

  /**
   * Error message to display below the password field.
   * When provided, the input will be styled with error colors.
   */
  error?: string;

  /**
   * Helper text to display below the password field when there's no error.
   */
  helperText?: string;

  /**
   * Whether to show the password visibility toggle button.
   * @default true
   */
  showToggle?: boolean;
}

/**
 * PasswordInput component for password fields with show/hide toggle.
 *
 * An accessible password input that includes a toggle button to show or hide
 * the password text. Supports all standard input features including labels,
 * errors, and helper text.
 *
 * @example
 * ```tsx
 * // Basic password input
 * <PasswordInput
 *   label="Password"
 *   value={password}
 *   onChange={handleChange}
 * />
 *
 * // Password input with error
 * <PasswordInput
 *   label="Confirm Password"
 *   value={confirmPassword}
 *   onChange={handleChange}
 *   error="Passwords do not match"
 * />
 *
 * // Required password with helper text
 * <PasswordInput
 *   label="New Password"
 *   value={newPassword}
 *   onChange={handleChange}
 *   required
 *   helperText="Must be at least 8 characters"
 * />
 *
 * // Without show/hide toggle
 * <PasswordInput
 *   label="Password"
 *   value={password}
 *   onChange={handleChange}
 *   showToggle={false}
 * />
 * ```
 *
 * @param props - PasswordInput props including label, error, helperText, showToggle, and standard input attributes
 * @param ref - Forwarded ref to the input element
 * @returns A styled password input with show/hide toggle functionality
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helperText, showToggle = true, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = props.id || 'password-input';
    const errorId = error ? `${inputId}-error` : undefined;

    const togglePassword = () => setShowPassword(!showPassword);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            {...props}
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              themeClasses.input.base,
              error && themeClasses.input.error,
              showToggle && 'pr-10',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId}
          />
          {showToggle && (
            <button
              type="button"
              onClick={togglePassword}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
