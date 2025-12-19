import { Router } from 'express';
import { ErrorController } from '../controllers/errorController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';

const router = Router();
const errorController = new ErrorController();

router.get('/recent', errorController.getRecentErrors.bind(errorController));

router.get(
  '/admin',
  requireAuth,
  requireRole('admin'),
  errorController.getAdminErrors.bind(errorController)
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),
  errorController.deleteError.bind(errorController)
);

router.post(
  '/cleanup',
  requireAuth,
  requireRole('admin'),
  errorController.cleanupOldErrors.bind(errorController)
);

export default router;
