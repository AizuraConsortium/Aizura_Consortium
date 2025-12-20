import { Router } from 'express';
import { MessageController } from '../controllers/messageController.js';
import { createRateLimit } from '../../shared/middleware/validation.js';

const router = Router();
const messageController = new MessageController();

router.get(
  '/topic/:topicId',
  createRateLimit('GET:/api/website/messages/topic/:topicId'),
  messageController.getTopicMessages.bind(messageController)
);

router.get(
  '/:messageId',
  createRateLimit('GET:/api/website/messages/:messageId'),
  messageController.getMessageById.bind(messageController)
);

export default router;
