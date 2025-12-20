import {
  logError,
  getRecentErrors,
  getErrorsWithFilters,
  deleteError,
  cleanupOldErrors,
  type ErrorFilters,
  type PaginatedErrors,
} from '../../shared/services/supabase/repositories/errors.js';
import type { Database } from '../../../shared/types/database.types.js';

type ErrorLog = Database['public']['Tables']['error_logs']['Row'];

export { ErrorFilters, PaginatedErrors };

export class ErrorService {
  async logError(errorData: {
    source: 'frontend' | 'backend' | 'agent';
    severity: 'info' | 'warning' | 'error' | 'critical';
    error_type: string;
    message: string;
    details?: Record<string, any>;
    agent_id?: 'claude' | 'chatgpt' | 'grok' | 'gemini' | 'deepseek' | 'qwen' | null;
    topic_id?: string;
  }): Promise<ErrorLog> {
    return logError(errorData);
  }

  async getRecentErrors(hours: number = 24): Promise<ErrorLog[]> {
    return getRecentErrors(hours);
  }

  async getErrorsWithFilters(filters: ErrorFilters): Promise<PaginatedErrors> {
    return getErrorsWithFilters(filters);
  }

  async deleteError(id: string): Promise<void> {
    return deleteError(id);
  }

  async cleanupOldErrors(olderThan: string): Promise<number> {
    return cleanupOldErrors(olderThan);
  }
}
