import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';
import { requireWhitelistedIP } from '../middleware/ipWhitelist.js';
import { adminActionLogger } from '../../shared/middleware/adminActionLogger.js';

const router = Router();
const userController = new UserController();

router.get(
  '/',
  createRateLimit('GET:/api/admin/users'),
  requireAuth,
  requireRole('admin'),
  userController.getUsers.bind(userController)
);

router.get(
  '/stats',
  createRateLimit('GET:/api/admin/users/stats'),
  requireAuth,
  requireRole('admin'),
  userController.getUserStats.bind(userController)
);

router.post(
  '/',
  createRateLimit('POST:/api/admin/users'),
  requireAuth,
  requireRole('admin'),
  requireWhitelistedIP,
  adminActionLogger,
  userController.createUser.bind(userController)
);

router.patch(
  '/:userId/role',
  createRateLimit('PATCH:/api/admin/users/:userId/role'),
  requireAuth,
  requireRole('admin'),
  requireWhitelistedIP,
  adminActionLogger,
  userController.updateUserRole.bind(userController)
);

router.delete(
  '/:userId',
  createRateLimit('DELETE:/api/admin/users/:userId'),
  requireAuth,
  requireRole('admin'),
  requireWhitelistedIP,
  adminActionLogger,
  userController.deleteUser.bind(userController)
);

export default router;
