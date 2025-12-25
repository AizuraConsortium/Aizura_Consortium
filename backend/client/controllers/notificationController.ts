import { Request, Response } from 'express';
import { BaseController } from '../../shared/controllers/BaseController';
import { NotificationService } from '../../shared/services/notificationService';
import type { AuthenticatedRequest } from '../../shared/types/middleware';

export class NotificationController extends BaseController {
  private notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    super('NotificationController');
    this.notificationService = notificationService;
  }

  async getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const {
        type,
        priority,
        category,
        read,
        archived,
        limit = 50,
        offset = 0,
      } = req.query;

      const filters = {
        type: type as any,
        priority: priority as any,
        category: category as any,
        read: read === 'true' ? true : read === 'false' ? false : undefined,
        archived: archived === 'true' ? true : archived === 'false' ? false : undefined,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
      };

      const result = await this.notificationService.getUserNotifications(userId, filters);

      res.json(result);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getUnreadCount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const count = await this.notificationService.getUnreadCount(userId);

      res.json({ count });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const stats = await this.notificationService.getNotificationStats(userId);

      res.json(stats);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      const success = await this.notificationService.markAsRead(id, userId);

      if (success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Failed to mark notification as read' });
      }
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const success = await this.notificationService.markAllAsRead(userId);

      if (success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Failed to mark all notifications as read' });
      }
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async archiveNotification(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      const success = await this.notificationService.archiveNotification(id, userId);

      if (success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Failed to archive notification' });
      }
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getPreferences(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const preferences = await this.notificationService.getAllUserPreferences(userId);

      res.json(preferences);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async updatePreferences(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { category } = req.params;
      const { in_app_enabled, email_enabled, push_enabled } = req.body;

      const updated = await this.notificationService.updatePreferences(userId, category as any, {
        in_app_enabled,
        email_enabled,
        push_enabled,
      });

      if (updated) {
        res.json(updated);
      } else {
        res.status(400).json({ error: 'Failed to update preferences' });
      }
    } catch (error) {
      this.handleError(error, req, res);
    }
  }
}
