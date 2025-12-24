import {
  getRateLimitViolations,
  clearRateLimitViolations,
  getErrorCountsBySeverity,
  getRecentCriticalErrors,
  getTopRateLimitViolators,
} from '../../shared/services/supabase/repositories/system.js';
import { SupabaseService } from '../../shared/services/supabase/SupabaseService.js';
import type { SystemHealth } from '../../../shared/types/api.js';
import type { Database } from '../../../shared/types/database.types.js';

type RateLimitViolation = Database['public']['Tables']['rate_limit_violations']['Row'];

export class SystemService {
  private supabase: SupabaseService;

  constructor() {
    this.supabase = SupabaseService.getInstance();
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const startTime = Date.now();

    try {
      const dbHealth = await this.supabase.healthCheck();
      const dbResponseTime = Date.now() - startTime;

      const errorStats = await getErrorCountsBySeverity(24);
      const criticalErrors = await getRecentCriticalErrors(5);

      const violations = await getRateLimitViolations(24);
      const topViolators = await getTopRateLimitViolators(24, 5);

      let status: 'healthy' | 'degraded' | 'unhealthy';

      if (!dbHealth.healthy) {
        status = 'unhealthy';
      } else if (errorStats.bySeverity.critical > 10 || errorStats.bySeverity.error > 50) {
        status = 'degraded';
      } else if (violations.length > 100) {
        status = 'degraded';
      } else {
        status = 'healthy';
      }

      return {
        status,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
          connected: dbHealth.healthy,
          responseTimeMs: dbResponseTime,
        },
        errors: {
          last24h: errorStats.total,
          bySeverity: errorStats.bySeverity,
          recentCritical: criticalErrors.map((err) => ({
            id: err.id,
            severity: 'critical' as const,
            error_type: err.error_type,
            message: err.message,
            created_at: err.created_at,
          })),
        },
        rateLimits: {
          violationsLast24h: violations.length,
          topViolators,
        },
      };
    } catch (error) {
      console.error('Error generating system health report:', error);

      return {
        status: 'unhealthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
        },
        errors: {
          last24h: 0,
          bySeverity: {
            info: 0,
            warning: 0,
            error: 0,
            critical: 0,
          },
          recentCritical: [],
        },
        rateLimits: {
          violationsLast24h: 0,
          topViolators: [],
        },
      };
    }
  }

  async getRateLimitStats(hours: number = 24): Promise<RateLimitViolation[]> {
    return getRateLimitViolations(hours);
  }

  async clearRateLimitViolations(): Promise<number> {
    return clearRateLimitViolations();
  }
}
