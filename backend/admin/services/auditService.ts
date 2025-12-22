/**
 * Audit Service
 *
 * Business logic for admin action audit operations.
 * Handles validation, filtering, and retrieval of audit logs.
 */

import {
  getAdminActionsWithFilters as repoGetAdminActionsWithFilters,
  getRecentAdminActions as repoGetRecentAdminActions,
} from '../../shared/services/supabase/repositories/adminActions.js';
import type { Database } from '../../../shared/types/database.types.js';

type AdminAction = Database['public']['Tables']['admin_actions']['Row'];

export interface AuditFilters {
  admin_user_id?: string;
  action_type?: string;
  resource_type?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface AuditResult {
  actions: AdminAction[];
  count: number;
  hasMore: boolean;
}

/**
 * Service for managing admin audit logs
 */
export class AuditService {
  /**
   * Get admin actions with applied filters and business rules
   *
   * @param filters - Filtering and pagination parameters
   * @returns Filtered admin actions with metadata
   */
  async getAdminActionsWithFilters(filters: AuditFilters): Promise<AuditResult> {
    // Apply business rules: Default and max limits
    const limit = this.validateLimit(filters.limit);
    const offset = Math.max(0, filters.offset || 0);

    // Build repository filters (snake_case expected by repository function)
    const repoFilters = {
      admin_user_id: filters.admin_user_id,
      action_type: filters.action_type,
      resource_type: filters.resource_type,
      status: filters.status,
      limit: limit + 1, // Fetch one extra to determine if there are more
      offset,
    };

    // Fetch from repository
    const result = await repoGetAdminActionsWithFilters(repoFilters);

    // Determine if there are more results
    const hasMore = result.actions.length > limit;
    const actions = hasMore ? result.actions.slice(0, limit) : result.actions;

    return {
      actions,
      count: actions.length,
      hasMore,
    };
  }

  /**
   * Get recent admin actions within specified time window
   *
   * @param hours - Number of hours to look back (default: 24, max: 168)
   * @returns Recent admin actions
   */
  async getRecentAdminActions(hours?: number): Promise<AdminAction[]> {
    // Validate hours parameter
    const validatedHours = this.validateHoursParam(hours);

    // Fetch from repository
    return repoGetRecentAdminActions(validatedHours);
  }

  /**
   * Validate and normalize the limit parameter
   * Business rule: Default 50, max 100
   *
   * @private
   */
  private validateLimit(limit?: number): number {
    const DEFAULT_LIMIT = 50;
    const MAX_LIMIT = 100;

    if (!limit || limit < 1) {
      return DEFAULT_LIMIT;
    }

    return Math.min(limit, MAX_LIMIT);
  }

  /**
   * Validate and normalize the hours parameter
   * Business rule: Default 24, max 168 (1 week)
   *
   * @private
   */
  private validateHoursParam(hours?: number): number {
    const DEFAULT_HOURS = 24;
    const MAX_HOURS = 168; // 1 week

    if (!hours || hours < 1) {
      return DEFAULT_HOURS;
    }

    return Math.min(hours, MAX_HOURS);
  }
}
