/**
 * Vote Type Guards and Validation
 *
 * Runtime validation for agent vote data and vote aggregation
 */

import { ValidationError } from '../errors/RepositoryError.js';
import type { AgentId, VoteChoice } from '../../../../../../shared/types/models.js';

const VALID_AGENT_IDS: readonly AgentId[] = ['claude', 'chatgpt', 'grok', 'gemini', 'deepseek', 'qwen'] as const;
const VALID_VOTE_CHOICES: readonly VoteChoice[] = ['approve', 'reject', 'abstain'] as const;

const RATIONALE_MIN_LENGTH = 10;
const RATIONALE_MAX_LENGTH = 5000;
const CONDITION_MIN_LENGTH = 5;
const CONDITION_MAX_LENGTH = 500;
const TOTAL_AGENTS = VALID_AGENT_IDS.length;

/**
 * Validate vote choice
 */
export function isValidVoteChoice(choice: unknown): choice is VoteChoice {
  return typeof choice === 'string' && VALID_VOTE_CHOICES.includes(choice as VoteChoice);
}

/**
 * Validate agent ID for votes
 */
export function isValidVoteAgentId(agentId: unknown): agentId is AgentId {
  return typeof agentId === 'string' && VALID_AGENT_IDS.includes(agentId as AgentId);
}

/**
 * Validate vote rationale
 */
export function validateVoteRationale(rationale: string | null | undefined): void {
  if (rationale === null || rationale === undefined) {
    return;
  }

  if (rationale.trim().length > 0) {
    if (rationale.length < RATIONALE_MIN_LENGTH) {
      throw ValidationError.single(
        'rationale_md',
        `Rationale must be at least ${RATIONALE_MIN_LENGTH} characters if provided`,
        rationale
      );
    }

    if (rationale.length > RATIONALE_MAX_LENGTH) {
      throw ValidationError.single(
        'rationale_md',
        `Rationale must not exceed ${RATIONALE_MAX_LENGTH} characters`,
        rationale
      );
    }
  }
}

/**
 * Validate vote conditions
 */
export function validateVoteConditions(conditions: Array<{ condition_text: string; order_index: number }>): void {
  if (!conditions || conditions.length === 0) {
    return;
  }

  const violations: Array<{ field: string; message: string; value?: unknown }> = [];

  const orderIndices = new Set<number>();

  conditions.forEach((condition, index) => {
    if (!condition.condition_text || condition.condition_text.trim().length === 0) {
      violations.push({
        field: `conditions[${index}].condition_text`,
        message: 'Condition text cannot be empty',
        value: condition.condition_text,
      });
    }

    if (condition.condition_text && condition.condition_text.length < CONDITION_MIN_LENGTH) {
      violations.push({
        field: `conditions[${index}].condition_text`,
        message: `Condition must be at least ${CONDITION_MIN_LENGTH} characters`,
        value: condition.condition_text,
      });
    }

    if (condition.condition_text && condition.condition_text.length > CONDITION_MAX_LENGTH) {
      violations.push({
        field: `conditions[${index}].condition_text`,
        message: `Condition must not exceed ${CONDITION_MAX_LENGTH} characters`,
        value: condition.condition_text.length,
      });
    }

    if (!Number.isInteger(condition.order_index) || condition.order_index < 0) {
      violations.push({
        field: `conditions[${index}].order_index`,
        message: 'Order index must be a non-negative integer',
        value: condition.order_index,
      });
    }

    if (orderIndices.has(condition.order_index)) {
      violations.push({
        field: `conditions[${index}].order_index`,
        message: `Duplicate order_index: ${condition.order_index}`,
        value: condition.order_index,
      });
    }

    orderIndices.add(condition.order_index);
  });

  if (violations.length > 0) {
    throw new ValidationError('Vote conditions validation failed', violations);
  }
}

/**
 * Check if all agents have voted
 */
export function hasAllAgentsVoted(votes: Array<{ agent_id: AgentId }>): boolean {
  const votedAgents = new Set(votes.map(v => v.agent_id));
  return votedAgents.size === TOTAL_AGENTS;
}

/**
 * Check if all votes are unanimous approval
 */
export function isUnanimousApproval(votes: Array<{ choice: VoteChoice }>): boolean {
  if (votes.length !== TOTAL_AGENTS) {
    return false;
  }
  return votes.every(v => v.choice === 'approve');
}

/**
 * Get missing agent votes
 */
export function getMissingAgentVotes(votes: Array<{ agent_id: AgentId }>): AgentId[] {
  const votedAgents = new Set(votes.map(v => v.agent_id));
  return VALID_AGENT_IDS.filter(agentId => !votedAgents.has(agentId));
}

/**
 * Get vote summary statistics
 */
export function getVoteSummary(votes: Array<{ choice: VoteChoice }>): {
  total: number;
  approve: number;
  reject: number;
  abstain: number;
  allVoted: boolean;
  unanimousApproval: boolean;
} {
  const approve = votes.filter(v => v.choice === 'approve').length;
  const reject = votes.filter(v => v.choice === 'reject').length;
  const abstain = votes.filter(v => v.choice === 'abstain').length;

  return {
    total: votes.length,
    approve,
    reject,
    abstain,
    allVoted: votes.length === TOTAL_AGENTS,
    unanimousApproval: isUnanimousApproval(votes),
  };
}

/**
 * Validate vote data
 */
export function validateVoteData(data: {
  topic_id: string;
  agent_id: AgentId;
  choice: VoteChoice;
  rationale_md?: string | null;
}): void {
  const violations: Array<{ field: string; message: string; value?: unknown }> = [];

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(data.topic_id)) {
    violations.push({
      field: 'topic_id',
      message: 'Invalid topic_id format',
      value: data.topic_id,
    });
  }

  if (!isValidVoteAgentId(data.agent_id)) {
    violations.push({
      field: 'agent_id',
      message: `Invalid agent_id. Must be one of: ${VALID_AGENT_IDS.join(', ')}`,
      value: data.agent_id,
    });
  }

  if (!isValidVoteChoice(data.choice)) {
    violations.push({
      field: 'choice',
      message: `Invalid choice. Must be one of: ${VALID_VOTE_CHOICES.join(', ')}`,
      value: data.choice,
    });
  }

  try {
    validateVoteRationale(data.rationale_md);
  } catch (error) {
    if (error instanceof ValidationError) {
      violations.push(...error.violations);
    }
  }

  if (violations.length > 0) {
    throw new ValidationError('Vote validation failed', violations);
  }
}

/**
 * Check if vote can be changed
 */
export function canChangeVote(currentChoice: VoteChoice, newChoice: VoteChoice): boolean {
  return currentChoice !== newChoice;
}

/**
 * Get vote decision outcome
 */
export function getVoteOutcome(votes: Array<{ choice: VoteChoice }>): 'approved' | 'rejected' | 'pending' {
  if (votes.length < TOTAL_AGENTS) {
    return 'pending';
  }

  const summary = getVoteSummary(votes);

  if (summary.unanimousApproval) {
    return 'approved';
  }

  if (summary.reject > 0) {
    return 'rejected';
  }

  if (summary.abstain === summary.total) {
    return 'rejected';
  }

  return 'pending';
}
