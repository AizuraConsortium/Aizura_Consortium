import { Router } from 'express';
import { ErrorController } from '../controllers/errorController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';
import { requireWhitelistedIP } from '../middleware/ipWhitelist.js';
import { adminActionLogger } from '../../shared/middleware/adminActionLogger.js';

const router = Router();
const errorController = new ErrorController();

router.get(
  '/recent',
  createRateLimit('GET:/api/admin/errors/recent'),
  requireAuth,
  requireRole('admin'),
  errorController.getRecentErrors.bind(errorController)
);

router.get(
  '/admin',
  createRateLimit('GET:/api/admin/errors/admin'),
  requireAuth,
  requireRole('admin'),
  errorController.getAdminErrors.bind(errorController)
);

router.delete(
  '/:id',
  createRateLimit('DELETE:/api/admin/errors/:id'),
  requireAuth,
  requireRole('admin'),
  requireWhitelistedIP,
  adminActionLogger,
  errorController.deleteError.bind(errorController)
);

router.post(
  '/cleanup',
  createRateLimit('POST:/api/admin/errors/cleanup'),
  requireAuth,
  requireRole('admin'),
  requireWhitelistedIP,
  adminActionLogger,
  errorController.cleanupOldErrors.bind(errorController)
);

export default router;
