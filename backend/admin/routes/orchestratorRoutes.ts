import { Router } from 'express';
import { OrchestratorController } from '../controllers/orchestratorController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';
import { requireWhitelistedIP } from '../middleware/ipWhitelist.js';
import { adminActionLogger } from '../../shared/middleware/adminActionLogger.js';

const router = Router();
const orchestratorController = new OrchestratorController();

export { orchestratorController };

router.get(
  '/status',
  createRateLimit('GET:/api/admin/orchestrator/status'),
  requireAuth,
  requireRole('admin'),
  orchestratorController.getStatus.bind(orchestratorController)
);

router.post(
  '/stop',
  createRateLimit('POST:/api/admin/orchestrator/stop'),
  requireAuth,
  requireRole('admin'),
  requireWhitelistedIP,
  adminActionLogger,
  orchestratorController.stop.bind(orchestratorController)
);

router.post(
  '/start',
  createRateLimit('POST:/api/admin/orchestrator/start'),
  requireAuth,
  requireRole('admin'),
  requireWhitelistedIP,
  adminActionLogger,
  orchestratorController.start.bind(orchestratorController)
);

router.post(
  '/force-unlock',
  createRateLimit('POST:/api/admin/orchestrator/force-unlock'),
  requireAuth,
  requireRole('admin'),
  requireWhitelistedIP,
  adminActionLogger,
  orchestratorController.forceReleaseLock.bind(orchestratorController)
);

export default router;
