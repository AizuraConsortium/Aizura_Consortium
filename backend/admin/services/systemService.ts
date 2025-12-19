import { supabase } from '../../shared/services/supabase/client.js';
import type { Database } from '../../shared/types/database.types.js';

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
    const { data, error } = await supabase
      .from('rate_limit_violations')
      .select('*')
      .gte('timestamp', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  }

  async clearRateLimitViolations(): Promise<number> {
    const { data, error } = await supabase
      .from('rate_limit_violations')
      .delete()
      .lt('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .select('id');

    if (error) throw error;
    return data?.length || 0;
  }
}
