import { Router } from 'express';
import { TopicController } from '../controllers/topicController.js';

const router = Router();
const topicController = new TopicController();

router.get('/current', topicController.getCurrentTopic.bind(topicController));
router.get('/:topicId', topicController.getTopicById.bind(topicController));

export default router;
