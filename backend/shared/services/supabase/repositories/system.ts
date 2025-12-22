/**
 * System Repository
 *
 * Manages system-level operations including rate limiting stats,
 * error monitoring, and system health metrics with caching.
 */

import { BaseRepository, type OperationContext } from './BaseRepository.js';
import type { Database } from '../../../../../shared/types/database.types.js';

type RateLimitViolation = Database['public']['Tables']['rate_limit_violations']['Row'];
type ErrorLog = Database['public']['Tables']['error_logs']['Row'];

export interface RateLimitStats {
  endpoint: string;
  total_violations: number;
  unique_identifiers: number;
  avg_tokens_requested: number;
}

/**
 * System Repository Class
 */
class SystemRepository extends BaseRepository {
  constructor() {
    super('system');
  }

  /**
   * Get rate limit statistics using database function (with caching)
   */
  async getRateLimitStats(hours: number = 24): Promise<RateLimitStats[]> {
    const context: OperationContext = {
      operation: 'getRateLimitStats',
      metadata: { hours },
    };

    return this.execute(async () => {
      this.validateRange(hours, 'hours', 1, 168);

      return this.getFromCacheOrExecute(
        `stats_${hours}`,
        async () => {
          const { data, error } = await this.client
            .rpc('get_rate_limit_stats', { p_hours: hours });

          if (error) throw error;
          return (data as RateLimitStats[]) || [];
        },
        'rate_limit_stats',
        60000
      );
    }, context);
  }

  /**
   * Get rate limit violations
   */
  async getRateLimitViolations(hours: number = 24): Promise<RateLimitViolation[]> {
    const context: OperationContext = {
      operation: 'getRateLimitViolations',
      table: 'rate_limit_violations',
      metadata: { hours },
    };

    return this.execute(async () => {
      this.validateRange(hours, 'hours', 1, 168);

      const sinceDate = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

      const { data, error } = await this.client
        .from('rate_limit_violations')
        .select('*')
        .gte('timestamp', sinceDate)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    }, context);
  }

  /**
   * Clear old rate limit violations
   */
  async clearRateLimitViolations(): Promise<number> {
    const context: OperationContext = {
      operation: 'clearRateLimitViolations',
      table: 'rate_limit_violations',
    };

    return this.execute(async () => {
      const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await this.client
        .from('rate_limit_violations')
        .delete()
        .lt('timestamp', cutoffDate)
        .select('id');

      if (error) throw error;

      this.invalidateCacheNamespace('rate_limit_stats');

      return data?.length || 0;
    }, context);
  }

  /**
   * Get error counts by severity (with caching)
   */
  async getErrorCountsBySeverity(hours: number = 24): Promise<{
    total: number;
    bySeverity: {
      info: number;
      warning: number;
      error: number;
      critical: number;
    };
  }> {
    const context: OperationContext = {
      operation: 'getErrorCountsBySeverity',
      table: 'error_logs',
      metadata: { hours },
    };

    return this.execute(async () => {
      this.validateRange(hours, 'hours', 1, 168);

      return this.getFromCacheOrExecute(
        `error_counts_${hours}`,
        async () => {
          const sinceDate = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

          const { data, error } = await this.client
            .from('error_logs')
            .select('severity')
            .gte('created_at', sinceDate);

          if (error) throw error;

          const counts = {
            total: data?.length || 0,
            bySeverity: {
              info: 0,
              warning: 0,
              error: 0,
              critical: 0,
            },
          };

          data?.forEach((row) => {
            const severity = row.severity as 'info' | 'warning' | 'error' | 'critical';
            counts.bySeverity[severity]++;
          });

          return counts;
        },
        'error_stats',
        30000
      );
    }, context);
  }

  /**
   * Get recent critical errors
   */
  async getRecentCriticalErrors(
    limit: number = 5
  ): Promise<Pick<ErrorLog, 'id' | 'severity' | 'error_type' | 'message' | 'created_at'>[]> {
    const context: OperationContext = {
      operation: 'getRecentCriticalErrors',
      table: 'error_logs',
      metadata: { limit },
    };

    return this.execute(async () => {
      this.validateRange(limit, 'limit', 1, 100);

      const { data, error } = await this.client
        .from('error_logs')
        .select('id, severity, error_type, message, created_at')
        .eq('severity', 'critical')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    }, context);
  }

  /**
   * Get top rate limit violators
   */
  async getTopRateLimitViolators(
    hours: number = 24,
    limit: number = 5
  ): Promise<Array<{ identifier: string; count: number }>> {
    const context: OperationContext = {
      operation: 'getTopRateLimitViolators',
      table: 'rate_limit_violations',
      metadata: { hours, limit },
    };

    return this.execute(async () => {
      this.validateRange(hours, 'hours', 1, 168);
      this.validateRange(limit, 'limit', 1, 100);

      const sinceDate = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

      const { data, error } = await this.client
        .from('rate_limit_violations')
        .select('identifier')
        .gte('timestamp', sinceDate);

      if (error) throw error;

      const violationCounts = new Map<string, number>();
      data?.forEach((row) => {
        const count = violationCounts.get(row.identifier) || 0;
        violationCounts.set(row.identifier, count + 1);
      });

      return Array.from(violationCounts.entries())
        .map(([identifier, count]) => ({ identifier, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    }, context);
  }
}

const systemRepository = new SystemRepository();

export const {
  getRateLimitStats,
  getRateLimitViolations,
  clearRateLimitViolations,
  getErrorCountsBySeverity,
  getRecentCriticalErrors,
  getTopRateLimitViolators,
} = systemRepository;
