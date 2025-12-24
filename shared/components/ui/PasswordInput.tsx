import { useState, forwardRef, InputHTMLAttributes, useMemo } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { cn, themeClasses } from '@shared/styles/theme';

/**
 * Password strength levels
 */
export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

/**
 * Password validation rule
 */
export interface PasswordRule {
  label: string;
  test: (password: string) => boolean;
}

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

  /**
   * Whether to show the password strength indicator.
   * @default false
   */
  showStrength?: boolean;

  /**
   * Custom validation rules to display.
   * When provided, shows a checklist of requirements.
   */
  validationRules?: PasswordRule[];

  /**
   * Whether to show validation feedback while typing.
   * @default false
   */
  showValidation?: boolean;

  /**
   * Additional className for the wrapper div.
   */
  wrapperClassName?: string;
}

/**
 * Calculate password strength based on various criteria
 */
function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) return 'weak';

  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score === 3) return 'good';
  return 'strong';
}

/**
 * Get color classes for password strength
 */
function getStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'fair':
      return 'bg-orange-500';
    case 'good':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-green-500';
  }
}

/**
 * Get text color classes for password strength
 */
function getStrengthTextColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'text-red-600';
    case 'fair':
      return 'text-orange-600';
    case 'good':
      return 'text-yellow-600';
    case 'strong':
      return 'text-green-600';
  }
}

/**
 * PasswordInput component for password fields with show/hide toggle.
 *
 * An accessible password input that includes a toggle button to show or hide
 * the password text. Supports all standard input features including labels,
 * errors, and helper text. Can display password strength indicator and
 * validation rules checklist.
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
 * // Password input with strength indicator
 * <PasswordInput
 *   label="New Password"
 *   value={password}
 *   onChange={handleChange}
 *   showStrength
 * />
 *
 * // Password input with validation rules
 * <PasswordInput
 *   label="Create Password"
 *   value={password}
 *   onChange={handleChange}
 *   showValidation
 *   validationRules={[
 *     { label: 'At least 8 characters', test: (p) => p.length >= 8 },
 *     { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
 *     { label: 'Contains number', test: (p) => /\d/.test(p) },
 *   ]}
 * />
 *
 * // Password input with error
 * <PasswordInput
 *   label="Confirm Password"
 *   value={confirmPassword}
 *   onChange={handleChange}
 *   error="Passwords do not match"
 * />
 * ```
 *
 * @param props - PasswordInput props including label, error, helperText, showToggle, showStrength, and standard input attributes
 * @param ref - Forwarded ref to the input element
 * @returns A styled password input with show/hide toggle and optional strength/validation feedback
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      error,
      helperText,
      showToggle = true,
      showStrength = false,
      validationRules,
      showValidation = false,
      className = '',
      wrapperClassName = '',
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = props.id || 'password-input';
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const togglePassword = () => setShowPassword(!showPassword);

    const passwordValue = typeof value === 'string' ? value : '';
    const strength = useMemo(() => calculatePasswordStrength(passwordValue), [passwordValue]);

    const validationResults = useMemo(() => {
      if (!validationRules) return [];
      return validationRules.map((rule) => ({
        ...rule,
        passed: rule.test(passwordValue),
      }));
    }, [validationRules, passwordValue]);

    const showValidationFeedback = showValidation && validationRules && passwordValue.length > 0;

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

        <div className="relative">
          <input
            {...props}
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            value={value}
            disabled={disabled}
            className={cn(
              themeClasses.input.base,
              error && themeClasses.input.error,
              showToggle && 'pr-10',
              disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId || helperId}
          />
          {showToggle && (
            <button
              type="button"
              onClick={togglePassword}
              disabled={disabled}
              className={cn(
                'absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded',
                disabled && 'opacity-50 cursor-not-allowed hover:text-gray-500'
              )}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        {showStrength && passwordValue.length > 0 && (
          <div className="mt-2" role="status" aria-live="polite">
            <div className="flex gap-1 mb-1">
              {['weak', 'fair', 'good', 'strong'].map((level, index) => (
                <div
                  key={level}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    ['weak', 'fair', 'good', 'strong'].indexOf(strength) >= index
                      ? getStrengthColor(strength)
                      : 'bg-gray-200'
                  )}
                />
              ))}
            </div>
            <p className={cn('text-xs font-medium', getStrengthTextColor(strength))}>
              Password strength: {strength}
            </p>
          </div>
        )}

        {showValidationFeedback && (
          <div className="mt-2 space-y-1" role="status" aria-live="polite">
            {validationResults.map((result, index) => (
              <div key={index} className="flex items-center text-xs">
                {result.passed ? (
                  <Check className="h-3.5 w-3.5 text-green-600 mr-1.5 shrink-0" aria-hidden="true" />
                ) : (
                  <X className="h-3.5 w-3.5 text-gray-400 mr-1.5 shrink-0" aria-hidden="true" />
                )}
                <span className={result.passed ? 'text-green-700' : 'text-gray-600'}>
                  {result.label}
                </span>
              </div>
            ))}
          </div>
        )}

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

PasswordInput.displayName = 'PasswordInput';
