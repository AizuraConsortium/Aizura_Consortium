import { Router } from 'express';
import { createRateLimit } from '../../shared/middleware/validation.js';
import { getContainer } from '../../shared/infrastructure/Container.js';

const router = Router();

/**
 * Factory function to create realtime routes with container dependency
 * Routes are configured to get the controller from the container
 */
export default function createRealtimeRoutes(): Router {
  const container = getContainer();
  const realtimeController = container.get('realtimeController');

  /**
   * GET /api/website/realtime/messages/:topicId
   * Stream real-time messages for a topic
   */
  router.get(
    '/messages/:topicId',
    createRateLimit('GET:/api/website/realtime/messages/:topicId'),
    realtimeController.streamMessages.bind(realtimeController)
  );

  return router;
}
