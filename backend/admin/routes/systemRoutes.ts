import { Router } from 'express';
import { SystemController } from '../controllers/systemController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';
import { requireWhitelistedIP } from '../middleware/ipWhitelist.js';

const router = Router();
const systemController = new SystemController();

router.get(
  '/health',
  createRateLimit('GET:/api/admin/system/health'),
  systemController.getSystemHealth.bind(systemController)
);

router.get(
  '/rate-limits',
  createRateLimit('GET:/api/admin/system/rate-limits'),
  requireAuth,
  requireRole('admin'),
  systemController.getRateLimitStats.bind(systemController)
);

router.post(
  '/rate-limits/clear',
  createRateLimit('POST:/api/admin/system/rate-limits/clear'),
  requireAuth,
  requireRole('admin'),
  requireWhitelistedIP,
  systemController.clearRateLimitViolations.bind(systemController)
);

export default router;
