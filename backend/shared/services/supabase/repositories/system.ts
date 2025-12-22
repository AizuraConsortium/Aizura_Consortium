import { query } from '../queryBuilder.js';
import type { Database } from '../../../../../shared/types/database.types.js';

type RateLimitViolation = Database['public']['Tables']['rate_limit_violations']['Row'];
type ErrorLog = Database['public']['Tables']['error_logs']['Row'];

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

export async function getErrorCountsBySeverity(hours: number = 24): Promise<{
  total: number;
  bySeverity: {
    info: number;
    warning: number;
    error: number;
    critical: number;
  };
}> {
  const sinceDate = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data, error } = await query('error_logs')
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
}

export async function getRecentCriticalErrors(
  limit: number = 5
): Promise<Pick<ErrorLog, 'id' | 'severity' | 'error_type' | 'message' | 'created_at'>[]> {
  const { data, error } = await query('error_logs')
    .select('id, severity, error_type, message, created_at')
    .eq('severity', 'critical')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getTopRateLimitViolators(
  hours: number = 24,
  limit: number = 5
): Promise<Array<{ identifier: string; count: number }>> {
  const sinceDate = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data, error } = await query('rate_limit_violations')
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
}
