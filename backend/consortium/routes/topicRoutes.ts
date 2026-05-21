import { Router } from 'express';
import { TopicController } from '../controllers/topicController.js';
import { createRateLimit } from '../../shared/middleware/validation.js';

const router = Router();
const topicController = new TopicController();

router.get(
  '/current',
  createRateLimit('GET:/api/website/topics/current'),
  topicController.getCurrentTopic.bind(topicController)
);

router.get(
  '/:topicId',
  createRateLimit('GET:/api/website/topics/:topicId'),
  topicController.getTopicById.bind(topicController)
);

export default router;
