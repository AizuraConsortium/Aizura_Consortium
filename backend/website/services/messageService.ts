import {
  getTopicMessages,
  getMessageById,
  type Pagination,
  type PaginatedMessages,
} from '../../shared/services/supabase/repositories/messages.js';
import type { Database } from '../../../shared/types/database.types.js';

type Message = Database['public']['Tables']['messages']['Row'];

export { Pagination, PaginatedMessages };

export class MessageService {
  async getTopicMessages(
    topicId: string,
    pagination: Pagination = {}
  ): Promise<PaginatedMessages> {
    return getTopicMessages(topicId, pagination);
  }

  async getMessageById(messageId: string): Promise<Message | null> {
    return getMessageById(messageId);
  }
}
