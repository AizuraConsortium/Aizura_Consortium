/**
 * Message Controller
 *
 * Handles message retrieval for the public website.
 * Uses standardized error handling and pagination from middleware.
 */

import { Request, Response } from 'express';
import { createMessagesRepository } from '../repositories/messages.js';
import { getWebsiteSupabaseClient } from '../../website/config/supabaseWebsiteClient.js';
import { handleControllerError } from '../../shared/utils/errorHandler.js';
import { NotFoundError } from '../../shared/errors/HttpErrors.js';
import { PaginatedRequest } from '../../shared/middleware/pagination.js';

export class MessageController {
  private messagesRepo = createMessagesRepository(getWebsiteSupabaseClient());

  /**
   * GET /api/website/messages/:topicId
   * Get messages for a specific topic
   * Pagination handled by middleware
   */
  async getTopicMessages(req: Request, res: Response): Promise<void> {
    try {
      const { topicId } = req.params;

      // Pagination is already parsed and validated by middleware
      const pagination = (req as PaginatedRequest).pagination;

      const result = await this.messagesRepo.getTopicMessages(topicId, pagination);
      res.json(result);
    } catch (error) {
      handleControllerError(error, res, {
        requestPath: req.path,
        requestMethod: req.method,
      });
    }
  }

  /**
   * GET /api/website/messages/single/:messageId
   * Get a specific message by ID
   */
  async getMessageById(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;
      const message = await this.messagesRepo.getMessageById(messageId);

      if (!message) {
        throw new NotFoundError('Message not found');
      }

      res.json(message);
    } catch (error) {
      handleControllerError(error, res, {
        requestPath: req.path,
        requestMethod: req.method,
      });
    }
  }
}
