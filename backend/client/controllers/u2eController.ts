/**
 * U2E Controller
 *
 * Handles HTTP requests for U2E system.
 * Maps requests to service layer and formats responses.
 */

import { Request, Response } from 'express';
import { BaseController } from '../../shared/controllers/BaseController';
import { u2eService } from '../services/u2eService';
import { usageTracker } from '../services/usageTracker';
import {
  TrackUsageRequest,
  GetUsageHistoryRequest,
} from '../../../shared/types/u2e';

export class U2EController extends BaseController {
  constructor() {
    super('U2EController');
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const stats = await u2eService.getUserStats(userId);

      this.ok(res, stats);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getBreakdown(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const breakdown = await u2eService.getBusinessBreakdown(userId);

      this.ok(res, breakdown);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const filters: GetUsageHistoryRequest = {
        period: (req.query.period as any) || '30d',
        business_name: req.query.business_name as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 50,
      };

      const history = await u2eService.getUsageHistory(userId, filters);

      this.ok(res, history);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getRates(req: Request, res: Response): Promise<void> {
    try {
      const businessName = req.query.business_name as string | undefined;

      const rates = await u2eService.getRewardRates(businessName);

      this.ok(res, rates);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async trackUsage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const body: TrackUsageRequest = req.body;

      if (
        !body.event_idempotency_key ||
        !body.business_name ||
        !body.action_type
      ) {
        this.badRequest(
          res,
          'Missing required fields: event_idempotency_key, business_name, action_type'
        );
        return;
      }

      const result = await usageTracker.trackUsage(
        userId,
        body.business_name,
        body.action_type,
        body.metadata || {},
        req.ip,
        req.headers['user-agent']
      );

      if (!result.success) {
        this.badRequest(res, result.error || 'Failed to track usage');
        return;
      }

      this.ok(res, {
        success: true,
        event_id: result.event_id,
        message: 'Usage tracked successfully',
      });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }
}

export const u2eController = new U2EController();
