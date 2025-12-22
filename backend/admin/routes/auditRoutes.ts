import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';
import { getContainer } from '../../shared/infrastructure/Container.js';

const router = Router();

/**
 * Factory function to create audit routes with container dependency
 * Routes are configured to get the controller from the container
 */
export default function createAuditRoutes(): Router {
  const container = getContainer();
  const auditController = container.get('auditController');

  /**
   * GET /api/admin/audit
   * Get admin actions with optional filters
   */
  router.get(
    '/',
    createRateLimit('GET:/api/admin/audit'),
    requireAuth,
    requireRole('admin'),
    auditController.getAdminActions.bind(auditController)
  );

  /**
   * GET /api/admin/audit/recent
   * Get recent admin actions within specified time window
   */
  router.get(
    '/recent',
    createRateLimit('GET:/api/admin/audit/recent'),
    requireAuth,
    requireRole('admin'),
    auditController.getRecentAdminActions.bind(auditController)
  );

  return router;
}
