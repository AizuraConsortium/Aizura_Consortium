import { SupabaseService } from './supabase/index.js';
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

  // Patterns for sensitive data that should be redacted
  private static readonly SENSITIVE_PATTERNS = [
    // API keys and tokens
    { pattern: /sk-[a-zA-Z0-9]{20,}/g, replacement: 'sk-***REDACTED***' },
    { pattern: /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/g, replacement: 'jwt-***REDACTED***' },
    { pattern: /xai-[a-zA-Z0-9]{20,}/g, replacement: 'xai-***REDACTED***' },
    { pattern: /AIza[a-zA-Z0-9_-]{20,}/g, replacement: 'AIza***REDACTED***' },
    { pattern: /Bearer\s+[a-zA-Z0-9_-]{20,}/gi, replacement: 'Bearer ***REDACTED***' },

    // Common secret environment variable names
    { pattern: /("?)(api_?key|secret|token|password|auth)("?\s*[:=]\s*["']?)([^"'\s]+)(["']?)/gi,
      replacement: '$1$2$3***REDACTED***$5' },

    // File paths (keep just filename, remove full paths)
    { pattern: /\/[a-zA-Z0-9_\-./]+\/[a-zA-Z0-9_\-./]+\//g, replacement: '[PATH]/' },

    // Email addresses (partial redaction)
    { pattern: /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      replacement: (match: string, local: string, domain: string) => {
        const redactedLocal = local.substring(0, 2) + '***';
        return `${redactedLocal}@${domain}`;
      }
    },

    // IP addresses (partial redaction)
    { pattern: /(\d{1,3}\.\d{1,3}\.\d{1,3}\.)\d{1,3}/g, replacement: '$1***' },

    // URLs with potential auth info
    { pattern: /https?:\/\/[^:]+:[^@]+@/g, replacement: 'https://***:***@' }
  ];

  private constructor() {
    this.supabase = SupabaseService.getInstance();
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Sanitize sensitive data from error messages and details
   */
  private sanitize(value: string): string {
    let sanitized = value;

    for (const { pattern, replacement } of ErrorLogger.SENSITIVE_PATTERNS) {
      if (typeof replacement === 'string') {
        sanitized = sanitized.replace(pattern, replacement);
      } else {
        sanitized = sanitized.replace(pattern, replacement as any);
      }
    }

    return sanitized;
  }

  /**
   * Recursively sanitize objects
   */
  private sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.sanitize(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Completely redact known sensitive keys
        if (/^(api_?key|secret|token|password|auth|authorization)$/i.test(key)) {
          sanitized[key] = '***REDACTED***';
        } else {
          sanitized[key] = this.sanitizeObject(value);
        }
      }
      return sanitized;
    }

    return obj;
  }

  async logError(options: LogErrorOptions): Promise<void> {
    try {
      // Sanitize message and details before storing
      const sanitizedMessage = this.sanitize(options.message);
      const sanitizedDetails = this.sanitizeObject(options.details || {});

      await this.supabase.getClient()
        .from('error_logs')
        .insert({
          source: options.source,
          severity: options.severity || 'error',
          agent_id: options.agentId || null,
          error_type: options.errorType,
          message: sanitizedMessage,
          details: sanitizedDetails,
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
