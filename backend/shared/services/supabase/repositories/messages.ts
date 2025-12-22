import { create, getMany, updateById } from '../queryBuilder.js';
import type { Message, MessageToolCall, AgentId, AgentRole, Phase, AgentMessage, AgentVoteMessage, ToolCall, PaginatedMessages, PlanOperation, VoteChoice } from '../../../../../shared/types/index.js';
import type { Database } from '../../../../../shared/types/database.types.js';
import { supabase } from '../client.js';

type Json = Database['public']['Tables']['message_proposed_actions']['Row']['data'];

export async function insertMessage(
  topicId: string,
  agentId: AgentId,
  agentRole: AgentRole,
  phase: Phase,
  importance: number,
  body: AgentMessage | AgentVoteMessage,
  selected: boolean
): Promise<Message> {
  const messageType = body.type;

  const messageData = messageType === 'message'
    ? {
        message_type: 'message' as const,
        message_title: body.message.title,
        message_body_md: body.message.body_md,
        message_citations: body.message.citations || null,
        vote_choice: null,
        vote_rationale_md: null,
        vote_conditions: null,
      }
    : {
        message_type: 'vote' as const,
        message_title: null,
        message_body_md: null,
        message_citations: null,
        vote_choice: body.vote.choice,
        vote_rationale_md: body.vote.rationale_md,
        vote_conditions: body.vote.conditions || null,
      };

  const message = await create<Message>('messages', {
    topic_id: topicId,
    agent_id: agentId,
    agent_role: agentRole,
    phase,
    importance,
    ...messageData,
    selected
  });

  if (messageType === 'message' && body.tool_calls && body.tool_calls.length > 0) {
    await insertToolCalls(message.id, body.tool_calls);
  }

  if (messageType === 'message' && body.message.proposed_actions && body.message.proposed_actions.length > 0) {
    await insertProposedActions(message.id, body.message.proposed_actions);
  }

  return message;
}

async function insertToolCalls(messageId: string, toolCalls: ToolCall[]): Promise<void> {
  const toolCallsData = toolCalls.map(tc => ({
    message_id: messageId,
    tool: tc.tool,
    op: tc.args.op,
    path: tc.args.path,
    target_path: tc.args.target_path || null,
    after_section: tc.args.after || null,
    content_md: tc.args.content_md || null,
    attribution_agent_id: tc.args.metadata?.attribution_agent_id || null,
    tags: tc.args.metadata?.tags || null,
  }));

  const { error } = await supabase
    .from('message_tool_calls')
    .insert(toolCallsData);

  if (error) throw error;
}

async function insertProposedActions(messageId: string, proposedActions: Array<{ kind: string; [key: string]: Json }>): Promise<void> {
  const actionsData = proposedActions.map(action => {
    const { kind, ...rest } = action;
    return {
      message_id: messageId,
      kind,
      data: rest as Json,
    };
  });

  const { error } = await supabase
    .from('message_proposed_actions')
    .insert(actionsData);

  if (error) throw error;
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

export async function getMessageWithRelations(messageId: string): Promise<Message & { tool_calls?: MessageToolCall[]; proposed_actions?: any[] }> {
  const message = await getMany<Message>('messages', { id: messageId }, { limit: 1 });
  if (!message || message.length === 0) {
    throw new Error(`Message not found: ${messageId}`);
  }

  const toolCalls = await getMany<MessageToolCall>('message_tool_calls', { message_id: messageId });

  const { data: proposedActions } = await supabase
    .from('message_proposed_actions')
    .select('*')
    .eq('message_id', messageId);

  return {
    ...message[0],
    tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
    proposed_actions: proposedActions && proposedActions.length > 0 ? proposedActions : undefined,
  };
}

export function reconstructMessageBody(
  message: Message,
  toolCalls?: MessageToolCall[],
  proposedActions?: Array<{ kind: string; data: Json }>
): AgentMessage | AgentVoteMessage {
  if (message.message_type === 'message') {
    const agentMessage: AgentMessage = {
      type: 'message',
      topic_id: message.topic_id,
      agent_id: message.agent_id,
      importance: message.importance,
      phase: message.phase as Phase,
      message: {
        title: message.message_title!,
        body_md: message.message_body_md!,
        citations: message.message_citations || undefined,
        proposed_actions: proposedActions?.map(pa => ({
          kind: pa.kind,
          ...(pa.data as Record<string, unknown>)
        })),
      },
    };

    if (toolCalls && toolCalls.length > 0) {
      agentMessage.tool_calls = toolCalls.map(tc => ({
        tool: 'plan_editor' as const,
        args: {
          op: tc.op as PlanOperation,
          path: tc.path,
          target_path: tc.target_path || undefined,
          after: tc.after_section || undefined,
          content_md: tc.content_md || undefined,
          metadata: {
            attribution_agent_id: tc.attribution_agent_id as AgentId,
            tags: tc.tags || undefined,
          },
        },
      }));
    }

    return agentMessage;
  } else {
    return {
      type: 'vote',
      topic_id: message.topic_id,
      agent_id: message.agent_id,
      importance: message.importance,
      vote: {
        choice: message.vote_choice as VoteChoice,
        rationale_md: message.vote_rationale_md!,
        conditions: message.vote_conditions || undefined,
      },
    };
  }
}

export interface Pagination {
  limit?: number;
  offset?: number;
}

export async function getTopicMessages(
  topicId: string,
  pagination: Pagination = {}
): Promise<PaginatedMessages<Message>> {
  const limit = pagination.limit || 50;
  const offset = pagination.offset || 0;

  const { data, error, count } = await supabase
    .from('messages')
    .select('*', { count: 'exact' })
    .eq('topic_id', topicId)
    .eq('selected', true)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    messages: data || [],
    total: count || 0,
    hasMore: (count || 0) > offset + limit,
  };
}

export async function getMessageById(messageId: string): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', messageId)
    .eq('selected', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}
