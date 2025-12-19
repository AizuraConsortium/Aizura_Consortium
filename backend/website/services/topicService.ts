import { supabase } from '../../shared/services/supabase/client.js';
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
    const { data: topic, error: topicError } = await supabase
      .from('topics')
      .select('*')
      .is('ended_at', null)
      .single();

    if (topicError || !topic) {
      return null;
    }

    const { data: proposal } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', topic.proposal_id)
      .single();

    const { data: plan } = await supabase
      .from('plans')
      .select('*')
      .eq('topic_id', topic.id)
      .maybeSingle();

    return {
      ...topic,
      proposal: proposal || null,
      plan: plan || null,
    };
  }

  async getTopicById(topicId: string): Promise<TopicWithDetails | null> {
    const { data: topic, error: topicError } = await supabase
      .from('topics')
      .select('*')
      .eq('id', topicId)
      .single();

    if (topicError || !topic) {
      return null;
    }

    const { data: proposal } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', topic.proposal_id)
      .maybeSingle();

    const { data: plan } = await supabase
      .from('plans')
      .select('*')
      .eq('topic_id', topic.id)
      .maybeSingle();

    return {
      ...topic,
      proposal: proposal || null,
      plan: plan || null,
    };
  }
}
