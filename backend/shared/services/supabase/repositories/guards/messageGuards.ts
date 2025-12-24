/**
 * Message Type Guards and Validation
 *
 * Runtime validation for message-related data including agent mappings
 */

import { ValidationError } from '../errors/RepositoryError.js';
import type { Database } from '../../../../../../shared/types/database.types.js';
import type { AgentId, AgentRole } from '../../../../../../shared/types/models.js';
import { AGENT_ROLE_MAPPING } from '../../../../../../shared/types/models.js';

type MessageType = Database['public']['Tables']['messages']['Row']['message_type'];

const VALID_AGENT_IDS: readonly AgentId[] = ['claude', 'chatgpt', 'grok', 'gemini', 'deepseek', 'qwen'] as const;
const VALID_AGENT_ROLES: readonly AgentRole[] = [
  'product-strategy',
  'engineering-arch',
  'gtm-marketing',
  'ops-automation',
  'finance-tokenomics',
  'risk-compliance'
] as const;
const VALID_MESSAGE_TYPES: readonly MessageType[] = ['message', 'vote'] as const;

const IMPORTANCE_MIN = 1;
const IMPORTANCE_MAX = 10;
const MESSAGE_TITLE_MAX_LENGTH = 200;
const MESSAGE_BODY_MAX_LENGTH = 10000;

/**
 * Validate agent ID
 */
export function isValidAgentId(agentId: unknown): agentId is AgentId {
  return typeof agentId === 'string' && VALID_AGENT_IDS.includes(agentId as AgentId);
}

/**
 * Validate agent role
 */
export function isValidAgentRole(role: unknown): role is AgentRole {
  return typeof role === 'string' && VALID_AGENT_ROLES.includes(role as AgentRole);
}

/**
 * Validate message type
 */
export function isValidMessageType(type: unknown): type is MessageType {
  return typeof type === 'string' && VALID_MESSAGE_TYPES.includes(type as MessageType);
}

/**
 * Validate importance value (1-10)
 */
export function isValidImportance(importance: unknown): importance is number {
  return (
    typeof importance === 'number' &&
    Number.isInteger(importance) &&
    importance >= IMPORTANCE_MIN &&
    importance <= IMPORTANCE_MAX
  );
}

/**
 * Get the correct role for an agent ID
 */
export function getAgentRole(agentId: AgentId): AgentRole {
  return AGENT_ROLE_MAPPING[agentId];
}

/**
 * Validate agent ID and role match
 */
export function isAgentRoleMatchForAgent(agentId: AgentId, role: AgentRole): boolean {
  return AGENT_ROLE_MAPPING[agentId] === role;
}

/**
 * Validate agent ID and role consistency
 */
export function validateAgentRoleMatch(agentId: AgentId, role: AgentRole): void {
  if (!isAgentRoleMatchForAgent(agentId, role)) {
    throw ValidationError.single(
      'agent_role',
      `Invalid agent_role '${role}' for agent_id '${agentId}'. Expected: ${AGENT_ROLE_MAPPING[agentId]}`,
      { agentId, role }
    );
  }
}

/**
 * Validate importance value
 */
export function validateImportance(importance: number): void {
  if (!Number.isInteger(importance)) {
    throw ValidationError.single(
      'importance',
      'Importance must be an integer',
      importance
    );
  }

  if (importance < IMPORTANCE_MIN || importance > IMPORTANCE_MAX) {
    throw ValidationError.single(
      'importance',
      `Importance must be between ${IMPORTANCE_MIN} and ${IMPORTANCE_MAX}`,
      importance
    );
  }
}

/**
 * Validate message structure based on type
 */
export function validateMessageStructure(data: {
  message_type: MessageType;
  message_title?: string | null;
  message_body_md?: string | null;
  vote_choice?: string | null;
  vote_rationale_md?: string | null;
}): void {
  const violations: Array<{ field: string; message: string; value?: unknown }> = [];

  if (data.message_type === 'message') {
    if (!data.message_body_md || data.message_body_md.trim().length === 0) {
      violations.push({
        field: 'message_body_md',
        message: 'message_body_md is required for message type',
        value: data.message_body_md,
      });
    }

    if (data.message_body_md && data.message_body_md.length > MESSAGE_BODY_MAX_LENGTH) {
      violations.push({
        field: 'message_body_md',
        message: `message_body_md must not exceed ${MESSAGE_BODY_MAX_LENGTH} characters`,
        value: data.message_body_md.length,
      });
    }

    if (data.message_title && data.message_title.length > MESSAGE_TITLE_MAX_LENGTH) {
      violations.push({
        field: 'message_title',
        message: `message_title must not exceed ${MESSAGE_TITLE_MAX_LENGTH} characters`,
        value: data.message_title.length,
      });
    }
  } else if (data.message_type === 'vote') {
    if (!data.vote_choice || data.vote_choice.trim().length === 0) {
      violations.push({
        field: 'vote_choice',
        message: 'vote_choice is required for vote type',
        value: data.vote_choice,
      });
    }
  }

  if (violations.length > 0) {
    throw new ValidationError('Message structure validation failed', violations);
  }
}

/**
 * Validate citations format
 */
export function validateCitations(citations: unknown): void {
  if (citations === null || citations === undefined) {
    return;
  }

  if (!Array.isArray(citations)) {
    throw ValidationError.single(
      'message_citations',
      'Citations must be an array',
      citations
    );
  }

  if (!citations.every(c => typeof c === 'string')) {
    throw ValidationError.single(
      'message_citations',
      'All citations must be strings',
      citations
    );
  }
}

/**
 * Validate tool calls structure
 */
export function validateToolCallsStructure(toolCall: {
  op: string;
  path: string;
  tool?: string;
}): void {
  const violations: Array<{ field: string; message: string; value?: unknown }> = [];

  if (!toolCall.op || toolCall.op.trim().length === 0) {
    violations.push({
      field: 'op',
      message: 'op is required for tool call',
      value: toolCall.op,
    });
  }

  if (!toolCall.path || toolCall.path.trim().length === 0) {
    violations.push({
      field: 'path',
      message: 'path is required for tool call',
      value: toolCall.path,
    });
  }

  if (violations.length > 0) {
    throw new ValidationError('Tool call validation failed', violations);
  }
}

/**
 * Validate complete message data
 */
export function validateMessageData(data: {
  topic_id: string;
  agent_id: AgentId;
  agent_role: AgentRole;
  phase: string;
  importance: number;
  message_type: MessageType;
  message_title?: string | null;
  message_body_md?: string | null;
  message_citations?: string[] | null;
  vote_choice?: string | null;
  vote_rationale_md?: string | null;
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

  if (!isValidAgentId(data.agent_id)) {
    violations.push({
      field: 'agent_id',
      message: `Invalid agent_id. Must be one of: ${VALID_AGENT_IDS.join(', ')}`,
      value: data.agent_id,
    });
  }

  if (!isValidAgentRole(data.agent_role)) {
    violations.push({
      field: 'agent_role',
      message: `Invalid agent_role. Must be one of: ${VALID_AGENT_ROLES.join(', ')}`,
      value: data.agent_role,
    });
  }

  if (isValidAgentId(data.agent_id) && isValidAgentRole(data.agent_role)) {
    try {
      validateAgentRoleMatch(data.agent_id, data.agent_role);
    } catch (error) {
      if (error instanceof ValidationError) {
        violations.push(...error.violations);
      }
    }
  }

  if (!data.phase || data.phase.trim().length === 0) {
    violations.push({
      field: 'phase',
      message: 'phase is required',
      value: data.phase,
    });
  }

  try {
    validateImportance(data.importance);
  } catch (error) {
    if (error instanceof ValidationError) {
      violations.push(...error.violations);
    }
  }

  if (!isValidMessageType(data.message_type)) {
    violations.push({
      field: 'message_type',
      message: `Invalid message_type. Must be one of: ${VALID_MESSAGE_TYPES.join(', ')}`,
      value: data.message_type,
    });
  }

  try {
    validateMessageStructure(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      violations.push(...error.violations);
    }
  }

  if (data.message_citations) {
    try {
      validateCitations(data.message_citations);
    } catch (error) {
      if (error instanceof ValidationError) {
        violations.push(...error.violations);
      }
    }
  }

  if (violations.length > 0) {
    throw new ValidationError('Message validation failed', violations);
  }
}
