import { Router } from 'express';
import { SystemController } from '../controllers/systemController.js';
import { requireAuth } from '../../../middleware/auth.js';
import { requireRole } from '../../../middleware/rbac.js';

const router = Router();
const systemController = new SystemController();

router.get('/health', systemController.getSystemHealth.bind(systemController));

router.get(
  '/rate-limits',
  requireAuth,
  requireRole('admin'),
  systemController.getRateLimitStats.bind(systemController)
);

router.post(
  '/rate-limits/clear',
  requireAuth,
  requireRole('admin'),
  systemController.clearRateLimitViolations.bind(systemController)
);

export default router;
