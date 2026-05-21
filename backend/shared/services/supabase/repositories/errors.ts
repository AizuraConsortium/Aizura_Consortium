import { create, deleteById, query } from '../queryBuilder.js';
import type { Database } from '../../../../../shared/types/database.types.js';

type ErrorLog = Database['public']['Tables']['error_logs']['Row'];
type ErrorLogInsert = Database['public']['Tables']['error_logs']['Insert'];

export interface ErrorFilters {
  source?: string;
  severity?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedErrors {
  errors: ErrorLog[];
  total: number;
  limit: number;
  offset: number;
}

export async function logError(errorData: {
  source: 'frontend' | 'backend' | 'agent';
  severity: 'info' | 'warning' | 'error' | 'critical';
  error_type: string;
  message: string;
  details?: Record<string, any>;
  agent_id?: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen' | null;
  topic_id?: string;
}): Promise<ErrorLog> {
  const insertData: ErrorLogInsert = {
    source: errorData.source,
    severity: errorData.severity,
    error_type: errorData.error_type,
    message: errorData.message,
    details_metadata_json: errorData.details || null,
    agent_id: errorData.agent_id || null,
    topic_id: errorData.topic_id || null,
  };

  return create<ErrorLog>('error_logs', insertData);
}

export async function getRecentErrors(hours: number = 24): Promise<ErrorLog[]> {
  const sinceDate = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data, error } = await query('error_logs')
    .select('*')
    .gte('created_at', sinceDate)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data || [];
}

export async function getErrorsWithFilters(filters: ErrorFilters): Promise<PaginatedErrors> {
  let queryBuilder = query('error_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters.source) {
    queryBuilder = queryBuilder.eq('source', filters.source);
  }

  if (filters.severity) {
    queryBuilder = queryBuilder.eq('severity', filters.severity);
  }

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;

  queryBuilder = queryBuilder.range(offset, offset + limit - 1);

  const { data, error, count } = await queryBuilder;

  if (error) throw error;

  return {
    errors: data || [],
    total: count || 0,
    limit,
    offset,
  };
}

export async function deleteError(id: string): Promise<void> {
  return deleteById('error_logs', id);
}

export async function cleanupOldErrors(olderThan: string): Promise<number> {
  const { data, error } = await query('error_logs')
    .delete()
    .lt('created_at', olderThan)
    .select('id');

  if (error) throw error;
  return data?.length || 0;
}
