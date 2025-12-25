import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { NotificationService } from '../../shared/services/notificationService';
import { requireAuth } from '../../shared/middleware/auth';
import { AuthenticatedRequest } from '../../shared/types/middleware';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const notificationService = new NotificationService(supabase);
const controller = new NotificationController(notificationService);

router.get(
  '/notifications',
  requireAuth,
  (req, res) => controller.getNotifications(req as AuthenticatedRequest, res)
);

router.get(
  '/notifications/unread-count',
  requireAuth,
  (req, res) => controller.getUnreadCount(req as AuthenticatedRequest, res)
);

router.get(
  '/notifications/stats',
  requireAuth,
  (req, res) => controller.getStats(req as AuthenticatedRequest, res)
);

router.post(
  '/notifications/:id/read',
  requireAuth,
  (req, res) => controller.markAsRead(req as AuthenticatedRequest, res)
);

router.post(
  '/notifications/read-all',
  requireAuth,
  (req, res) => controller.markAllAsRead(req as AuthenticatedRequest, res)
);

router.post(
  '/notifications/:id/archive',
  requireAuth,
  (req, res) => controller.archiveNotification(req as AuthenticatedRequest, res)
);

router.get(
  '/notification-preferences',
  requireAuth,
  (req, res) => controller.getPreferences(req as AuthenticatedRequest, res)
);

router.put(
  '/notification-preferences/:category',
  requireAuth,
  (req, res) => controller.updatePreferences(req as AuthenticatedRequest, res)
);

export default router;
