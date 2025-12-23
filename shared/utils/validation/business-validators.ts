/**
 * Business Validators
 *
 * Business-specific validation rules shared across frontend and backend.
 * These validators encode domain knowledge and business rules.
 */

import { isEmpty, hasMinLength, hasMaxLength } from './base-validators';

/**
 * Proposal Validation
 */

export interface ProposalValidationRules {
  TITLE_MIN_LENGTH: number;
  TITLE_MAX_LENGTH: number;
  SUMMARY_MIN_LENGTH: number;
  SUMMARY_MAX_LENGTH: number;
  DEFAULT_STATUS: 'queued';
}

export const PROPOSAL_VALIDATION_RULES: ProposalValidationRules = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 200,
  SUMMARY_MIN_LENGTH: 10,
  SUMMARY_MAX_LENGTH: 5000,
  DEFAULT_STATUS: 'queued' as const,
} as const;

export interface ProposalValidationResult {
  isValid: boolean;
  errors: {
    title?: string;
    summary?: string;
  };
}

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
 * User Validation
 */

export const USER_VALIDATION_RULES = {
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
} as const;

export function validateUserEmail(email: string): string | null {
  if (isEmpty(email)) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  if (!hasMaxLength(email, USER_VALIDATION_RULES.EMAIL_MAX_LENGTH)) {
    return `Email must be ${USER_VALIDATION_RULES.EMAIL_MAX_LENGTH} characters or less`;
  }

  return null;
}

export interface UserPasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateUserPassword(password: string): UserPasswordValidationResult {
  const errors: string[] = [];

  if (isEmpty(password)) {
    return {
      isValid: false,
      errors: ['Password is required']
    };
  }

  if (!hasMinLength(password, USER_VALIDATION_RULES.PASSWORD_MIN_LENGTH)) {
    errors.push(`Password must be at least ${USER_VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`);
  }

  if (!hasMaxLength(password, USER_VALIDATION_RULES.PASSWORD_MAX_LENGTH)) {
    errors.push(`Password must be ${USER_VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters or less`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Vote Validation
 */

export const VALID_VOTE_CHOICES = ['for', 'against'] as const;
export type VoteChoice = typeof VALID_VOTE_CHOICES[number];

export function validateVoteChoice(choice: string): boolean {
  return VALID_VOTE_CHOICES.includes(choice as VoteChoice);
}

export interface VoteEligibilityResult {
  isValid: boolean;
  reason?: string;
}

export function validateVoteEligibility(
  userId: string,
  proposalId: string,
  proposalStatus: string
): VoteEligibilityResult {
  if (isEmpty(userId)) {
    return {
      isValid: false,
      reason: 'User must be authenticated to vote'
    };
  }

  if (isEmpty(proposalId)) {
    return {
      isValid: false,
      reason: 'Invalid proposal'
    };
  }

  if (proposalStatus !== 'in_debate') {
    return {
      isValid: false,
      reason: 'Proposal is not open for voting'
    };
  }

  return { isValid: true };
}

/**
 * Message Validation
 */

export const MESSAGE_VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 200,
  BODY_MIN_LENGTH: 1,
  BODY_MAX_LENGTH: 10000,
} as const;

export function validateMessageTitle(title: string): string | null {
  if (isEmpty(title)) {
    return 'Message title is required';
  }

  if (!hasMinLength(title, MESSAGE_VALIDATION_RULES.TITLE_MIN_LENGTH)) {
    return `Message title must be at least ${MESSAGE_VALIDATION_RULES.TITLE_MIN_LENGTH} character`;
  }

  if (!hasMaxLength(title, MESSAGE_VALIDATION_RULES.TITLE_MAX_LENGTH)) {
    return `Message title must be ${MESSAGE_VALIDATION_RULES.TITLE_MAX_LENGTH} characters or less`;
  }

  return null;
}

export function validateMessageBody(body: string): string | null {
  if (isEmpty(body)) {
    return 'Message body is required';
  }

  if (!hasMinLength(body, MESSAGE_VALIDATION_RULES.BODY_MIN_LENGTH)) {
    return `Message body must be at least ${MESSAGE_VALIDATION_RULES.BODY_MIN_LENGTH} character`;
  }

  if (!hasMaxLength(body, MESSAGE_VALIDATION_RULES.BODY_MAX_LENGTH)) {
    return `Message body must be ${MESSAGE_VALIDATION_RULES.BODY_MAX_LENGTH} characters or less`;
  }

  return null;
}

/**
 * Topic State Validation
 */

export const VALID_TOPIC_STATES = [
  'intake',
  'debate',
  'plan_drafting',
  'pre_vote',
  'vote',
  'commit',
  'idle'
] as const;

export type TopicState = typeof VALID_TOPIC_STATES[number];

export function validateTopicState(state: string): boolean {
  return VALID_TOPIC_STATES.includes(state as TopicState);
}

/**
 * Proposal Status Validation
 */

export const VALID_PROPOSAL_STATUSES = [
  'queued',
  'in_debate',
  'adopted',
  'rejected'
] as const;

export type ProposalStatus = typeof VALID_PROPOSAL_STATUSES[number];

export function validateProposalStatus(status: string): boolean {
  return VALID_PROPOSAL_STATUSES.includes(status as ProposalStatus);
}

/**
 * Assert functions for runtime validation with error throwing
 */

/**
 * Validate proposal ID format and throw if invalid
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

/**
 * Validate user ID format and throw if invalid
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
