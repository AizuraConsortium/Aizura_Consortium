import { Router } from 'express';
import { RealtimeController } from '../controllers/realtimeController.js';
import { RealtimeService } from '../services/realtimeService.js';
import { createRateLimit } from '../../shared/middleware/validation.js';

const router = Router();
const realtimeService = new RealtimeService();
const realtimeController = new RealtimeController(realtimeService);

router.get(
  '/messages/:topicId',
  createRateLimit('GET:/api/website/realtime/messages/:topicId'),
  realtimeController.streamMessages.bind(realtimeController)
);

export default router;

export { realtimeService };
