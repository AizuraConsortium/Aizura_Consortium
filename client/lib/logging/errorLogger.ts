import { logError as sharedLogError } from '@shared/lib';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, any>;
}

export class ClientErrorLogger {
  private static userId: string | null = null;
  private static sessionId: string | null = null;

  static setUserContext(userId: string | null) {
    this.userId = userId;
  }

  static setSessionContext(sessionId: string | null) {
    this.sessionId = sessionId;
  }

  static logError(error: Error | unknown, context?: ErrorContext) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    const enrichedContext = {
      ...context,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    if (import.meta.env.DEV) {
      console.error('[Client Error]', {
        message: errorMessage,
        stack: errorStack,
        context: enrichedContext,
      });
    }

    sharedLogError(error, enrichedContext);
  }

  static logApiError(
    error: Error | unknown,
    endpoint: string,
    method: string,
    context?: Omit<ErrorContext, 'action'>
  ) {
    this.logError(error, {
      ...context,
      action: `API ${method} ${endpoint}`,
      additionalData: {
        endpoint,
        method,
      },
    });
  }

  static logComponentError(
    error: Error | unknown,
    componentName: string,
    action: string,
    additionalData?: Record<string, any>
  ) {
    this.logError(error, {
      component: componentName,
      action,
      additionalData,
    });
  }
}

export const logError = ClientErrorLogger.logError.bind(ClientErrorLogger);
export const logApiError = ClientErrorLogger.logApiError.bind(ClientErrorLogger);
export const logComponentError = ClientErrorLogger.logComponentError.bind(ClientErrorLogger);
export const setUserContext = ClientErrorLogger.setUserContext.bind(ClientErrorLogger);
export const setSessionContext = ClientErrorLogger.setSessionContext.bind(ClientErrorLogger);
