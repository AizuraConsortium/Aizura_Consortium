import { Router } from 'express';
import { HealthController } from '../controllers/healthController.js';
import { createRateLimit } from '../middleware/validation.js';

const router = Router();
export const healthController = new HealthController();

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

export default router;
