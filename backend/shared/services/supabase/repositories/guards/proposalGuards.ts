/**
 * Proposal Type Guards and Validation
 *
 * Runtime validation for proposal-related data and state transitions
 */

import { ValidationError, StateTransitionError } from '../errors/RepositoryError.js';
import type { Database } from '../../../../../../shared/types/database.types.js';

type ProposalStatus = Database['public']['Tables']['proposals']['Row']['status'];
type VoteType = Database['public']['Tables']['proposal_votes']['Row']['vote'];

const VALID_PROPOSAL_STATUSES: readonly ProposalStatus[] = ['queued', 'in_debate', 'adopted', 'rejected'] as const;
const VALID_VOTE_TYPES: readonly VoteType[] = ['for', 'against'] as const;

const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 200;
const SUMMARY_MAX_LENGTH = 5000;

/**
 * Validate proposal status value
 */
export function isValidProposalStatus(status: unknown): status is ProposalStatus {
  return typeof status === 'string' && VALID_PROPOSAL_STATUSES.includes(status as ProposalStatus);
}

/**
 * Validate vote type value
 */
export function isValidVoteType(vote: unknown): vote is VoteType {
  return typeof vote === 'string' && VALID_VOTE_TYPES.includes(vote as VoteType);
}

/**
 * Get allowed status transitions from current status
 */
export function getAllowedStatusTransitions(currentStatus: ProposalStatus): ProposalStatus[] {
  const transitions: Record<ProposalStatus, ProposalStatus[]> = {
    queued: ['in_debate'],
    in_debate: ['adopted', 'rejected'],
    adopted: [],
    rejected: [],
  };

  return transitions[currentStatus] || [];
}

/**
 * Validate if status transition is allowed
 */
export function isValidStatusTransition(
  currentStatus: ProposalStatus,
  newStatus: ProposalStatus
): boolean {
  const allowed = getAllowedStatusTransitions(currentStatus);
  return allowed.includes(newStatus);
}

/**
 * Check if status transition is allowed and throw error if not
 */
export function validateStatusTransition(
  currentStatus: ProposalStatus,
  newStatus: ProposalStatus
): void {
  if (!isValidStatusTransition(currentStatus, newStatus)) {
    const allowed = getAllowedStatusTransitions(currentStatus);
    throw new StateTransitionError(
      'proposal',
      currentStatus,
      newStatus,
      allowed
    );
  }
}

/**
 * Validate proposal title
 */
export function validateProposalTitle(title: string): void {
  if (!title || title.trim().length === 0) {
    throw ValidationError.single('title', 'Title is required', title);
  }

  if (title.length < TITLE_MIN_LENGTH) {
    throw ValidationError.single(
      'title',
      `Title must be at least ${TITLE_MIN_LENGTH} characters`,
      title
    );
  }

  if (title.length > TITLE_MAX_LENGTH) {
    throw ValidationError.single(
      'title',
      `Title must not exceed ${TITLE_MAX_LENGTH} characters`,
      title
    );
  }
}

/**
 * Validate proposal summary
 */
export function validateProposalSummary(summary: string | null | undefined): void {
  if (summary && summary.length > SUMMARY_MAX_LENGTH) {
    throw ValidationError.single(
      'summary',
      `Summary must not exceed ${SUMMARY_MAX_LENGTH} characters`,
      summary
    );
  }
}

/**
 * Validate UUID format
 */
export function validateProposalId(proposalId: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(proposalId)) {
    throw ValidationError.single('proposalId', 'Invalid proposal ID format', proposalId);
  }
}

/**
 * Validate user ID format
 */
export function validateUserId(userId: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    throw ValidationError.single('userId', 'Invalid user ID format', userId);
  }
}

/**
 * Check if proposal can transition to status
 */
export function canTransitionToStatus(
  currentStatus: ProposalStatus,
  newStatus: ProposalStatus
): { allowed: boolean; reason?: string } {
  if (!isValidProposalStatus(newStatus)) {
    return { allowed: false, reason: `Invalid status: ${newStatus}` };
  }

  if (!isValidStatusTransition(currentStatus, newStatus)) {
    const allowed = getAllowedStatusTransitions(currentStatus);
    return {
      allowed: false,
      reason: `Cannot transition from ${currentStatus} to ${newStatus}. Allowed: ${allowed.join(', ')}`,
    };
  }

  return { allowed: true };
}

/**
 * Validate complete proposal data
 */
export function validateProposalData(data: {
  title: string;
  summary?: string | null;
  submitted_by?: string | null;
  status?: ProposalStatus;
}): void {
  const violations: Array<{ field: string; message: string; value?: unknown }> = [];

  try {
    validateProposalTitle(data.title);
  } catch (error) {
    if (error instanceof ValidationError) {
      violations.push(...error.violations);
    }
  }

  try {
    if (data.summary !== undefined) {
      validateProposalSummary(data.summary);
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      violations.push(...error.violations);
    }
  }

  if (data.submitted_by) {
    try {
      validateUserId(data.submitted_by);
    } catch (error) {
      if (error instanceof ValidationError) {
        violations.push(...error.violations);
      }
    }
  }

  if (data.status && !isValidProposalStatus(data.status)) {
    violations.push({
      field: 'status',
      message: `Invalid status. Must be one of: ${VALID_PROPOSAL_STATUSES.join(', ')}`,
      value: data.status,
    });
  }

  if (violations.length > 0) {
    throw new ValidationError('Proposal validation failed', violations);
  }
}
