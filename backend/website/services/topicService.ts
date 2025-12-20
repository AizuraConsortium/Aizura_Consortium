import { getCurrentTopic, getTopic } from '../../shared/services/supabase/repositories/topics.js';
import { getProposalById } from '../../shared/services/supabase/repositories/proposals.js';
import { getPlan } from '../../shared/services/supabase/repositories/plans.js';
import type { Database } from '../../../shared/types/database.types.js';

type Topic = Database['public']['Tables']['topics']['Row'];
type Proposal = Database['public']['Tables']['proposals']['Row'];
type Plan = Database['public']['Tables']['plans']['Row'];

export interface TopicWithDetails extends Topic {
  proposal: Proposal | null;
  plan: Plan | null;
}

export class TopicService {
  async getCurrentTopic(): Promise<TopicWithDetails | null> {
    const topic = await getCurrentTopic();

    if (!topic) {
      return null;
    }

    const proposal = await getProposalById(topic.proposal_id);
    const plan = await getPlan(topic.id);

    return {
      ...topic,
      proposal: proposal || null,
      plan: plan || null,
    };
  }

  async getTopicById(topicId: string): Promise<TopicWithDetails | null> {
    const topic = await getTopic(topicId);

    if (!topic) {
      return null;
    }

    const proposal = await getProposalById(topic.proposal_id);
    const plan = await getPlan(topic.id);

    return {
      ...topic,
      proposal: proposal || null,
      plan: plan || null,
    };
  }
}
