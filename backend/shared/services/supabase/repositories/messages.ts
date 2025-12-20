import { create, getMany, updateById } from '../queryBuilder.js';
import type { Message, AgentId, AgentRole, Phase, AgentMessage, AgentVoteMessage } from '../../../../../shared/types/index.js';

export async function insertMessage(
  topicId: string,
  agentId: AgentId,
  agentRole: AgentRole,
  phase: Phase,
  importance: number,
  body: AgentMessage | AgentVoteMessage,
  selected: boolean
): Promise<Message> {
  return create<Message>('messages', {
    topic_id: topicId,
    agent_id: agentId,
    agent_role: agentRole,
    phase,
    importance,
    body: body as any,
    selected
  });
}

export async function getRecentMessages(
  topicId: string,
  limit: number = 20
): Promise<Message[]> {
  return getMany<Message>(
    'messages',
    { topic_id: topicId, selected: true },
    { orderBy: 'created_at', ascending: false, limit }
  );
}

export async function getMessagesInCurrentTick(
  topicId: string,
  agentIds: AgentId[]
): Promise<Message[]> {
  return getMany<Message>(
    'messages',
    { topic_id: topicId, agent_id: agentIds },
    { orderBy: 'created_at', ascending: false, limit: agentIds.length }
  );
}

export async function markMessageAsSelected(
  messageId: string
): Promise<void> {
  await updateById('messages', messageId, { selected: true });
}
