import * as MessagesRepo from '../repositories/messages.js';
import type { Message } from '../../../shared/types/index.js';

export type { Pagination, PaginatedMessages } from '../repositories/messages.js';

export class MessageService {
  async getTopicMessages(
    topicId: string,
    pagination: MessagesRepo.Pagination = {}
  ): Promise<MessagesRepo.PaginatedMessages> {
    return MessagesRepo.getTopicMessages(topicId, pagination);
  }

  async getMessageById(messageId: string): Promise<Message | null> {
    return MessagesRepo.getMessageById(messageId);
  }
}
