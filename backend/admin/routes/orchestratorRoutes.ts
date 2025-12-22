import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';
import { requireWhitelistedIP } from '../middleware/ipWhitelist.js';
import { adminActionLogger } from '../../shared/middleware/adminActionLogger.js';
import { getContainer } from '../../shared/infrastructure/Container.js';

const router = Router();

/**
 * Factory function to create orchestrator routes with container dependency
 * Routes are configured to get the controller from the container
 */
export default function createOrchestratorRoutes(): Router {
  const container = getContainer();
  const orchestratorController = container.get('orchestratorController');

  /**
   * GET /api/admin/orchestrator/status
   * Get orchestrator status
   */
  router.get(
    '/status',
    createRateLimit('GET:/api/admin/orchestrator/status'),
    requireAuth,
    requireRole('admin'),
    orchestratorController.getStatus.bind(orchestratorController)
  );

  /**
   * POST /api/admin/orchestrator/stop
   * Stop the orchestrator
   */
  router.post(
    '/stop',
    createRateLimit('POST:/api/admin/orchestrator/stop'),
    requireAuth,
    requireRole('admin'),
    requireWhitelistedIP,
    adminActionLogger,
    orchestratorController.stop.bind(orchestratorController)
  );

  /**
   * POST /api/admin/orchestrator/start
   * Start the orchestrator
   */
  router.post(
    '/start',
    createRateLimit('POST:/api/admin/orchestrator/start'),
    requireAuth,
    requireRole('admin'),
    requireWhitelistedIP,
    adminActionLogger,
    orchestratorController.start.bind(orchestratorController)
  );

  /**
   * POST /api/admin/orchestrator/force-unlock
   * Force release orchestrator lock
   */
  router.post(
    '/force-unlock',
    createRateLimit('POST:/api/admin/orchestrator/force-unlock'),
    requireAuth,
    requireRole('admin'),
    requireWhitelistedIP,
    adminActionLogger,
    orchestratorController.forceReleaseLock.bind(orchestratorController)
  );

  return router;
}
