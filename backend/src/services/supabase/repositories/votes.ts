import { create, getMany, rpc } from '../queryBuilder.js';
import type { AgentVote, AgentId } from '../../../../../shared/types/index.js';

export async function addAgentVote(
  topicId: string,
  agentId: AgentId,
  choice: 'approve' | 'reject' | 'abstain',
  rationaleMd: string,
  conditions: string[]
): Promise<AgentVote> {
  return create<AgentVote>('agent_votes', {
    topic_id: topicId,
    agent_id: agentId,
    choice,
    rationale_md: rationaleMd,
    conditions
  });
}

export async function getAgentVotes(topicId: string): Promise<AgentVote[]> {
  return getMany<AgentVote>('agent_votes', { topic_id: topicId });
}

export async function clearAgentVotes(topicId: string): Promise<void> {
  await rpc('clear_agent_votes_for_topic', { topic_id_param: topicId });
}
