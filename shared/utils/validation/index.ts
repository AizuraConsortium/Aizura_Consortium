/**
 * Validation Utilities - Barrel Export
 *
 * Central export point for all validation utilities.
 * Import validation functions from this single location.
 *
 * Usage:
 *   import { validateProposal, isValidEmail, validateRequired } from '@shared/utils/validation';
 */

export * from './base-validators';
export * from './field-validators';
export * from './business-validators';
export * from './validation-helpers';
