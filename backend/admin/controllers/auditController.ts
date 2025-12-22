/**
 * Audit Controller
 *
 * Handles HTTP requests for admin audit log operations.
 * Extracts request data, delegates to service layer, and formats responses.
 */

import { Request, Response } from 'express';
import { AuditService, type AuditFilters } from '../services/auditService.js';

/**
 * Controller for admin audit log endpoints
 */
export class AuditController {
  constructor(private auditService: AuditService) {}

  /**
   * GET /api/admin/audit
   * Get admin actions with optional filters
   *
   * Query parameters:
   * - admin_user_id: Filter by admin user ID
   * - action_type: Filter by action type
   * - resource_type: Filter by resource type
   * - status: Filter by success/failure status
   * - limit: Number of results to return (default: 50, max: 100)
   * - offset: Pagination offset (default: 0)
   */
  async getAdminActions(req: Request, res: Response): Promise<void> {
    try {
      // Extract and parse query parameters
      const filters: AuditFilters = {
        admin_user_id: req.query.admin_user_id as string | undefined,
        action_type: req.query.action_type as string | undefined,
        resource_type: req.query.resource_type as string | undefined,
        status: req.query.status as string | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
      };

      // Delegate to service layer
      const result = await this.auditService.getAdminActionsWithFilters(filters);

      // Return response
      res.json({
        actions: result.actions,
        count: result.count,
        hasMore: result.hasMore,
        pagination: {
          limit: filters.limit || 50,
          offset: filters.offset || 0,
        },
      });
    } catch (error) {
      console.error('Error fetching admin actions:', error);
      res.status(500).json({
        error: 'Failed to fetch admin actions',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * GET /api/admin/audit/recent
   * Get recent admin actions within specified time window
   *
   * Query parameters:
   * - hours: Number of hours to look back (default: 24, max: 168)
   */
  async getRecentAdminActions(req: Request, res: Response): Promise<void> {
    try {
      // Parse hours parameter
      const hours = req.query.hours ? parseInt(req.query.hours as string, 10) : undefined;

      // Delegate to service layer
      const actions = await this.auditService.getRecentAdminActions(hours);

      // Return response
      res.json({
        actions,
        count: actions.length,
        timeWindow: {
          hours: hours || 24,
        },
      });
    } catch (error) {
      console.error('Error fetching recent admin actions:', error);
      res.status(500).json({
        error: 'Failed to fetch recent admin actions',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
