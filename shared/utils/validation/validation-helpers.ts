/**
 * Validation Helpers
 *
 * Utility functions for validation including sanitization, composition,
 * and async validation support.
 */

import type { ValidationResult } from './field-validators';

/**
 * Sanitization Helpers
 */

export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function removeNonAlphanumeric(text: string): string {
  return text.replace(/[^a-zA-Z0-9]/g, '');
}

export function removeSpecialCharacters(text: string): string {
  return text.replace(/[^a-zA-Z0-9\s-_]/g, '');
}

/**
 * String Transformation
 */

export function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validation Composition
 */

export function composeValidators<T>(
  ...validators: Array<(value: T) => ValidationResult>
): (value: T) => ValidationResult {
  return (value: T): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true, error: null };
  };
}

export function createValidator<T>(
  validate: (value: T) => boolean,
  errorMessage: string | ((value: T) => string)
): (value: T) => ValidationResult {
  return (value: T): ValidationResult => {
    const isValid = validate(value);
    if (!isValid) {
      const message = typeof errorMessage === 'function'
        ? errorMessage(value)
        : errorMessage;
      return { isValid: false, error: message };
    }
    return { isValid: true, error: null };
  };
}

/**
 * Async Validation
 */

export async function validateAsync<T>(
  value: T,
  validator: (value: T) => Promise<boolean>,
  errorMessage: string
): Promise<ValidationResult> {
  try {
    const isValid = await validator(value);
    if (!isValid) {
      return { isValid: false, error: errorMessage };
    }
    return { isValid: true, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : errorMessage
    };
  }
}

export async function composeAsyncValidators<T>(
  value: T,
  ...validators: Array<(value: T) => Promise<ValidationResult>>
): Promise<ValidationResult> {
  for (const validator of validators) {
    const result = await validator(value);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true, error: null };
}

/**
 * Conditional Validation
 */

export function validateWhen<T>(
  condition: boolean | ((value: T) => boolean),
  validator: (value: T) => ValidationResult
): (value: T) => ValidationResult {
  return (value: T): ValidationResult => {
    const shouldValidate = typeof condition === 'function'
      ? condition(value)
      : condition;

    if (!shouldValidate) {
      return { isValid: true, error: null };
    }

    return validator(value);
  };
}

export function validateUnless<T>(
  condition: boolean | ((value: T) => boolean),
  validator: (value: T) => ValidationResult
): (value: T) => ValidationResult {
  return (value: T): ValidationResult => {
    const shouldSkip = typeof condition === 'function'
      ? condition(value)
      : condition;

    if (shouldSkip) {
      return { isValid: true, error: null };
    }

    return validator(value);
  };
}

/**
 * Validation Result Helpers
 */

export function collectErrors(results: ValidationResult[]): string[] {
  return results
    .filter(result => !result.isValid && result.error)
    .map(result => result.error!);
}

export function isAllValid(results: ValidationResult[]): boolean {
  return results.every(result => result.isValid);
}

export function getFirstError(results: ValidationResult[]): string | null {
  const firstInvalid = results.find(result => !result.isValid);
  return firstInvalid?.error || null;
}

export function combineValidationResults(
  results: ValidationResult[]
): ValidationResult {
  const errors = collectErrors(results);

  if (errors.length === 0) {
    return { isValid: true, error: null };
  }

  return {
    isValid: false,
    error: errors.join('; ')
  };
}

/**
 * Debounced Validation
 */

export function debounceValidation<T>(
  validator: (value: T) => ValidationResult,
  delay: number = 300
): (value: T) => Promise<ValidationResult> {
  let timeoutId: NodeJS.Timeout | null = null;

  return (value: T): Promise<ValidationResult> => {
    return new Promise((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const result = validator(value);
        resolve(result);
      }, delay);
    });
  };
}

/**
 * Value Coercion
 */

export function coerceToString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

export function coerceToNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

export function coerceToBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
}

/**
 * Array Validation
 */

export function validateArray<T>(
  items: T[],
  itemValidator: (item: T, index: number) => ValidationResult
): { isValid: boolean; errors: Array<{ index: number; error: string }> } {
  const errors: Array<{ index: number; error: string }> = [];

  items.forEach((item, index) => {
    const result = itemValidator(item, index);
    if (!result.isValid && result.error) {
      errors.push({ index, error: result.error });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateArrayMinLength<T>(
  items: T[],
  minLength: number,
  fieldName: string
): ValidationResult {
  if (items.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must contain at least ${minLength} ${minLength === 1 ? 'item' : 'items'}`
    };
  }
  return { isValid: true, error: null };
}

export function validateArrayMaxLength<T>(
  items: T[],
  maxLength: number,
  fieldName: string
): ValidationResult {
  if (items.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must contain ${maxLength} ${maxLength === 1 ? 'item' : 'items'} or fewer`
    };
  }
  return { isValid: true, error: null };
}
