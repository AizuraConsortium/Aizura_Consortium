import { Router } from 'express';
import { MessageController } from '../controllers/messageController.js';

const router = Router();
const messageController = new MessageController();

router.get('/topic/:topicId', messageController.getTopicMessages.bind(messageController));
router.get('/:messageId', messageController.getMessageById.bind(messageController));

export default router;
