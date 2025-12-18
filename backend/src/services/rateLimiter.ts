import { SupabaseService } from './supabase.js';
import { ErrorLogger } from './errorLogger.js';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  limit: number;
}

export interface RateLimitViolation {
  identifier: string;
  endpoint: string;
  tokensRequested: number;
  userAgent?: string;
  ipAddress?: string;
}

export interface RateLimitStats {
  endpoint: string;
  totalViolations: number;
  uniqueIdentifiers: number;
  avgTokensRequested: number;
}

export class RateLimiterService {
  private static instance: RateLimiterService;
  private supabase: SupabaseService;
  private errorLogger: ErrorLogger;
  private failOpen: boolean = true;

  private constructor() {
    this.supabase = SupabaseService.getInstance();
    this.errorLogger = ErrorLogger.getInstance();
  }

  static getInstance(): RateLimiterService {
    if (!RateLimiterService.instance) {
      RateLimiterService.instance = new RateLimiterService();
    }
    return RateLimiterService.instance;
  }

  async checkLimit(
    identifier: string,
    endpoint: string,
    maxRequests: number,
    windowMinutes: number
  ): Promise<RateLimitResult> {
    const startTime = Date.now();

    try {
      const refillRate = maxRequests / (windowMinutes * 60);

      const { data, error } = await this.supabase
        .getClient()
        .rpc('check_rate_limit', {
          p_identifier: identifier,
          p_endpoint: endpoint,
          p_max_tokens: maxRequests,
          p_refill_rate: refillRate
        });

      const queryTime = Date.now() - startTime;

      if (queryTime > 100) {
        console.warn(`Rate limit check slow: ${queryTime}ms for ${endpoint}`);
      }

      if (queryTime > 500) {
        await this.errorLogger.logError({
          source: 'backend',
          severity: 'warning',
          errorType: 'rate_limit_slow_query',
          message: `Rate limit check took ${queryTime}ms`,
          details: { endpoint, identifier, queryTime }
        });
      }

      if (error) {
        console.error('Rate limit check error:', error);
        await this.errorLogger.logError({
          source: 'backend',
          severity: 'error',
          errorType: 'rate_limit_check_failed',
          message: error.message,
          details: { endpoint, identifier, error }
        });

        if (this.failOpen) {
          console.warn('Rate limiter failing open - allowing request');
          return {
            allowed: true,
            remaining: maxRequests,
            resetAt: new Date(Date.now() + windowMinutes * 60 * 1000),
            limit: maxRequests
          };
        }

        return {
          allowed: false,
          remaining: 0,
          resetAt: new Date(Date.now() + windowMinutes * 60 * 1000),
          limit: maxRequests
        };
      }

      const result = Array.isArray(data) ? data[0] : data;
      const allowed = result?.allowed ?? false;
      const remaining = result?.remaining_tokens ?? 0;

      const resetAt = new Date(Date.now() + windowMinutes * 60 * 1000);

      return {
        allowed,
        remaining,
        resetAt,
        limit: maxRequests
      };
    } catch (error) {
      console.error('Unexpected rate limit error:', error);
      await this.errorLogger.logError({
        source: 'backend',
        severity: 'critical',
        errorType: 'rate_limit_exception',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: { endpoint, identifier, error }
      });

      if (this.failOpen) {
        console.warn('Rate limiter exception - failing open');
        return {
          allowed: true,
          remaining: maxRequests,
          resetAt: new Date(Date.now() + windowMinutes * 60 * 1000),
          limit: maxRequests
        };
      }

      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(Date.now() + windowMinutes * 60 * 1000),
        limit: maxRequests
      };
    }
  }

  async logViolation(violation: RateLimitViolation): Promise<void> {
    try {
      const { error } = await this.supabase
        .getClient()
        .from('rate_limit_violations')
        .insert({
          identifier: violation.identifier,
          endpoint: violation.endpoint,
          tokens_requested: violation.tokensRequested,
          user_agent: violation.userAgent,
          ip_address: violation.ipAddress
        });

      if (error) {
        console.error('Failed to log rate limit violation:', error);
      }

      await this.errorLogger.logError({
        source: 'backend',
        severity: 'warning',
        errorType: 'rate_limit_exceeded',
        message: `Rate limit exceeded for ${violation.endpoint}`,
        details: {
          identifier: violation.identifier,
          endpoint: violation.endpoint,
          tokensRequested: violation.tokensRequested
        }
      });
    } catch (error) {
      console.error('Exception logging violation:', error);
    }
  }

  async getViolationStats(hoursBack: number = 24): Promise<RateLimitStats[]> {
    try {
      const { data, error } = await this.supabase
        .getClient()
        .rpc('get_rate_limit_stats', { p_hours: hoursBack });

      if (error) {
        console.error('Failed to get violation stats:', error);
        return [];
      }

      return (data || []).map((row: any) => ({
        endpoint: row.endpoint,
        totalViolations: parseInt(row.total_violations),
        uniqueIdentifiers: parseInt(row.unique_identifiers),
        avgTokensRequested: parseFloat(row.avg_tokens_requested)
      }));
    } catch (error) {
      console.error('Exception getting violation stats:', error);
      return [];
    }
  }

  async cleanupOldLimits(): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .getClient()
        .rpc('cleanup_old_rate_limits');

      if (error) {
        console.error('Failed to cleanup old rate limits:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Exception during cleanup:', error);
      return 0;
    }
  }

  async getCurrentLimits(identifier: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .getClient()
        .from('rate_limits')
        .select('*')
        .eq('identifier', identifier)
        .order('last_refill', { ascending: false });

      if (error) {
        console.error('Failed to get current limits:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception getting current limits:', error);
      return [];
    }
  }

  setFailOpen(failOpen: boolean): void {
    this.failOpen = failOpen;
    console.info(`Rate limiter fail-${failOpen ? 'open' : 'closed'} mode enabled`);
  }

  async getDashboardStats(): Promise<any> {
    try {
      const { data: limits, error: limitsError } = await this.supabase
        .getClient()
        .from('rate_limits')
        .select('*')
        .order('last_refill', { ascending: false });

      if (limitsError) {
        console.error('Failed to get rate limits:', limitsError);
      }

      const { data: violations, error: violationsError } = await this.supabase
        .getClient()
        .from('rate_limit_violations')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (violationsError) {
        console.error('Failed to get violations:', violationsError);
      }

      const activeLimits = (limits || []).map((limit: any) => {
        const usagePercentage = (limit.tokens / limit.max_tokens) * 100;
        const resetAt = new Date(limit.last_refill.getTime() + 60 * 60 * 1000);

        return {
          endpoint: limit.endpoint,
          current_count: limit.tokens,
          limit: limit.max_tokens,
          window_seconds: 3600,
          blocked_requests: 0,
          reset_at: resetAt.toISOString(),
          usage_percentage: usagePercentage
        };
      });

      const totalBlockedToday = violations?.length || 0;

      const endpointCounts: Record<string, number> = {};
      violations?.forEach((v: any) => {
        endpointCounts[v.endpoint] = (endpointCounts[v.endpoint] || 0) + 1;
      });

      const mostActiveEndpoint = Object.entries(endpointCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

      const maxUsage = Math.max(...activeLimits.map(l => l.usage_percentage), 0);
      let systemHealth: 'healthy' | 'warning' | 'critical';
      if (maxUsage >= 90) {
        systemHealth = 'critical';
      } else if (maxUsage >= 70) {
        systemHealth = 'warning';
      } else {
        systemHealth = 'healthy';
      }

      return {
        active_limits: activeLimits,
        total_blocked_today: totalBlockedToday,
        most_active_endpoint: mostActiveEndpoint,
        system_health: systemHealth
      };
    } catch (error) {
      console.error('Exception getting dashboard stats:', error);
      return {
        active_limits: [],
        total_blocked_today: 0,
        most_active_endpoint: 'N/A',
        system_health: 'healthy'
      };
    }
  }
}
