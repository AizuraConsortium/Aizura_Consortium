/**
 * Plan Type Guards and Validation
 *
 * Runtime validation for plan-related data and operations
 */

import { ValidationError, StateTransitionError, OperationNotAllowedError } from '../errors/index.js';
import type { Database } from '../../../../../../shared/types/database.types.js';

type PlanStatus = Database['public']['Tables']['plans']['Row']['status'];
type PlanOperation = Database['public']['Tables']['plan_revisions']['Row']['op'];

const VALID_PLAN_STATUSES: readonly PlanStatus[] = ['draft', 'final', 'adopted'] as const;
const VALID_PLAN_OPERATIONS: readonly PlanOperation[] = [
  'upsert_section',
  'append',
  'replace',
  'delete',
  'move'
] as const;

const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 500;
const CONTENT_MIN_LENGTH = 1;
const PATH_MAX_LENGTH = 500;

/**
 * Validate plan status
 */
export function isValidPlanStatus(status: unknown): status is PlanStatus {
  return typeof status === 'string' && VALID_PLAN_STATUSES.includes(status as PlanStatus);
}

/**
 * Validate plan operation
 */
export function isValidPlanOperation(op: unknown): op is PlanOperation {
  return typeof op === 'string' && VALID_PLAN_OPERATIONS.includes(op as PlanOperation);
}

/**
 * Get allowed status transitions from current status
 */
export function getAllowedPlanStatusTransitions(currentStatus: PlanStatus): PlanStatus[] {
  const transitions: Record<PlanStatus, PlanStatus[]> = {
    draft: ['final'],
    final: ['adopted'],
    adopted: [],
  };

  return transitions[currentStatus] || [];
}

/**
 * Validate if plan status transition is allowed
 */
export function isValidPlanStatusTransition(
  currentStatus: PlanStatus,
  newStatus: PlanStatus
): boolean {
  const allowed = getAllowedPlanStatusTransitions(currentStatus);
  return allowed.includes(newStatus);
}

/**
 * Check if status transition is allowed and throw error if not
 */
export function validatePlanStatusTransition(
  currentStatus: PlanStatus,
  newStatus: PlanStatus
): void {
  if (!isValidPlanStatusTransition(currentStatus, newStatus)) {
    const allowed = getAllowedPlanStatusTransitions(currentStatus);
    throw new StateTransitionError(
      'plan',
      currentStatus,
      newStatus,
      allowed
    );
  }
}

/**
 * Validate plan title
 */
export function validatePlanTitle(title: string): void {
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
 * Validate plan content
 */
export function validatePlanContent(content: string): void {
  if (!content || content.trim().length === 0) {
    throw ValidationError.single('content_md', 'Content is required', content);
  }

  if (content.length < CONTENT_MIN_LENGTH) {
    throw ValidationError.single(
      'content_md',
      `Content must be at least ${CONTENT_MIN_LENGTH} characters`,
      content
    );
  }
}

/**
 * Validate revision path
 */
export function validateRevisionPath(path: string): void {
  if (!path || path.trim().length === 0) {
    throw ValidationError.single('path', 'Path is required', path);
  }

  if (path.length > PATH_MAX_LENGTH) {
    throw ValidationError.single(
      'path',
      `Path must not exceed ${PATH_MAX_LENGTH} characters`,
      path
    );
  }
}

/**
 * Check if plan can be marked as adopted
 * This requires checking if all votes are approve
 */
export function canMarkAsAdopted(
  planStatus: PlanStatus,
  allVotesApprove: boolean
): { allowed: boolean; reason?: string } {
  if (planStatus !== 'final') {
    return {
      allowed: false,
      reason: 'Plan must be in final status before adoption',
    };
  }

  if (!allVotesApprove) {
    return {
      allowed: false,
      reason: 'All agent votes must be approve for plan adoption',
    };
  }

  return { allowed: true };
}

/**
 * Validate plan can be marked as adopted
 */
export function validateCanMarkAsAdopted(
  planStatus: PlanStatus,
  allVotesApprove: boolean
): void {
  const result = canMarkAsAdopted(planStatus, allVotesApprove);
  if (!result.allowed) {
    throw new OperationNotAllowedError('mark_plan_as_adopted', result.reason!);
  }
}

/**
 * Validate character counts
 */
export function validateCharacterCounts(addedChars: number, removedChars: number): void {
  const violations: Array<{ field: string; message: string; value?: unknown }> = [];

  if (!Number.isInteger(addedChars) || addedChars < 0) {
    violations.push({
      field: 'added_chars',
      message: 'added_chars must be a non-negative integer',
      value: addedChars,
    });
  }

  if (!Number.isInteger(removedChars) || removedChars < 0) {
    violations.push({
      field: 'removed_chars',
      message: 'removed_chars must be a non-negative integer',
      value: removedChars,
    });
  }

  if (violations.length > 0) {
    throw new ValidationError('Character count validation failed', violations);
  }
}

/**
 * Validate plan ID format
 */
export function validatePlanId(planId: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(planId)) {
    throw ValidationError.single('planId', 'Invalid plan ID format', planId);
  }
}

/**
 * Validate topic ID for plan
 */
export function validateTopicIdForPlan(topicId: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(topicId)) {
    throw ValidationError.single('topicId', 'Invalid topic ID format', topicId);
  }
}

/**
 * Validate complete plan data
 */
export function validatePlanData(data: {
  topic_id: string;
  title: string;
  status?: PlanStatus;
}): void {
  const violations: Array<{ field: string; message: string; value?: unknown }> = [];

  try {
    validateTopicIdForPlan(data.topic_id);
  } catch (error) {
    if (error instanceof ValidationError) {
      violations.push(...error.violations);
    }
  }

  try {
    validatePlanTitle(data.title);
  } catch (error) {
    if (error instanceof ValidationError) {
      violations.push(...error.violations);
    }
  }

  if (data.status && !isValidPlanStatus(data.status)) {
    violations.push({
      field: 'status',
      message: `Invalid status. Must be one of: ${VALID_PLAN_STATUSES.join(', ')}`,
      value: data.status,
    });
  }

  if (violations.length > 0) {
    throw new ValidationError('Plan validation failed', violations);
  }
}

/**
 * Validate plan revision data
 */
export function validatePlanRevisionData(data: {
  plan_id: string;
  agent_id: string;
  op: PlanOperation;
  path: string;
  content_md?: string | null;
  added_chars: number;
  removed_chars: number;
}): void {
  const violations: Array<{ field: string; message: string; value?: unknown }> = [];

  try {
    validatePlanId(data.plan_id);
  } catch (error) {
    if (error instanceof ValidationError) {
      violations.push(...error.violations);
    }
  }

  if (!isValidPlanOperation(data.op)) {
    violations.push({
      field: 'op',
      message: `Invalid operation. Must be one of: ${VALID_PLAN_OPERATIONS.join(', ')}`,
      value: data.op,
    });
  }

  try {
    validateRevisionPath(data.path);
  } catch (error) {
    if (error instanceof ValidationError) {
      violations.push(...error.violations);
    }
  }

  try {
    validateCharacterCounts(data.added_chars, data.removed_chars);
  } catch (error) {
    if (error instanceof ValidationError) {
      violations.push(...error.violations);
    }
  }

  if (violations.length > 0) {
    throw new ValidationError('Plan revision validation failed', violations);
  }
}
