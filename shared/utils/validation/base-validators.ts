/**
 * Base Validators
 *
 * Fundamental validation primitives for type guards, basic validation,
 * and range checking. These are the building blocks for higher-level validators.
 */

/**
 * Type Guards
 */

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Basic Validators
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function isValidDate(date: string): boolean {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Range Validators
 */

export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function hasMinLength(str: string, minLength: number): boolean {
  return str.length >= minLength;
}

export function hasMaxLength(str: string, maxLength: number): boolean {
  return str.length <= maxLength;
}

export function isLengthBetween(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
}

export function matchesPattern(str: string, pattern: RegExp): boolean {
  return pattern.test(str);
}

/**
 * Password Validation
 */

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export function isValidPassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let strengthScore = 0;

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    strengthScore += 1;
    if (password.length >= 12) strengthScore += 1;
    if (password.length >= 16) strengthScore += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    strengthScore += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    strengthScore += 1;
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    strengthScore += 1;
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    strengthScore += 0;
  } else {
    strengthScore += 2;
  }

  let strength: 'weak' | 'medium' | 'strong';
  if (strengthScore <= 3) {
    strength = 'weak';
  } else if (strengthScore <= 5) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    valid: errors.length === 0,
    errors,
    strength
  };
}

/**
 * Number Validators
 */

export function isPositive(value: number): boolean {
  return value > 0;
}

export function isNegative(value: number): boolean {
  return value < 0;
}

export function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

export function isWithinDecimalPlaces(value: number, maxDecimals: number): boolean {
  const decimals = (value.toString().split('.')[1] || '').length;
  return decimals <= maxDecimals;
}
