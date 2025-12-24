/**
 * Runtime Type Guards
 *
 * Provides runtime validation for TypeScript types, bridging
 * compile-time and runtime type safety.
 */

import type {
  ProposalStatus,
  AgentId,
  AgentRole,
  Phase,
  ErrorSeverity,
  ErrorSource,
  Proposal,
  Topic,
  Message
} from '../types/models.js';

/**
 * Proposal Status Guards
 */
const VALID_PROPOSAL_STATUSES = ['queued', 'in_debate', 'adopted', 'rejected'] as const;

export function isProposalStatus(value: unknown): value is ProposalStatus {
  return typeof value === 'string' &&
    (VALID_PROPOSAL_STATUSES as readonly string[]).includes(value);
}

export function assertProposalStatus(value: unknown): asserts value is ProposalStatus {
  if (!isProposalStatus(value)) {
    throw new TypeError(`Invalid proposal status: ${value}. Must be one of: ${VALID_PROPOSAL_STATUSES.join(', ')}`);
  }
}

/**
 * Agent ID Guards
 */
const VALID_AGENT_IDS = ['claude', 'chatgpt', 'grok', 'gemini', 'deepseek', 'qwen'] as const;

export function isAgentId(value: unknown): value is AgentId {
  return typeof value === 'string' &&
    (VALID_AGENT_IDS as readonly string[]).includes(value);
}

export function assertAgentId(value: unknown): asserts value is AgentId {
  if (!isAgentId(value)) {
    throw new TypeError(`Invalid agent ID: ${value}. Must be one of: ${VALID_AGENT_IDS.join(', ')}`);
  }
}

/**
 * Agent Role Guards
 */
const VALID_AGENT_ROLES = [
  'product-strategy',
  'engineering-arch',
  'gtm-marketing',
  'ops-automation',
  'finance-tokenomics',
  'risk-compliance'
] as const;

export function isAgentRole(value: unknown): value is AgentRole {
  return typeof value === 'string' &&
    (VALID_AGENT_ROLES as readonly string[]).includes(value);
}

export function assertAgentRole(value: unknown): asserts value is AgentRole {
  if (!isAgentRole(value)) {
    throw new TypeError(`Invalid agent role: ${value}`);
  }
}

/**
 * Phase Guards
 */
const VALID_PHASES = ['intake', 'debate', 'plan_drafting', 'pre_vote', 'vote', 'commit', 'idle'] as const;

export function isPhase(value: unknown): value is Phase {
  return typeof value === 'string' &&
    (VALID_PHASES as readonly string[]).includes(value);
}

/**
 * Error Severity Guards
 */
const VALID_ERROR_SEVERITIES = ['info', 'warning', 'error', 'critical'] as const;

export function isErrorSeverity(value: unknown): value is ErrorSeverity {
  return typeof value === 'string' &&
    (VALID_ERROR_SEVERITIES as readonly string[]).includes(value);
}

/**
 * Error Source Guards
 */
const VALID_ERROR_SOURCES = ['frontend', 'backend', 'agent'] as const;

export function isErrorSource(value: unknown): value is ErrorSource {
  return typeof value === 'string' &&
    (VALID_ERROR_SOURCES as readonly string[]).includes(value);
}

/**
 * Object Type Guards
 */
export function isProposal(value: unknown): value is Proposal {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    (obj.summary === null || typeof obj.summary === 'string') &&
    isProposalStatus(obj.status) &&
    typeof obj.votes_for === 'number' &&
    typeof obj.votes_against === 'number' &&
    typeof obj.created_at === 'string'
  );
}

export function isTopic(value: unknown): value is Topic {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.proposal_id === 'string' &&
    isPhase(obj.state) &&
    typeof obj.started_at === 'string'
  );
}

export function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== 'object') return false;

  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.topic_id === 'string' &&
    isAgentId(obj.agent_id) &&
    isAgentRole(obj.agent_role) &&
    typeof obj.importance === 'number' &&
    (obj.message_type === 'message' || obj.message_type === 'vote')
  );
}

/**
 * Array Guards with Type Narrowing
 */
export function isProposalArray(value: unknown): value is Proposal[] {
  return Array.isArray(value) && value.every(isProposal);
}

export function isMessageArray(value: unknown): value is Message[] {
  return Array.isArray(value) && value.every(isMessage);
}

/**
 * Utility: Safe Type Cast with Validation
 */
export function safeCast<T>(
  value: unknown,
  guard: (val: unknown) => val is T,
  errorMessage?: string
): T {
  if (guard(value)) {
    return value;
  }
  throw new TypeError(errorMessage || `Type guard failed for value: ${JSON.stringify(value)}`);
}
