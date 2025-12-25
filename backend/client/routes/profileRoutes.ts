import { Router } from 'express';
import { ProfileController } from '../controllers/profileController.js';
import { requireAuth } from '../../shared/middleware/auth.js';
import { requireRole } from '../../shared/middleware/rbac.js';
import { createRateLimit } from '../../shared/middleware/validation.js';

const router = Router();
const profileController = new ProfileController();

// Get user profile
router.get(
  '/',
  createRateLimit('GET:/api/client/profile'),
  requireAuth,
  requireRole('client'),
  profileController.getProfile.bind(profileController)
);

// Update user profile
router.put(
  '/',
  createRateLimit('PUT:/api/client/profile'),
  requireAuth,
  requireRole('client'),
  profileController.updateProfile.bind(profileController)
);

export default router;
