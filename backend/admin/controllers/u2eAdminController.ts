/**
 * U2E Admin Controller
 *
 * Admin endpoints for managing U2E system.
 */

import { Request, Response } from 'express';
import { BaseController } from '../../shared/controllers/BaseController';
import { u2eService } from '../../client/services/u2eService';
import {
  UpdateRewardRateRequest,
  ToggleBusinessRequest,
} from '../../../shared/types/u2e';
import { getSupabaseClient } from '../../shared/services/supabase/client';

const supabaseClient = getSupabaseClient();

export class U2EAdminController extends BaseController {
  constructor() {
    super('U2EAdminController');
  }

  async toggleSystem(req: Request, res: Response): Promise<void> {
    try {
      const { is_active } = req.body;
      const adminId = req.user!.id;

      await u2eService.toggleSystem(is_active, adminId);

      this.ok(res, {
        message: `U2E system ${is_active ? 'activated' : 'deactivated'}`,
        is_active,
      });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async updateRate(req: Request, res: Response): Promise<void> {
    try {
      const { business_name, action_type, new_rate, notes }: UpdateRewardRateRequest =
        req.body;
      const adminId = req.user!.id;

      await u2eService.updateRewardRate(
        business_name,
        action_type,
        new_rate,
        adminId,
        notes
      );

      this.ok(res, {
        message: `Rate updated for ${business_name} - ${action_type}`,
        new_rate,
      });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async toggleBusiness(req: Request, res: Response): Promise<void> {
    try {
      const { business_name, is_active }: ToggleBusinessRequest = req.body;

      const { error } = await supabaseClient
        .from('u2e_businesses')
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('business_name', business_name);

      if (error) throw error;

      this.ok(res, {
        message: `Business ${business_name} ${is_active ? 'activated' : 'deactivated'}`,
        business_name,
        is_active,
      });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const { data: config } = await supabaseClient
        .from('u2e_system_config')
        .select('*')
        .maybeSingle();

      const { count: activeUsers } = await supabaseClient
        .from('u2e_user_stats')
        .select('*', { count: 'exact', head: true });

      const { data: businesses } = await supabaseClient
        .from('u2e_businesses')
        .select('*')
        .is('deleted_at', null);

      this.ok(res, {
        config,
        active_users: activeUsers || 0,
        businesses: businesses || [],
      });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  async refreshStats(req: Request, res: Response): Promise<void> {
    try {
      const { error } = await supabaseClient.rpc('refresh_materialized_view', {
        view_name: 'u2e_user_stats',
      });

      if (error) throw error;

      this.ok(res, {
        message: 'U2E stats refreshed successfully',
      });
    } catch (error) {
      this.handleError(error, req, res);
    }
  }
}

export const u2eAdminController = new U2EAdminController();
