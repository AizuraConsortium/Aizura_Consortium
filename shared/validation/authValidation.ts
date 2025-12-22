/**
 * Authentication Validation
 *
 * Centralized authentication validation rules and functions.
 * Used across frontend and backend for consistent auth validation.
 *
 * This module provides:
 * - Email validation
 * - Password validation with strength rules
 * - Username validation
 * - User ID validation
 * - Common auth patterns and constants
 */

import { isEmpty, hasMinLength, hasMaxLength, isValidEmail } from '../utils/validation/base-validators';

/**
 * Authentication Validation Rules
 *
 * These constraints are enforced across all applications.
 */
export const AUTH_VALIDATION_RULES = {
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
} as const;

/**
 * Password strength requirements
 */
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: AUTH_VALIDATION_RULES.PASSWORD_MIN_LENGTH,
  REQUIRES_UPPERCASE: true,
  REQUIRES_LOWERCASE: true,
  REQUIRES_NUMBER: true,
  REQUIRES_SPECIAL: false,
} as const;

/**
 * Email validation result
 */
export interface EmailValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Password validation result with detailed errors
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength?: 'weak' | 'medium' | 'strong';
}

/**
 * User validation result
 */
export interface UserValidationResult {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
    username?: string;
  };
}

/**
 * Validate email address
 *
 * Rules:
 * - Required
 * - Must match email pattern
 * - Maximum length: 255 characters
 *
 * @param email - Email address to validate
 * @returns Validation result with error message if invalid
 */
export function validateEmail(email: string): string | null {
  if (isEmpty(email)) {
    return 'Email is required';
  }

  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }

  if (!hasMaxLength(email, AUTH_VALIDATION_RULES.EMAIL_MAX_LENGTH)) {
    return `Email must be ${AUTH_VALIDATION_RULES.EMAIL_MAX_LENGTH} characters or less`;
  }

  return null;
}

/**
 * Validate password with strength requirements
 *
 * Rules:
 * - Required
 * - Minimum length: 8 characters
 * - Maximum length: 128 characters
 * - Must contain uppercase letter
 * - Must contain lowercase letter
 * - Must contain number
 *
 * @param password - Password to validate
 * @returns Validation result with all errors and strength indicator
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (isEmpty(password)) {
    return {
      isValid: false,
      errors: ['Password is required'],
      strength: 'weak'
    };
  }

  if (!hasMinLength(password, AUTH_VALIDATION_RULES.PASSWORD_MIN_LENGTH)) {
    errors.push(`Password must be at least ${AUTH_VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`);
  }

  if (!hasMaxLength(password, AUTH_VALIDATION_RULES.PASSWORD_MAX_LENGTH)) {
    errors.push(`Password must be ${AUTH_VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters or less`);
  }

  if (PASSWORD_REQUIREMENTS.REQUIRES_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRES_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRES_NUMBER && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (PASSWORD_REQUIREMENTS.REQUIRES_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  const strength = calculatePasswordStrength(password);

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

/**
 * Calculate password strength
 *
 * @param password - Password to analyze
 * @returns Strength indicator
 */
function calculatePasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  if (password.length >= 16) score++;

  if (score <= 3) return 'weak';
  if (score <= 5) return 'medium';
  return 'strong';
}

/**
 * Validate username
 *
 * Rules:
 * - Required
 * - Minimum length: 3 characters
 * - Maximum length: 50 characters
 * - Alphanumeric and underscores only
 *
 * @param username - Username to validate
 * @returns Validation result with error message if invalid
 */
export function validateUsername(username: string): string | null {
  if (isEmpty(username)) {
    return 'Username is required';
  }

  if (!hasMinLength(username, AUTH_VALIDATION_RULES.USERNAME_MIN_LENGTH)) {
    return `Username must be at least ${AUTH_VALIDATION_RULES.USERNAME_MIN_LENGTH} characters`;
  }

  if (!hasMaxLength(username, AUTH_VALIDATION_RULES.USERNAME_MAX_LENGTH)) {
    return `Username must be ${AUTH_VALIDATION_RULES.USERNAME_MAX_LENGTH} characters or less`;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }

  return null;
}

/**
 * Validate user registration data
 *
 * @param email - Email address
 * @param password - Password
 * @param username - Username (optional)
 * @returns Validation result with all errors
 */
export function validateUserRegistration(
  email: string,
  password: string,
  username?: string
): UserValidationResult {
  const errors: UserValidationResult['errors'] = {};

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordResult = validatePassword(password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.errors.join('; ');
  }

  if (username !== undefined) {
    const usernameError = validateUsername(username);
    if (usernameError) {
      errors.username = usernameError;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate user ID format
 *
 * @param userId - User ID to validate
 * @throws Error if user ID is invalid
 */
export function assertValidUserId(userId: string): asserts userId is string {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }

  if (userId.trim().length === 0) {
    throw new Error('User ID cannot be empty');
  }
}

/**
 * Validate password confirmation match
 *
 * @param password - Password
 * @param confirmPassword - Confirmation password
 * @returns Error message if passwords don't match, null otherwise
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): string | null {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

/**
 * Check if email domain is allowed
 *
 * @param email - Email address to check
 * @param allowedDomains - List of allowed domains (empty = allow all)
 * @returns true if domain is allowed
 */
export function isEmailDomainAllowed(
  email: string,
  allowedDomains: string[] = []
): boolean {
  if (allowedDomains.length === 0) {
    return true;
  }

  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return false;
  }

  return allowedDomains.some(allowed => domain === allowed.toLowerCase());
}
