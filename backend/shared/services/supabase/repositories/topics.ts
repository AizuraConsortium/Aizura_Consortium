import { create, updateById, query, getById } from '../queryBuilder.js';
import type { Topic, Phase } from '../../../../../shared/types/index.js';

export async function createTopic(proposalId: string): Promise<Topic> {
  return create<Topic>('topics', {
    proposal_id: proposalId,
    state: 'intake'
  });
}

export async function getTopic(topicId: string): Promise<Topic | null> {
  try {
    return await getById<Topic>('topics', topicId);
  } catch (error) {
    return null;
  }
}

export async function updateTopicState(
  topicId: string,
  state: Phase
): Promise<void> {
  await updateById('topics', topicId, { state });
}

export async function endTopic(topicId: string): Promise<void> {
  await updateById('topics', topicId, {
    ended_at: new Date().toISOString(),
    state: 'commit'
  });
}

export async function getCurrentTopic(): Promise<Topic | null> {
  const { data, error } = await query('topics')
    .select('*')
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
