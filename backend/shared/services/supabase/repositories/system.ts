import { query } from '../queryBuilder.js';
import type { Database } from '../../../../../shared/types/database.types.js';

type RateLimitViolation = Database['public']['Tables']['rate_limit_violations']['Row'];

export async function getRateLimitViolations(hours: number = 24): Promise<RateLimitViolation[]> {
  const sinceDate = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data, error } = await query('rate_limit_violations')
    .select('*')
    .gte('timestamp', sinceDate)
    .order('timestamp', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data || [];
}

export async function clearRateLimitViolations(): Promise<number> {
  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await query('rate_limit_violations')
    .delete()
    .lt('timestamp', cutoffDate)
    .select('id');

  if (error) throw error;
  return data?.length || 0;
}
