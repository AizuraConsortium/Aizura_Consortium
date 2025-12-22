/**
 * Proposal Validation
 *
 * Centralized proposal validation rules and functions.
 * Used across frontend and backend to ensure consistency.
 *
 * This module provides:
 * - Validation constants (length constraints, status values)
 * - Field validators (title, summary)
 * - Complete proposal validation
 * - TypeScript types for validation results
 */

import { isEmpty, hasMinLength, hasMaxLength } from '../utils/validation/base-validators';

/**
 * Proposal Validation Rules
 *
 * These constraints are enforced across all applications.
 * Backend MUST use these constants, not duplicate values.
 */
export const PROPOSAL_VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 200,
  SUMMARY_MIN_LENGTH: 20,
  SUMMARY_MAX_LENGTH: 2000,
  DEFAULT_STATUS: 'queued' as const,
} as const;

/**
 * Valid proposal statuses
 */
export const VALID_PROPOSAL_STATUSES = [
  'queued',
  'in_debate',
  'adopted',
  'rejected'
] as const;

export type ProposalStatus = typeof VALID_PROPOSAL_STATUSES[number];

/**
 * Valid vote choices
 */
export const VALID_VOTE_CHOICES = ['for', 'against'] as const;
export type VoteChoice = typeof VALID_VOTE_CHOICES[number];

/**
 * Validation result for individual fields
 */
export interface FieldValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Complete proposal validation result
 */
export interface ProposalValidationResult {
  isValid: boolean;
  errors: {
    title?: string;
    summary?: string;
  };
}

/**
 * Validate proposal title
 *
 * Rules:
 * - Required
 * - Minimum length: 5 characters (trimmed)
 * - Maximum length: 200 characters
 *
 * @param title - Proposal title to validate
 * @returns Validation result with error message if invalid
 */
export function validateProposalTitle(title: string): string | null {
  if (isEmpty(title)) {
    return 'Title is required';
  }

  const trimmed = title.trim();

  if (!hasMinLength(trimmed, PROPOSAL_VALIDATION_RULES.TITLE_MIN_LENGTH)) {
    return `Title must be at least ${PROPOSAL_VALIDATION_RULES.TITLE_MIN_LENGTH} characters`;
  }

  if (!hasMaxLength(title, PROPOSAL_VALIDATION_RULES.TITLE_MAX_LENGTH)) {
    return `Title must be ${PROPOSAL_VALIDATION_RULES.TITLE_MAX_LENGTH} characters or less`;
  }

  return null;
}

/**
 * Validate proposal summary
 *
 * Rules:
 * - Required
 * - Minimum length: 20 characters (trimmed)
 * - Maximum length: 2000 characters
 *
 * @param summary - Proposal summary to validate
 * @returns Validation result with error message if invalid
 */
export function validateProposalSummary(summary: string): string | null {
  if (isEmpty(summary)) {
    return 'Summary is required';
  }

  const trimmed = summary.trim();

  if (!hasMinLength(trimmed, PROPOSAL_VALIDATION_RULES.SUMMARY_MIN_LENGTH)) {
    return `Summary must be at least ${PROPOSAL_VALIDATION_RULES.SUMMARY_MIN_LENGTH} characters`;
  }

  if (!hasMaxLength(summary, PROPOSAL_VALIDATION_RULES.SUMMARY_MAX_LENGTH)) {
    return `Summary must be ${PROPOSAL_VALIDATION_RULES.SUMMARY_MAX_LENGTH} characters or less`;
  }

  return null;
}

/**
 * Validate complete proposal
 *
 * Validates both title and summary and returns comprehensive result.
 *
 * @param title - Proposal title
 * @param summary - Proposal summary
 * @returns Validation result with all errors
 *
 * @example
 * ```typescript
 * const result = validateProposal(title, summary);
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateProposal(
  title: string,
  summary: string
): ProposalValidationResult {
  const titleError = validateProposalTitle(title);
  const summaryError = validateProposalSummary(summary);

  return {
    isValid: !titleError && !summaryError,
    errors: {
      ...(titleError && { title: titleError }),
      ...(summaryError && { summary: summaryError }),
    },
  };
}

/**
 * Validate proposal status
 *
 * @param status - Status to validate
 * @returns true if status is valid
 */
export function validateProposalStatus(status: string): status is ProposalStatus {
  return VALID_PROPOSAL_STATUSES.includes(status as ProposalStatus);
}

/**
 * Validate vote choice
 *
 * @param choice - Vote choice to validate
 * @returns true if choice is valid
 */
export function validateVoteChoice(choice: string): choice is VoteChoice {
  return VALID_VOTE_CHOICES.includes(choice as VoteChoice);
}

/**
 * Validate proposal ID format
 *
 * @param proposalId - Proposal ID to validate
 * @throws Error if proposal ID is invalid
 */
export function assertValidProposalId(proposalId: string): asserts proposalId is string {
  if (!proposalId || typeof proposalId !== 'string') {
    throw new Error('Invalid proposal ID');
  }

  if (proposalId.trim().length === 0) {
    throw new Error('Proposal ID cannot be empty');
  }
}

/**
 * Validate vote type and throw if invalid
 *
 * @param vote - Vote type to validate
 * @throws Error if vote type is invalid
 */
export function assertValidVoteType(vote: string): asserts vote is VoteChoice {
  if (!VALID_VOTE_CHOICES.includes(vote as VoteChoice)) {
    throw new Error(
      `Invalid vote type. Must be one of: ${VALID_VOTE_CHOICES.join(', ')}`
    );
  }
}
