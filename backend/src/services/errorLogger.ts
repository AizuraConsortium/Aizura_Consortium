import { SupabaseService } from './supabase.js';
import type { AgentId, ErrorSource, ErrorSeverity } from '../../../shared/types/index.js';

export interface LogErrorOptions {
  source: ErrorSource;
  severity?: ErrorSeverity;
  agentId?: AgentId;
  errorType: string;
  message: string;
  details?: any;
  topicId?: string;
}

export class ErrorLogger {
  private static instance: ErrorLogger | null = null;
  private supabase: SupabaseService;

  private constructor() {
    this.supabase = SupabaseService.getInstance();
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  async logError(options: LogErrorOptions): Promise<void> {
    try {
      await this.supabase.getClient()
        .from('error_logs')
        .insert({
          source: options.source,
          severity: options.severity || 'error',
          agent_id: options.agentId || null,
          error_type: options.errorType,
          message: options.message,
          details: options.details || {},
          topic_id: options.topicId || null
        });
    } catch (error) {
      // Don't throw on logging errors, just console log
      console.error('Failed to log error to database:', error);
    }
  }

  async logAgentError(
    agentId: AgentId,
    errorType: string,
    message: string,
    details?: any,
    topicId?: string
  ): Promise<void> {
    await this.logError({
      source: 'agent',
      severity: 'error',
      agentId,
      errorType,
      message,
      details,
      topicId
    });
  }

  async logAgentWarning(
    agentId: AgentId,
    errorType: string,
    message: string,
    details?: any,
    topicId?: string
  ): Promise<void> {
    await this.logError({
      source: 'agent',
      severity: 'warning',
      agentId,
      errorType,
      message,
      details,
      topicId
    });
  }

  async logBackendError(
    errorType: string,
    message: string,
    details?: any
  ): Promise<void> {
    await this.logError({
      source: 'backend',
      severity: 'error',
      errorType,
      message,
      details
    });
  }
}
