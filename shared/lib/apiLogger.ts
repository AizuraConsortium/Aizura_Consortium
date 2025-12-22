/**
 * API Logger
 *
 * Centralized logging for API calls with configurable options.
 * Provides detailed logging, filtering, and statistics for API interactions.
 */

export interface APICallLog {
  id: string;
  endpoint: string;
  method: string;
  timestamp: number;
  duration?: number;
  status?: number;
  statusText?: string;
  error?: string;
  requestBody?: unknown;
  responseBody?: unknown;
}

export interface APILoggerConfig {
  enabled: boolean;
  maxLogs: number;
  logRequestBody: boolean;
  logResponseBody: boolean;
  logToConsole: boolean;
}

class APILogger {
  private logs: APICallLog[] = [];
  private config: APILoggerConfig;

  constructor(config?: Partial<APILoggerConfig>) {
    this.config = {
      enabled: typeof import.meta !== 'undefined' && import.meta.env?.DEV !== undefined
        ? import.meta.env.DEV
        : process.env.NODE_ENV === 'development',
      maxLogs: 100,
      logRequestBody: typeof import.meta !== 'undefined' && import.meta.env?.DEV !== undefined
        ? import.meta.env.DEV
        : process.env.NODE_ENV === 'development',
      logResponseBody: typeof import.meta !== 'undefined' && import.meta.env?.DEV !== undefined
        ? import.meta.env.DEV
        : process.env.NODE_ENV === 'development',
      logToConsole: typeof import.meta !== 'undefined' && import.meta.env?.DEV !== undefined
        ? import.meta.env.DEV
        : process.env.NODE_ENV === 'development',
      ...config
    };
  }

  log(entry: Omit<APICallLog, 'id'>) {
    if (!this.config.enabled) return;

    const logEntry: APICallLog = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    if (!this.config.logRequestBody) {
      delete logEntry.requestBody;
    }

    if (!this.config.logResponseBody) {
      delete logEntry.responseBody;
    }

    if (this.config.logToConsole) {
      const logLevel = entry.error
        ? 'error'
        : entry.status && entry.status >= 400
        ? 'warn'
        : 'debug';
      console[logLevel]('[API Call]', logEntry);
    }

    this.logs.push(logEntry);

    if (this.logs.length > this.config.maxLogs) {
      this.logs.shift();
    }
  }

  getLogs(): APICallLog[] {
    return [...this.logs];
  }

  getLogsByEndpoint(endpoint: string): APICallLog[] {
    return this.logs.filter(log => log.endpoint.includes(endpoint));
  }

  getLogsByMethod(method: string): APICallLog[] {
    return this.logs.filter(log => log.method.toLowerCase() === method.toLowerCase());
  }

  getErrorLogs(): APICallLog[] {
    return this.logs.filter(log => log.error || (log.status && log.status >= 400));
  }

  getSuccessLogs(): APICallLog[] {
    return this.logs.filter(log => !log.error && log.status && log.status < 400);
  }

  clearLogs() {
    this.logs = [];
  }

  getStats() {
    const total = this.logs.length;
    const errors = this.getErrorLogs().length;
    const logsWithDuration = this.logs.filter(log => log.duration);
    const avgDuration = logsWithDuration.length > 0
      ? logsWithDuration.reduce((sum, log) => sum + (log.duration || 0), 0) / logsWithDuration.length
      : 0;

    const statusCodes = this.logs.reduce((acc, log) => {
      if (log.status) {
        acc[log.status] = (acc[log.status] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    return {
      total,
      errors,
      success: total - errors,
      successRate: total > 0 ? ((total - errors) / total) * 100 : 0,
      avgDuration: avgDuration || 0,
      statusCodes
    };
  }

  getRecentLogs(count: number = 10): APICallLog[] {
    return this.logs.slice(-count);
  }

  getSlowRequests(thresholdMs: number = 1000): APICallLog[] {
    return this.logs.filter(log => log.duration && log.duration > thresholdMs);
  }

  enable() {
    this.config.enabled = true;
  }

  disable() {
    this.config.enabled = false;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  updateConfig(config: Partial<APILoggerConfig>) {
    this.config = { ...this.config, ...config };
  }

  getConfig(): APILoggerConfig {
    return { ...this.config };
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  importLogs(logsJson: string): void {
    try {
      const logs = JSON.parse(logsJson);
      if (Array.isArray(logs)) {
        this.logs = logs;
      }
    } catch (error) {
      console.error('Failed to import logs:', error);
    }
  }
}

export const apiLogger = new APILogger();

export { APILogger };
