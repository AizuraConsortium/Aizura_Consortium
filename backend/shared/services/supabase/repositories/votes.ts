import { create, getMany, rpc } from '../queryBuilder.js';
import { getSupabaseClient } from '../client.js';
import type { AgentVote, AgentId } from '../../../../../shared/types/models.js';

export async function addAgentVote(
  topicId: string,
  agentId: AgentId,
  choice: 'approve' | 'reject' | 'abstain',
  rationaleMd: string,
  conditions: string[]
): Promise<AgentVote> {
  const vote = await create<AgentVote>('agent_votes', {
    topic_id: topicId,
    agent_id: agentId,
    choice,
    rationale_md: rationaleMd
  });

  if (conditions && conditions.length > 0) {
    const conditionRecords = conditions.map((conditionText, index) => ({
      agent_vote_id: vote.id,
      condition_text: conditionText,
      order_index: index
    }));

    const { error } = await getSupabaseClient()
      .from('agent_vote_conditions')
      .insert(conditionRecords);

    if (error) throw error;
  }

  return vote;
}

export async function getAgentVotes(topicId: string): Promise<AgentVote[]> {
  return getMany<AgentVote>('agent_votes', { topic_id: topicId });
}

export async function getAgentVoteConditions(voteId: string): Promise<string[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('agent_vote_conditions')
    .select('condition_text')
    .eq('agent_vote_id', voteId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data?.map(c => c.condition_text) || [];
}

export async function clearAgentVotes(topicId: string): Promise<void> {
  await rpc('clear_agent_votes_for_topic', { topic_id_param: topicId });
}
