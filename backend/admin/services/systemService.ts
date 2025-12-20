import {
  getRateLimitViolations,
  clearRateLimitViolations,
} from '../../shared/services/supabase/repositories/system.js';
import type { Database } from '../../../shared/types/database.types.js';

type RateLimitViolation = Database['public']['Tables']['rate_limit_violations']['Row'];

export interface SystemHealth {
  status: string;
  uptime: number;
  timestamp: string;
}

export class SystemService {
  async getSystemHealth(): Promise<SystemHealth> {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  async getRateLimitStats(hours: number = 24): Promise<RateLimitViolation[]> {
    return getRateLimitViolations(hours);
  }

  async clearRateLimitViolations(): Promise<number> {
    return clearRateLimitViolations();
  }
}
