/**
 * Usage Tracker Service
 *
 * Handles real-time tracking of usage events from integrated businesses.
 * Implements idempotency, validation, and fraud detection.
 */

import { createHash } from 'crypto';
import { getSupabaseClient } from '../../shared/services/supabase/client';
import { ErrorLogger } from '../../shared/services/errorLogger';
import {
  U2EUsageEvent,
  TrackUsageRequest,
  ActionType,
  U2EBusiness,
} from '../../../shared/types/u2e';

const supabaseClient = getSupabaseClient();
const errorLogger = ErrorLogger.getInstance();

export class UsageTracker {
  async trackUsage(
    userId: string,
    businessName: string,
    actionType: ActionType,
    metadata: Record<string, any> = {},
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; event_id?: string; error?: string }> {
    try {
      const isActive = await this.isSystemActive();
      if (!isActive) {
        return {
          success: false,
          error: 'U2E system is not currently active',
        };
      }

      const business = await this.getBusinessByName(businessName);
      if (!business) {
        return {
          success: false,
          error: `Business '${businessName}' not found`,
        };
      }

      if (!business.is_active) {
        return {
          success: false,
          error: `Business '${businessName}' is not active for U2E tracking`,
        };
      }

      const isValidAction = await this.isValidActionForBusiness(business.id, actionType);
      if (!isValidAction) {
        return {
          success: false,
          error: `Action type '${actionType}' is not configured for ${businessName}`,
        };
      }

      const idempotencyKey = this.generateIdempotencyKey(
        userId,
        business.id,
        actionType,
        metadata
      );

      const { data, error } = await supabaseClient
        .from('u2e_usage_events')
        .insert({
          event_idempotency_key: idempotencyKey,
          user_id: userId,
          business_id: business.id,
          action_type: actionType,
          metadata,
          ip_address: ipAddress,
          user_agent: userAgent,
        })
        .select('id')
        .maybeSingle();

      if (error) {
        if (error.code === '23505') {
          return {
            success: true,
            error: 'Duplicate event - already processed',
          };
        }
        throw error;
      }

      return {
        success: true,
        event_id: data?.id,
      };
    } catch (error) {
      await errorLogger.logError({
        source: 'backend',
        severity: 'error',
        errorType: 'U2E_TRACK_USAGE_ERROR',
        message: `Failed to track usage: ${(error as Error).message}`,
        details: {
          stackTrace: (error as Error).stack,
          metadata: { userId, businessName, actionType },
        },
      });

      return {
        success: false,
        error: 'Failed to track usage event',
      };
    }
  }

  async trackUsageBatch(
    events: Array<{
      userId: string;
      businessName: string;
      actionType: ActionType;
      metadata?: Record<string, any>;
      timestamp?: string;
    }>
  ): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const event of events) {
      const result = await this.trackUsage(
        event.userId,
        event.businessName,
        event.actionType,
        event.metadata || {}
      );

      if (result.success) {
        success++;
      } else {
        failed++;
        errors.push(result.error || 'Unknown error');
      }
    }

    return { success, failed, errors };
  }

  private async isSystemActive(): Promise<boolean> {
    const { data, error } = await supabaseClient
      .from('u2e_system_config')
      .select('is_active')
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    return data.is_active;
  }

  private async getBusinessByName(businessName: string): Promise<U2EBusiness | null> {
    const { data, error } = await supabaseClient
      .from('u2e_businesses')
      .select('*')
      .eq('business_name', businessName)
      .is('deleted_at', null)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as U2EBusiness;
  }

  private async isValidActionForBusiness(
    businessId: string,
    actionType: ActionType
  ): Promise<boolean> {
    const { data, error } = await supabaseClient
      .from('u2e_reward_rates')
      .select('id')
      .eq('business_id', businessId)
      .eq('action_type', actionType)
      .eq('is_active', true)
      .is('effective_to', null)
      .maybeSingle();

    return !!data && !error;
  }

  private generateIdempotencyKey(
    userId: string,
    businessId: string,
    actionType: ActionType,
    metadata: Record<string, any>
  ): string {
    const timestamp = Math.floor(Date.now() / 1000);

    const data = JSON.stringify({
      userId,
      businessId,
      actionType,
      metadata,
      timestamp,
    });

    return createHash('sha256').update(data).digest('hex');
  }

  async getUserUsageStats(
    userId: string,
    timeWindow: number = 3600
  ): Promise<{
    total_events: number;
    unique_actions: number;
    suspicious: boolean;
  }> {
    const startTime = new Date(Date.now() - timeWindow * 1000).toISOString();

    const { data, error } = await supabaseClient
      .from('u2e_usage_events')
      .select('action_type')
      .eq('user_id', userId)
      .gte('created_at', startTime);

    if (error || !data) {
      return {
        total_events: 0,
        unique_actions: 0,
        suspicious: false,
      };
    }

    const total_events = data.length;
    const unique_actions = new Set(data.map((e: any) => e.action_type)).size;
    const suspicious = total_events > 1000;

    return {
      total_events,
      unique_actions,
      suspicious,
    };
  }
}

export const usageTracker = new UsageTracker();
