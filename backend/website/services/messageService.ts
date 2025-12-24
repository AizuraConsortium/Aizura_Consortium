import { createMessagesRepository, type Pagination } from '../../shared/services/supabase/repositories/messages.js';
import { getWebsiteSupabaseClient } from '../config/supabaseWebsiteClient.js';
import type { Message } from '../../../shared/types/models.js';
import type { PaginatedMessages } from '../../../shared/types/api.js';

export type { Pagination, PaginatedMessages };

export class MessageService {
  private messagesRepo = createMessagesRepository(getWebsiteSupabaseClient());

  async getTopicMessages(
    topicId: string,
    pagination: Pagination = {}
  ): Promise<PaginatedMessages<Message>> {
    return this.messagesRepo.getTopicMessages(topicId, pagination);
  }

  async getMessageById(messageId: string): Promise<Message | null> {
    return this.messagesRepo.getMessageById(messageId);
  }
}
