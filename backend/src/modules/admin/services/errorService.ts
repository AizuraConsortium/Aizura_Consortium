import { supabase } from '../../../services/supabase/client.js';
import type { Database } from '../../../types/database.types.js';

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

export class ErrorService {
  async getRecentErrors(hours: number = 24): Promise<ErrorLog[]> {
    const { data, error } = await supabase
      .from('error_logs')
      .select('*')
      .gte('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  }

  async getErrorsWithFilters(filters: ErrorFilters): Promise<PaginatedErrors> {
    let query = supabase
      .from('error_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (filters.source) {
      query = query.eq('source', filters.source);
    }

    if (filters.severity) {
      query = query.eq('severity', filters.severity);
    }

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      errors: data || [],
      total: count || 0,
      limit,
      offset,
    };
  }

  async deleteError(id: string): Promise<void> {
    const { error } = await supabase
      .from('error_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async cleanupOldErrors(olderThan: string): Promise<number> {
    const { data, error } = await supabase
      .from('error_logs')
      .delete()
      .lt('created_at', olderThan)
      .select('id');

    if (error) throw error;
    return data?.length || 0;
  }
}
