/**
 * U2E Service
 *
 * Handles U2E reward calculations, stats retrieval, and business logic.
 * This is the main service for all U2E-related operations.
 */

import { getSupabaseClient } from '../../shared/services/supabase/client';
import { ErrorLogger } from '../../shared/services/errorLogger';
import {
  GetU2EStatsResponse,
  GetBusinessBreakdownResponse,
  GetUsageHistoryResponse,
  GetUsageHistoryRequest,
  GetRewardRatesResponse,
  UsageHistoryItem,
  BusinessUsageSummary,
  RewardRateInfo,
} from '../../../shared/types/u2e';

const supabaseClient = getSupabaseClient();
const errorLogger = ErrorLogger.getInstance();

export class U2EService {
  async getUserStats(userId: string): Promise<GetU2EStatsResponse> {
    try {
      const { data: stats, error: statsError } = await supabaseClient
        .from('u2e_user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (statsError) throw statsError;

      const { data: config, error: configError } = await supabaseClient
        .from('u2e_system_config')
        .select('is_active')
        .maybeSingle();

      if (configError) throw configError;

      if (!stats) {
        return {
          total_earned: 0,
          current_month_earned: 0,
          projected_monthly: 0,
          total_usage_count: 0,
          businesses_used: 0,
          top_business: null,
          last_activity: null,
          is_system_active: config?.is_active || false,
          claimable_at_launch: 0,
        };
      }

      const daysInMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getDate();
      const currentDay = new Date().getDate();
      const projected_monthly = (stats.current_month_rewards / currentDay) * daysInMonth;

      return {
        total_earned: stats.total_rewards_earned,
        current_month_earned: stats.current_month_rewards,
        projected_monthly,
        total_usage_count: stats.total_usage_count,
        businesses_used: stats.businesses_used,
        top_business: stats.top_business,
        last_activity: stats.last_activity_date,
        is_system_active: config?.is_active || false,
        claimable_at_launch: stats.unclaimed_rewards,
      };
    } catch (error) {
      await errorLogger.logError({
        source: 'backend',
        severity: 'error',
        errorType: 'U2E_GET_USER_STATS_ERROR',
        message: `Failed to get user stats: ${(error as Error).message}`,
        details: {
          stackTrace: (error as Error).stack,
          metadata: { userId },
        },
      });
      throw error;
    }
  }

  async getBusinessBreakdown(userId: string): Promise<GetBusinessBreakdownResponse> {
    try {
      const { data, error } = await supabaseClient
        .from('u2e_usage_rewards')
        .select(
          `
          business_id,
          action_type,
          usage_count,
          rewards_earned,
          u2e_businesses!inner (
            business_name,
            display_name,
            logo_url
          ),
          u2e_reward_rates!inner (
            action_label
          )
        `
        )
        .eq('user_id', userId);

      if (error) throw error;

      const businessMap = new Map<string, BusinessUsageSummary>();

      for (const row of data || []) {
        const businessId = row.business_id;
        const business = (row as any).u2e_businesses;

        if (!businessMap.has(businessId)) {
          businessMap.set(businessId, {
            business_id: businessId,
            business_name: business.business_name,
            display_name: business.display_name,
            logo_url: business.logo_url,
            total_usage: 0,
            total_rewards: 0,
            actions: [],
          });
        }

        const summary = businessMap.get(businessId)!;
        summary.total_usage += row.usage_count;
        summary.total_rewards += row.rewards_earned;

        summary.actions.push({
          action_type: row.action_type,
          action_label: (row as any).u2e_reward_rates.action_label || row.action_type,
          count: row.usage_count,
          rewards: row.rewards_earned,
        });
      }

      const businesses = Array.from(businessMap.values());
      const total_rewards = businesses.reduce((sum, b) => sum + b.total_rewards, 0);

      return {
        businesses,
        total_rewards,
      };
    } catch (error) {
      await errorLogger.logError({
        source: 'backend',
        severity: 'error',
        errorType: 'U2E_GET_BREAKDOWN_ERROR',
        message: `Failed to get business breakdown: ${(error as Error).message}`,
        details: {
          stackTrace: (error as Error).stack,
          metadata: { userId },
        },
      });
      throw error;
    }
  }

  async getUsageHistory(
    userId: string,
    filters: GetUsageHistoryRequest
  ): Promise<GetUsageHistoryResponse> {
    try {
      const { period = '30d', business_name, page = 1, limit = 50 } = filters;

      const now = new Date();
      let startDate: Date;

      switch (period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'all':
        default:
          startDate = new Date(0);
      }

      let query = supabaseClient
        .from('u2e_usage_rewards')
        .select(
          `
          id,
          action_type,
          usage_count,
          rewards_earned,
          period_start,
          u2e_businesses!inner (
            business_name,
            display_name
          ),
          u2e_reward_rates!inner (
            action_label
          )
        `,
          { count: 'exact' }
        )
        .eq('user_id', userId)
        .gte('period_start', startDate.toISOString())
        .order('period_start', { ascending: false });

      if (business_name && business_name !== 'all') {
        query = query.eq('u2e_businesses.business_name', business_name);
      }

      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      const items: UsageHistoryItem[] = (data || []).map((row: any) => ({
        id: row.id,
        business_name: row.u2e_businesses.business_name,
        display_name: row.u2e_businesses.display_name,
        action_type: row.action_type,
        action_label: row.u2e_reward_rates.action_label,
        rewards_earned: row.rewards_earned,
        usage_count: row.usage_count,
        date: row.period_start,
      }));

      return {
        items,
        total: count || 0,
        page,
        limit,
        has_more: (count || 0) > offset + limit,
      };
    } catch (error) {
      await errorLogger.logError({
        source: 'backend',
        severity: 'error',
        errorType: 'U2E_GET_HISTORY_ERROR',
        message: `Failed to get usage history: ${(error as Error).message}`,
        details: {
          stackTrace: (error as Error).stack,
          metadata: { userId, filters },
        },
      });
      throw error;
    }
  }

  async getRewardRates(businessName?: string): Promise<GetRewardRatesResponse> {
    try {
      let query = supabaseClient
        .from('u2e_reward_rates')
        .select(
          `
          business_id,
          action_type,
          action_label,
          rate_per_action,
          effective_from,
          notes,
          u2e_businesses!inner (
            business_name,
            display_name
          )
        `
        )
        .eq('is_active', true)
        .is('effective_to', null);

      if (businessName && businessName !== 'all') {
        query = query.eq('u2e_businesses.business_name', businessName);
      }

      const { data, error } = await query;

      if (error) throw error;

      const { data: config, error: configError } = await supabaseClient
        .from('u2e_system_config')
        .select('global_multiplier')
        .maybeSingle();

      if (configError) throw configError;

      const rates: RewardRateInfo[] = (data || []).map((row: any) => ({
        business_id: row.business_id,
        business_name: row.u2e_businesses.business_name,
        display_name: row.u2e_businesses.display_name,
        action_type: row.action_type,
        action_label: row.action_label || row.action_type,
        rate_per_action: row.rate_per_action,
        effective_from: row.effective_from,
        notes: row.notes,
      }));

      return {
        rates,
        global_multiplier: config?.global_multiplier || 1.0,
        last_updated: new Date().toISOString(),
        next_rate_review: null,
      };
    } catch (error) {
      await errorLogger.logError({
        source: 'backend',
        severity: 'error',
        errorType: 'U2E_GET_RATES_ERROR',
        message: `Failed to get reward rates: ${(error as Error).message}`,
        details: {
          stackTrace: (error as Error).stack,
          metadata: { businessName },
        },
      });
      throw error;
    }
  }

  async toggleSystem(isActive: boolean, adminId: string): Promise<void> {
    try {
      const updateData: any = {
        is_active: isActive,
        updated_by: adminId,
        updated_at: new Date().toISOString(),
      };

      if (isActive) {
        updateData.activation_date = new Date().toISOString();
        updateData.deactivation_date = null;
      } else {
        updateData.deactivation_date = new Date().toISOString();
      }

      const { data: config } = await supabaseClient
        .from('u2e_system_config')
        .select('id')
        .maybeSingle();

      if (!config) {
        throw new Error('U2E system config not found');
      }

      const { error } = await supabaseClient
        .from('u2e_system_config')
        .update(updateData)
        .eq('id', config.id);

      if (error) throw error;
    } catch (error) {
      await errorLogger.logError({
        source: 'backend',
        severity: 'error',
        errorType: 'U2E_TOGGLE_SYSTEM_ERROR',
        message: `Failed to toggle system: ${(error as Error).message}`,
        details: {
          stackTrace: (error as Error).stack,
          metadata: { isActive, adminId },
        },
      });
      throw error;
    }
  }

  async updateRewardRate(
    businessName: string,
    actionType: string,
    newRate: number,
    adminId: string,
    notes?: string
  ): Promise<void> {
    try {
      const { data: business, error: businessError } = await supabaseClient
        .from('u2e_businesses')
        .select('id')
        .eq('business_name', businessName)
        .maybeSingle();

      if (businessError || !business) {
        throw new Error(`Business '${businessName}' not found`);
      }

      const now = new Date().toISOString();
      await supabaseClient
        .from('u2e_reward_rates')
        .update({ effective_to: now, is_active: false })
        .eq('business_id', business.id)
        .eq('action_type', actionType)
        .is('effective_to', null);

      const { error } = await supabaseClient.from('u2e_reward_rates').insert({
        business_id: business.id,
        action_type: actionType,
        rate_per_action: newRate,
        effective_from: now,
        updated_by: adminId,
        notes: notes || `Rate updated to ${newRate} AAIC`,
      });

      if (error) throw error;
    } catch (error) {
      await errorLogger.logError({
        source: 'backend',
        severity: 'error',
        errorType: 'U2E_UPDATE_RATE_ERROR',
        message: `Failed to update reward rate: ${(error as Error).message}`,
        details: {
          stackTrace: (error as Error).stack,
          metadata: { businessName, actionType, newRate },
        },
      });
      throw error;
    }
  }
}

export const u2eService = new U2EService();
