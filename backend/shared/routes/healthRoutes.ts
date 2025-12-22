import { Router } from 'express';
import { createRateLimit } from '../middleware/validation.js';
import { getContainer } from '../infrastructure/Container.js';

const router = Router();

/**
 * Factory function to create health routes with container dependency
 * Routes are configured to get the controller from the container
 */
export default function createHealthRoutes(): Router {
  const container = getContainer();
  const healthController = container.get('healthController');

  /**
   * GET /health
   * Checks overall system health including database connectivity
   */
  router.get(
    '/',
    createRateLimit('GET:/health'),
    healthController.checkHealth.bind(healthController)
  );

  /**
   * GET /health/orchestrator
   * Checks orchestrator health and leadership status
   */
  router.get(
    '/orchestrator',
    createRateLimit('GET:/health/orchestrator'),
    healthController.checkOrchestratorHealth.bind(healthController)
  );

  return router;
}
