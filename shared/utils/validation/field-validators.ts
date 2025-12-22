/**
 * Field Validators
 *
 * Field-level validation functions that return structured validation results
 * with clear error messages. Use these for form validation and user input.
 */

import {
  isEmpty,
  isValidEmail,
  isValidUrl,
  isValidUUID,
  hasMinLength,
  hasMaxLength,
  isInRange,
  matchesPattern
} from './base-validators';

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Generic Field Validators
 */

export function validateRequired(
  value: unknown,
  fieldName: string = 'Field'
): ValidationResult {
  if (isEmpty(value)) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }
  return { isValid: true, error: null };
}

export function validateEmail(email: string): ValidationResult {
  if (isEmpty(email)) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }
  if (!isValidEmail(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }
  return { isValid: true, error: null };
}

export function validateUrl(url: string): ValidationResult {
  if (isEmpty(url)) {
    return {
      isValid: false,
      error: 'URL is required'
    };
  }
  if (!isValidUrl(url)) {
    return {
      isValid: false,
      error: 'Please enter a valid URL'
    };
  }
  return { isValid: true, error: null };
}

export function validateUUID(uuid: string): ValidationResult {
  if (isEmpty(uuid)) {
    return {
      isValid: false,
      error: 'ID is required'
    };
  }
  if (!isValidUUID(uuid)) {
    return {
      isValid: false,
      error: 'Please enter a valid UUID'
    };
  }
  return { isValid: true, error: null };
}

/**
 * String Validators
 */

export function validateStringLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  if (isEmpty(value)) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  if (!hasMinLength(value, min)) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min} characters`
    };
  }

  if (!hasMaxLength(value, max)) {
    return {
      isValid: false,
      error: `${fieldName} must be ${max} characters or less`
    };
  }

  return { isValid: true, error: null };
}

export function validateStringPattern(
  value: string,
  pattern: RegExp,
  fieldName: string,
  patternDescription: string
): ValidationResult {
  if (isEmpty(value)) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  if (!matchesPattern(value, pattern)) {
    return {
      isValid: false,
      error: `${fieldName} ${patternDescription}`
    };
  }

  return { isValid: true, error: null };
}

export function validateMinLength(
  value: string,
  min: number,
  fieldName: string
): ValidationResult {
  if (isEmpty(value)) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  if (!hasMinLength(value, min)) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min} characters`
    };
  }

  return { isValid: true, error: null };
}

export function validateMaxLength(
  value: string,
  max: number,
  fieldName: string
): ValidationResult {
  if (!hasMaxLength(value, max)) {
    return {
      isValid: false,
      error: `${fieldName} must be ${max} characters or less`
    };
  }

  return { isValid: true, error: null };
}

/**
 * Number Validators
 */

export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number`
    };
  }

  if (!isInRange(value, min, max)) {
    return {
      isValid: false,
      error: `${fieldName} must be between ${min} and ${max}`
    };
  }

  return { isValid: true, error: null };
}

export function validateMin(
  value: number,
  min: number,
  fieldName: string
): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number`
    };
  }

  if (value < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min}`
    };
  }

  return { isValid: true, error: null };
}

export function validateMax(
  value: number,
  max: number,
  fieldName: string
): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number`
    };
  }

  if (value > max) {
    return {
      isValid: false,
      error: `${fieldName} must be ${max} or less`
    };
  }

  return { isValid: true, error: null };
}

/**
 * Multi-field Validators
 */

export interface MultiFieldValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateMultipleFields(
  validators: Array<() => ValidationResult>
): MultiFieldValidationResult {
  const errors: string[] = [];

  for (const validator of validators) {
    const result = validator();
    if (!result.isValid && result.error) {
      errors.push(result.error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Conditional Validators
 */

export function validateIf(
  condition: boolean,
  validator: () => ValidationResult
): ValidationResult {
  if (!condition) {
    return { isValid: true, error: null };
  }
  return validator();
}

export function validateOneOf(
  value: string,
  allowedValues: string[],
  fieldName: string
): ValidationResult {
  if (!allowedValues.includes(value)) {
    return {
      isValid: false,
      error: `${fieldName} must be one of: ${allowedValues.join(', ')}`
    };
  }
  return { isValid: true, error: null };
}
