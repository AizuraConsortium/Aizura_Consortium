import { Router } from 'express';
import { MessageController } from '../controllers/messageController.js';
import { createRateLimit } from '../../shared/middleware/validation.js';
import { parsePagination } from '../../shared/middleware/pagination.js';

const router = Router();
const messageController = new MessageController();

/**
 * GET /api/website/messages/topic/:topicId
 * Get messages for a topic with pagination
 */
router.get(
  '/topic/:topicId',
  createRateLimit('GET:/api/website/messages/topic/:topicId'),
  parsePagination({ defaultLimit: 50, maxLimit: 100 }),
  messageController.getTopicMessages.bind(messageController)
);

router.get(
  '/:messageId',
  createRateLimit('GET:/api/website/messages/:messageId'),
  messageController.getMessageById.bind(messageController)
);

export default router;
