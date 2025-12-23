import { logError as sharedLogError } from '@shared/lib/logError';

/**
 * Context information that can be attached to error logs.
 * Provides additional metadata to help with debugging and error tracking.
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, any>;
}

/**
 * Client-specific error logger that extends the shared error logging functionality.
 *
 * This logger provides a decorator pattern over the shared logError function,
 * enriching error logs with client-specific context such as:
 * - User ID and session ID
 * - Browser information (user agent)
 * - Current URL
 * - Timestamp
 *
 * @example
 * ```typescript
 * // Set user context once when user logs in
 * setUserContext(user.id);
 * setSessionContext(session.access_token);
 *
 * // Log a component error
 * logComponentError(error, 'LoginForm', 'handleSubmit', { email });
 *
 * // Log an API error
 * logApiError(error, '/api/proposals', 'POST');
 * ```
 *
 * When to use this vs shared logError:
 * - Use this (client errorLogger) for all errors in the client app
 * - Use shared logError directly only in shared components that need basic logging
 * - This logger automatically includes client-specific context
 */
export class ClientErrorLogger {
  private static userId: string | null = null;
  private static sessionId: string | null = null;

  /**
   * Sets the current user ID for error context.
   * Call this when a user logs in or their identity changes.
   */
  static setUserContext(userId: string | null) {
    this.userId = userId;
  }

  /**
   * Sets the current session ID for error context.
   * Call this when a session is established or changes.
   */
  static setSessionContext(sessionId: string | null) {
    this.sessionId = sessionId;
  }

  /**
   * Logs an error with enriched client context.
   *
   * This is the core logging method that:
   * 1. Extracts error message and stack trace
   * 2. Enriches context with user ID, session ID, timestamp, user agent, and URL
   * 3. Logs to console in development mode
   * 4. Forwards to shared logging system for persistence
   *
   * @param error - The error to log (Error object or any value)
   * @param context - Optional context information
   */
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

    sharedLogError(
      'frontend',
      error instanceof Error ? error.name : 'UnknownError',
      errorMessage,
      {
        stack: errorStack,
        ...enrichedContext,
      }
    );
  }

  /**
   * Logs an API-related error with endpoint and method information.
   *
   * Use this for errors that occur during API calls to automatically
   * include the endpoint and HTTP method in the error context.
   *
   * @param error - The error that occurred
   * @param endpoint - The API endpoint that was called
   * @param method - The HTTP method used (GET, POST, etc.)
   * @param context - Optional additional context
   *
   * @example
   * ```typescript
   * try {
   *   await api.createProposal(data);
   * } catch (error) {
   *   logApiError(error, '/api/proposals', 'POST', { proposalId });
   * }
   * ```
   */
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

  /**
   * Logs a component-related error with component name and action.
   *
   * Use this for errors that occur within React components to automatically
   * include the component name and the action being performed.
   *
   * @param error - The error that occurred
   * @param componentName - The name of the component where the error occurred
   * @param action - The action being performed when the error occurred
   * @param additionalData - Optional additional data to include
   *
   * @example
   * ```typescript
   * const handleSubmit = async () => {
   *   try {
   *     await submitForm(data);
   *   } catch (error) {
   *     logComponentError(error, 'ProposalForm', 'handleSubmit', { formData });
   *   }
   * };
   * ```
   */
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
