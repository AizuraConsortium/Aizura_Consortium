import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { NotificationService } from '../../shared/services/notificationService';
import { requireAuth } from '../../shared/middleware/auth';
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
  (req, res) => controller.getNotifications(req, res)
);

router.get(
  '/notifications/unread-count',
  requireAuth,
  (req, res) => controller.getUnreadCount(req, res)
);

router.get(
  '/notifications/stats',
  requireAuth,
  (req, res) => controller.getStats(req, res)
);

router.post(
  '/notifications/:id/read',
  requireAuth,
  (req, res) => controller.markAsRead(req, res)
);

router.post(
  '/notifications/read-all',
  requireAuth,
  (req, res) => controller.markAllAsRead(req, res)
);

router.post(
  '/notifications/:id/archive',
  requireAuth,
  (req, res) => controller.archiveNotification(req, res)
);

router.get(
  '/notification-preferences',
  requireAuth,
  (req, res) => controller.getPreferences(req, res)
);

router.put(
  '/notification-preferences/:category',
  requireAuth,
  (req, res) => controller.updatePreferences(req, res)
);

export default router;
