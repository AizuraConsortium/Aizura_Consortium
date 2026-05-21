/**
 * Service Validators
 *
 * Business logic validation beyond schema validation.
 * Validates business rules, state transitions, and complex constraints.
 */

import { BusinessRule, StateTransition } from '../types/services.js';

/**
 * Proposal business rules
 */

/**
 * Validate proposal title business rules
 * - Must not be empty after trimming
 * - Must not be all special characters
 * - Must have meaningful content
 */
export const proposalTitleRule: BusinessRule<{ title: string }> = {
  name: 'proposalTitle',
  validate: (data) => {
    const trimmed = data.title.trim();
    if (trimmed.length === 0) return false;

    // Check if title has at least some alphanumeric characters
    const hasContent = /[a-zA-Z0-9]/.test(trimmed);
    return hasContent;
  },
  errorMessage: 'Proposal title must contain meaningful content',
};

/**
 * Validate proposal summary business rules
 * - Must have sufficient detail (not just a few words)
 * - Should have multiple sentences or meaningful length
 */
export const proposalSummaryRule: BusinessRule<{ summary: string }> = {
  name: 'proposalSummary',
  validate: (data) => {
    const trimmed = data.summary.trim();
    if (trimmed.length < 20) return false;

    // Check for meaningful content (not just repeated characters)
    const uniqueChars = new Set(trimmed.toLowerCase()).size;
    return uniqueChars > 10;
  },
  errorMessage: 'Proposal summary must provide sufficient detail',
};

/**
 * Vote eligibility validation
 */

/**
 * Validate that user can vote on a proposal
 * Business rules:
 * - User must not have already voted
 * - Proposal must be in voting phase
 * - User must have appropriate role
 *
 * @param userId - User attempting to vote
 * @param proposalId - Proposal being voted on
 * @param existingVotes - Array of existing votes
 * @param proposalStatus - Current proposal status
 * @returns True if user can vote
 */
export async function validateVoteEligibility(
  userId: string,
  _proposalId: string,
  existingVotes: Array<{ user_id: string }>,
  proposalStatus: string
): Promise<{ valid: boolean; reason?: string }> {
  // Check if user has already voted
  const hasVoted = existingVotes.some((vote) => vote.user_id === userId);
  if (hasVoted) {
    return {
      valid: false,
      reason: 'User has already voted on this proposal',
    };
  }

  // Check if proposal is in correct status
  const votableStatuses = ['pending', 'voting', 'active'];
  if (!votableStatuses.includes(proposalStatus)) {
    return {
      valid: false,
      reason: `Cannot vote on proposal with status: ${proposalStatus}`,
    };
  }

  return { valid: true };
}

/**
 * Topic state transitions
 */

/**
 * Valid topic state transitions
 * Defines which state changes are allowed
 */
export const topicStateTransitions: StateTransition[] = [
  {
    from: 'discussion',
    to: 'vote_pending',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'vote_pending',
    to: 'voting',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'voting',
    to: 'passed',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'voting',
    to: 'failed',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'passed',
    to: 'implementation',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'implementation',
    to: 'completed',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'passed',
    to: 'archived',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'failed',
    to: 'archived',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'completed',
    to: 'archived',
    allowed: true,
    requiredRole: 'admin',
  },
];

/**
 * Validate topic state transition
 *
 * Checks if transitioning from one state to another is allowed
 * based on defined business rules.
 *
 * @param currentState - Current topic state
 * @param newState - Desired new state
 * @param userRole - Role of user making the change
 * @returns Validation result
 */
export function validateTopicTransition(
  currentState: string,
  newState: string,
  userRole?: 'admin' | 'client' | 'agent'
): { valid: boolean; reason?: string } {
  // Allow staying in same state
  if (currentState === newState) {
    return { valid: true };
  }

  // Find matching transition rule
  const transition = topicStateTransitions.find(
    (t) => t.from === currentState && t.to === newState
  );

  if (!transition) {
    return {
      valid: false,
      reason: `Invalid state transition from '${currentState}' to '${newState}'`,
    };
  }

  if (!transition.allowed) {
    return {
      valid: false,
      reason: `State transition from '${currentState}' to '${newState}' is not allowed`,
    };
  }

  // Check role requirement
  if (transition.requiredRole && userRole !== transition.requiredRole) {
    return {
      valid: false,
      reason: `State transition requires '${transition.requiredRole}' role`,
    };
  }

  return { valid: true };
}

/**
 * Proposal status transitions
 */

/**
 * Valid proposal status transitions
 */
export const proposalStatusTransitions: StateTransition[] = [
  {
    from: 'pending',
    to: 'approved',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'pending',
    to: 'rejected',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'approved',
    to: 'active',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'active',
    to: 'completed',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'active',
    to: 'failed',
    allowed: true,
    requiredRole: 'admin',
  },
  {
    from: 'rejected',
    to: 'pending',
    allowed: true,
    requiredRole: 'client', // Allow resubmission
  },
];

/**
 * Validate proposal status transition
 *
 * @param currentStatus - Current proposal status
 * @param newStatus - Desired new status
 * @param userRole - Role of user making the change
 * @returns Validation result
 */
export function validateProposalTransition(
  currentStatus: string,
  newStatus: string,
  userRole?: 'admin' | 'client' | 'agent'
): { valid: boolean; reason?: string } {
  if (currentStatus === newStatus) {
    return { valid: true };
  }

  const transition = proposalStatusTransitions.find(
    (t) => t.from === currentStatus && t.to === newStatus
  );

  if (!transition) {
    return {
      valid: false,
      reason: `Invalid status transition from '${currentStatus}' to '${newStatus}'`,
    };
  }

  if (!transition.allowed) {
    return {
      valid: false,
      reason: `Status transition from '${currentStatus}' to '${newStatus}' is not allowed`,
    };
  }

  if (transition.requiredRole && userRole !== transition.requiredRole) {
    return {
      valid: false,
      reason: `Status transition requires '${transition.requiredRole}' role`,
    };
  }

  return { valid: true };
}

/**
 * User role validation
 */

/**
 * Validate user has required permission
 *
 * @param userRole - User's role
 * @param requiredRole - Required role for action
 * @returns True if user has permission
 */
export function validateUserPermission(
  userRole: 'admin' | 'client' | 'agent',
  requiredRole: 'admin' | 'client' | 'agent'
): boolean {
  // Admin has all permissions
  if (userRole === 'admin') return true;

  // Otherwise, role must match exactly
  return userRole === requiredRole;
}

/**
 * Validate user can perform admin action
 *
 * @param userRole - User's role
 * @returns Validation result
 */
export function validateAdminAction(
  userRole: string
): { valid: boolean; reason?: string } {
  if (userRole === 'admin') {
    return { valid: true };
  }

  return {
    valid: false,
    reason: 'Only administrators can perform this action',
  };
}

/**
 * Rate limit validation
 */

/**
 * Validate operation is not rate limited
 *
 * @param operationsInWindow - Number of operations in current window
 * @param maxOperations - Maximum allowed operations
 * @returns Validation result
 */
export function validateRateLimit(
  operationsInWindow: number,
  maxOperations: number
): { valid: boolean; reason?: string } {
  if (operationsInWindow < maxOperations) {
    return { valid: true };
  }

  return {
    valid: false,
    reason: `Rate limit exceeded. Maximum ${maxOperations} operations allowed.`,
  };
}
