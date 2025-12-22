/**
 * Shared Validation
 *
 * Central export point for all validation modules.
 * Import validation functions from this single location.
 *
 * Usage:
 *   import { validateProposal, validateEmail, PROPOSAL_VALIDATION_RULES } from '@shared/validation';
 *
 * This module consolidates:
 * - Proposal validation (title, summary, status, votes)
 * - Authentication validation (email, password, username)
 * - All validation constants and rules
 */

export * from './proposalValidation';
export * from './authValidation';
