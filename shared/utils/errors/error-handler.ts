/**
 * Error Handler
 *
 * Utilities for handling, formatting, and processing errors throughout the application.
 * Provides consistent error handling patterns and response formatting.
 */

import { isApplicationError, ApplicationError } from './error-classes';

export interface ErrorResponse {
  error: string;
  code: string;
  statusCode: number;
  details?: unknown;
  timestamp: string;
}

export function formatError(error: unknown): ErrorResponse {
  if (isApplicationError(error)) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
      timestamp: new Date().toISOString()
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
      timestamp: new Date().toISOString()
    };
  }

  return {
    error: 'An unknown error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
    timestamp: new Date().toISOString()
  };
}

export function handleError(error: unknown, context?: string): never {
  const formatted = formatError(error);

  if (context) {
    console.error(`Error in ${context}:`, formatted);
  } else {
    console.error('Error:', formatted);
  }

  if (isApplicationError(error)) {
    throw error;
  }

  throw new ApplicationError(
    formatted.error,
    formatted.code,
    formatted.statusCode,
    formatted.details
  );
}

export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMessage?: string,
  context?: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (errorMessage) {
      console.error(`${errorMessage}:`, error);
    }
    return handleError(error, context);
  }
}

export function tryCatchSync<T>(
  fn: () => T,
  errorMessage?: string,
  context?: string
): T {
  try {
    return fn();
  } catch (error) {
    if (errorMessage) {
      console.error(`${errorMessage}:`, error);
    }
    return handleError(error, context);
  }
}

export interface SafeResult<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
}

export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<SafeResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: formatError(error)
    };
  }
}

export function safeSync<T>(
  fn: () => T
): SafeResult<T> {
  try {
    const data = fn();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: formatError(error)
    };
  }
}

export function extractErrorMessage(error: unknown): string {
  if (isApplicationError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unknown error occurred';
}

export function getErrorCode(error: unknown): string {
  if (isApplicationError(error)) {
    return error.code;
  }

  if (error instanceof Error) {
    return 'INTERNAL_ERROR';
  }

  return 'UNKNOWN_ERROR';
}

export function getErrorStatusCode(error: unknown): number {
  if (isApplicationError(error)) {
    return error.statusCode;
  }

  return 500;
}

export function isRetryableError(error: unknown): boolean {
  if (!isApplicationError(error)) {
    return false;
  }

  const retryableCodes = [
    'TIMEOUT_ERROR',
    'NETWORK_ERROR',
    'EXTERNAL_SERVICE_ERROR'
  ];

  return retryableCodes.includes(error.code);
}

export async function retryOnError<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === maxRetries - 1) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
    }
  }

  throw lastError;
}

export function logError(
  error: unknown,
  context?: string,
  additionalInfo?: Record<string, unknown>
): void {
  const formatted = formatError(error);

  const logData = {
    ...formatted,
    context,
    ...additionalInfo
  };

  if (formatted.statusCode >= 500) {
    console.error('[ERROR]', logData);
  } else if (formatted.statusCode >= 400) {
    console.warn('[WARNING]', logData);
  } else {
    console.info('[INFO]', logData);
  }
}
