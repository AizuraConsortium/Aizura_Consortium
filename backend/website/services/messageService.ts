import { supabase } from '../../shared/services/supabase/client.js';
import type { Database } from '../../../shared/types/database.types.js';

type Message = Database['public']['Tables']['messages']['Row'];

export interface Pagination {
  limit?: number;
  offset?: number;
}

export interface PaginatedMessages {
  messages: Message[];
  total: number;
  hasMore: boolean;
}

export class MessageService {
  async getTopicMessages(
    topicId: string,
    pagination: Pagination = {}
  ): Promise<PaginatedMessages> {
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

  async getMessageById(messageId: string): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .eq('selected', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}
