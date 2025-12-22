import { ReactNode } from 'react';
import { cn } from '@shared/styles';
import { AlertCircle } from 'lucide-react';

/**
 * Character count configuration for form fields
 */
export interface CharacterCount {
  current: number;
  max: number;
  showWarning?: boolean;
  warningThreshold?: number;
}

/**
 * Props for the FormField component
 */
interface FormFieldProps {
  /**
   * Label text to display above the field
   */
  label: string;

  /**
   * ID of the form element this label is for
   */
  htmlFor: string;

  /**
   * Error message to display below the field
   */
  error?: string;

  /**
   * Helper text to display below the field when there's no error
   */
  helperText?: string;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Additional className for the wrapper div
   */
  className?: string;

  /**
   * The form input/textarea element
   */
  children: ReactNode;

  /**
   * Character count configuration
   * Shows current/max count and optional warning when approaching limit
   */
  characterCount?: CharacterCount;

  /**
   * Whether the field is disabled
   */
  disabled?: boolean;

  /**
   * Whether to show error icon alongside error text
   * @default true
   */
  showErrorIcon?: boolean;
}

/**
 * FormField component for wrapping form inputs with labels, errors, and helper text.
 *
 * A flexible wrapper component that provides consistent styling and accessibility
 * for form fields. Supports character counting for text areas and proper error handling.
 *
 * @example
 * ```tsx
 * // Basic form field with input
 * <FormField label="Username" htmlFor="username">
 *   <input id="username" type="text" value={username} onChange={handleChange} />
 * </FormField>
 *
 * // Form field with error
 * <FormField
 *   label="Email"
 *   htmlFor="email"
 *   error="Invalid email address"
 * >
 *   <input id="email" type="email" value={email} onChange={handleChange} />
 * </FormField>
 *
 * // Form field with character count
 * <FormField
 *   label="Description"
 *   htmlFor="description"
 *   characterCount={{ current: description.length, max: 500 }}
 *   helperText="Describe your project in detail"
 * >
 *   <textarea id="description" value={description} onChange={handleChange} />
 * </FormField>
 *
 * // Required field with custom warning threshold
 * <FormField
 *   label="Bio"
 *   htmlFor="bio"
 *   required
 *   characterCount={{
 *     current: bio.length,
 *     max: 200,
 *     showWarning: true,
 *     warningThreshold: 0.8
 *   }}
 * >
 *   <textarea id="bio" value={bio} onChange={handleChange} />
 * </FormField>
 * ```
 *
 * @param props - FormField props
 * @returns A wrapped form field with label, error handling, and optional character count
 */
export function FormField({
  label,
  htmlFor,
  error,
  helperText,
  required,
  className,
  children,
  characterCount,
  disabled,
  showErrorIcon = true,
}: FormFieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const helperId = helperText ? `${htmlFor}-helper` : undefined;

  const warningThreshold = characterCount?.warningThreshold ?? 0.9;
  const showWarning = characterCount?.showWarning !== false;
  const isNearLimit = characterCount
    ? characterCount.current > characterCount.max * warningThreshold
    : false;
  const isOverLimit = characterCount
    ? characterCount.current > characterCount.max
    : false;

  const getCharCountColor = () => {
    if (!characterCount) return 'text-gray-500';
    if (isOverLimit) return 'text-red-600';
    if (isNearLimit && showWarning) return 'text-orange-600';
    if (error) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className={cn('w-full', className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          'flex items-center justify-between text-sm font-medium mb-1',
          error ? 'text-red-700' : 'text-gray-700',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        <span>
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </span>

        {characterCount && (
          <span
            className={cn('text-xs font-medium transition-colors', getCharCountColor())}
            role="status"
            aria-live="polite"
            aria-label={`${characterCount.current} of ${characterCount.max} characters used`}
          >
            {characterCount.current}/{characterCount.max}
          </span>
        )}
      </label>

      {children}

      {error && (
        <div
          id={errorId}
          className="mt-1 flex items-start text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {showErrorIcon && (
            <AlertCircle className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
          )}
          <span>{error}</span>
        </div>
      )}

      {helperText && !error && (
        <p id={helperId} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}

      {isOverLimit && characterCount && (
        <p className="mt-1 text-xs text-red-600 font-medium" role="alert" aria-live="polite">
          Character limit exceeded by {characterCount.current - characterCount.max}
        </p>
      )}
    </div>
  );
}
