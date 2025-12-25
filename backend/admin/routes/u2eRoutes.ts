/**
 * U2E Admin Routes
 *
 * Administrative endpoints for managing the U2E system.
 */

import { Router } from 'express';
import { u2eAdminController } from '../controllers/u2eAdminController';
import { requireAuth } from '../../shared/middleware/auth';
import { requireRole } from '../../shared/middleware/rbac';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin'));

router.post('/system/toggle', (req, res) =>
  u2eAdminController.toggleSystem(req, res)
);

router.post('/rates/update', (req, res) =>
  u2eAdminController.updateRate(req, res)
);

router.post('/business/toggle', (req, res) =>
  u2eAdminController.toggleBusiness(req, res)
);

router.get('/overview', (req, res) => u2eAdminController.getOverview(req, res));

router.post('/stats/refresh', (req, res) =>
  u2eAdminController.refreshStats(req, res)
);

export default router;
