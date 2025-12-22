import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';
import { getAdminActionsWithFilters, getRecentAdminActions } from '../../shared/services/supabase/repositories/adminActions.js';

const router = Router();

router.get(
  '/',
  createRateLimit('GET:/api/admin/audit'),
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const filters = {
        admin_user_id: req.query.admin_user_id as string | undefined,
        action_type: req.query.action_type as string | undefined,
        resource_type: req.query.resource_type as string | undefined,
        status: req.query.status as string | undefined,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0,
      };

      const result = await getAdminActionsWithFilters(filters);
      res.json(result);
    } catch (error) {
      console.error('Error fetching admin actions:', error);
      res.status(500).json({ error: 'Failed to fetch admin actions' });
    }
  }
);

router.get(
  '/recent',
  createRateLimit('GET:/api/admin/audit/recent'),
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const actions = await getRecentAdminActions(hours);
      res.json({ actions, count: actions.length });
    } catch (error) {
      console.error('Error fetching recent admin actions:', error);
      res.status(500).json({ error: 'Failed to fetch recent admin actions' });
    }
  }
);

export default router;
