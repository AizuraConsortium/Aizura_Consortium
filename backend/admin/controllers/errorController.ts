import { Request, Response } from 'express';
import { ErrorService } from '../services/errorService.js';

export class ErrorController {
  private errorService: ErrorService;

  constructor() {
    this.errorService = new ErrorService();
  }

  async getRecentErrors(req: Request, res: Response) {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const errors = await this.errorService.getRecentErrors(hours);
      res.json({ errors, count: errors.length });
    } catch (error) {
      console.error('Error fetching recent errors:', error);
      res.status(500).json({ error: 'Failed to fetch errors' });
    }
  }

  async getAdminErrors(req: Request, res: Response) {
    try {
      const filters = {
        source: req.query.source as string,
        severity: req.query.severity as string,
        limit: parseInt(req.query.limit as string) || 50,
        offset: parseInt(req.query.offset as string) || 0,
      };

      const result = await this.errorService.getErrorsWithFilters(filters);
      res.json(result);
    } catch (error) {
      console.error('Error fetching admin errors:', error);
      res.status(500).json({ error: 'Failed to fetch errors' });
    }
  }

  async deleteError(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await this.errorService.deleteError(id);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'error_delete',
          resourceType: 'error_log',
          resourceId: id,
          actionDetails: { operation: 'single_delete' },
          success: true
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting error:', error);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'error_delete',
          resourceType: 'error_log',
          resourceId: id,
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      res.status(500).json({ error: 'Failed to delete error' });
    }
  }

  async cleanupOldErrors(req: Request, res: Response) {
    try {
      const olderThan = req.body.olderThan || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const deleted = await this.errorService.cleanupOldErrors(olderThan);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'error_bulk_cleanup',
          resourceType: 'error_log',
          actionDetails: {
            operation: 'bulk_delete',
            deletedCount: deleted,
            olderThan
          },
          success: true
        });
      }

      res.json({ deleted });
    } catch (error) {
      console.error('Error cleaning up errors:', error);

      if (req.logAdminAction) {
        await req.logAdminAction({
          actionType: 'error_bulk_cleanup',
          resourceType: 'error_log',
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      res.status(500).json({ error: 'Failed to cleanup errors' });
    }
  }
}
