/**
 * Topic Type Guards and Validation
 *
 * Runtime validation for topic-related data and phase transitions
 */

import { ValidationError, StateTransitionError, OperationNotAllowedError } from '../errors/index.js';
import type { Database } from '../../../../../../shared/types/database.types.js';

type TopicPhase = Database['public']['Tables']['topics']['Row']['state'];

const VALID_PHASES: readonly TopicPhase[] = [
  'intake',
  'debate',
  'plan_drafting',
  'pre_vote',
  'vote',
  'commit',
  'idle'
] as const;

/**
 * Validate phase value
 */
export function isValidPhase(phase: unknown): phase is TopicPhase {
  return typeof phase === 'string' && VALID_PHASES.includes(phase as TopicPhase);
}

/**
 * Get allowed phase transitions from current phase
 */
export function getAllowedPhaseTransitions(currentPhase: TopicPhase): TopicPhase[] {
  const transitions: Record<TopicPhase, TopicPhase[]> = {
    intake: ['debate', 'idle'],
    debate: ['plan_drafting', 'idle'],
    plan_drafting: ['pre_vote', 'debate', 'idle'],
    pre_vote: ['vote', 'plan_drafting', 'idle'],
    vote: ['commit', 'plan_drafting', 'idle'],
    commit: ['idle'],
    idle: [],
  };

  return transitions[currentPhase] || [];
}

/**
 * Validate if phase transition is allowed
 */
export function isValidPhaseTransition(
  currentPhase: TopicPhase,
  newPhase: TopicPhase
): boolean {
  const allowed = getAllowedPhaseTransitions(currentPhase);
  return allowed.includes(newPhase);
}

/**
 * Check if phase transition is allowed and throw error if not
 */
export function validatePhaseTransition(
  currentPhase: TopicPhase,
  newPhase: TopicPhase
): void {
  if (!isValidPhaseTransition(currentPhase, newPhase)) {
    const allowed = getAllowedPhaseTransitions(currentPhase);
    throw new StateTransitionError(
      'topic',
      currentPhase,
      newPhase,
      allowed
    );
  }
}

/**
 * Check if topic can be ended
 */
export function canEndTopic(phase: TopicPhase, hasEndedAt: boolean): boolean {
  return phase === 'commit' && !hasEndedAt;
}

/**
 * Validate topic can be ended
 */
export function validateCanEndTopic(phase: TopicPhase, hasEndedAt: boolean): void {
  if (hasEndedAt) {
    throw new OperationNotAllowedError(
      'end_topic',
      'Topic has already ended'
    );
  }

  if (phase !== 'commit') {
    throw new OperationNotAllowedError(
      'end_topic',
      `Topic must be in 'commit' phase to end. Current phase: ${phase}`
    );
  }
}

/**
 * Validate topic ID format
 */
export function validateTopicId(topicId: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(topicId)) {
    throw ValidationError.single('topicId', 'Invalid topic ID format', topicId);
  }
}

/**
 * Validate proposal ID for topic creation
 */
export function validateProposalIdForTopic(proposalId: string): void {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(proposalId)) {
    throw ValidationError.single('proposalId', 'Invalid proposal ID format', proposalId);
  }
}

/**
 * Check if phase transition is allowed with reason
 */
export function canTransitionToPhase(
  currentPhase: TopicPhase,
  newPhase: TopicPhase
): { allowed: boolean; reason?: string } {
  if (!isValidPhase(newPhase)) {
    return { allowed: false, reason: `Invalid phase: ${newPhase}` };
  }

  if (!isValidPhaseTransition(currentPhase, newPhase)) {
    const allowed = getAllowedPhaseTransitions(currentPhase);
    return {
      allowed: false,
      reason: `Cannot transition from ${currentPhase} to ${newPhase}. Allowed: ${allowed.join(', ')}`,
    };
  }

  return { allowed: true };
}

/**
 * Get phase description
 */
export function getPhaseDescription(phase: TopicPhase): string {
  const descriptions: Record<TopicPhase, string> = {
    intake: 'Initial proposal intake and validation',
    debate: 'Agents debate and discuss the proposal',
    plan_drafting: 'Creating and refining the implementation plan',
    pre_vote: 'Preparing for final vote',
    vote: 'Agents cast their votes',
    commit: 'Proposal adopted and committed',
    idle: 'Topic is inactive',
  };

  return descriptions[phase] || 'Unknown phase';
}

/**
 * Check if phase requires plan
 */
export function phaseRequiresPlan(phase: TopicPhase): boolean {
  return ['pre_vote', 'vote', 'commit'].includes(phase);
}

/**
 * Check if phase allows messages
 */
export function phaseAllowsMessages(phase: TopicPhase): boolean {
  return phase !== 'idle' && phase !== 'commit';
}

/**
 * Check if phase allows votes
 */
export function phaseAllowsVotes(phase: TopicPhase): boolean {
  return phase === 'vote';
}

/**
 * Validate complete topic data
 */
export function validateTopicData(data: {
  proposal_id: string;
  state?: TopicPhase;
}): void {
  const violations: Array<{ field: string; message: string; value?: unknown }> = [];

  try {
    validateProposalIdForTopic(data.proposal_id);
  } catch (error) {
    if (error instanceof ValidationError) {
      violations.push(...error.violations);
    }
  }

  if (data.state && !isValidPhase(data.state)) {
    violations.push({
      field: 'state',
      message: `Invalid phase. Must be one of: ${VALID_PHASES.join(', ')}`,
      value: data.state,
    });
  }

  if (violations.length > 0) {
    throw new ValidationError('Topic validation failed', violations);
  }
}
