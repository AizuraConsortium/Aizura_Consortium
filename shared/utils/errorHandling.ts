interface UserFriendlyMessage {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  technicalDetails?: string;
}

export function handleApiError(error: unknown): UserFriendlyMessage {
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch')) {
      return {
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        severity: 'error',
        technicalDetails: error.message,
      };
    }

    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return {
        title: 'Authentication Required',
        message: 'Your session has expired. Please log in again.',
        severity: 'warning',
        technicalDetails: error.message,
      };
    }

    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      return {
        title: 'Access Denied',
        message: 'You do not have permission to perform this action.',
        severity: 'error',
        technicalDetails: error.message,
      };
    }

    if (error.message.includes('404') || error.message.includes('Not Found')) {
      return {
        title: 'Not Found',
        message: 'The requested resource could not be found.',
        severity: 'warning',
        technicalDetails: error.message,
      };
    }

    if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
      return {
        title: 'Rate Limited',
        message: 'Too many requests. Please wait a moment and try again.',
        severity: 'warning',
        technicalDetails: error.message,
      };
    }

    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      return {
        title: 'Server Error',
        message: 'An unexpected server error occurred. Our team has been notified.',
        severity: 'critical',
        technicalDetails: error.message,
      };
    }

    return {
      title: 'Error',
      message: error.message || 'An unexpected error occurred. Please try again.',
      severity: 'error',
      technicalDetails: error.stack,
    };
  }

  if (typeof error === 'string') {
    return {
      title: 'Error',
      message: error,
      severity: 'error',
    };
  }

  return {
    title: 'Unknown Error',
    message: 'An unexpected error occurred. Please try again.',
    severity: 'error',
    technicalDetails: JSON.stringify(error),
  };
}

export function logError(error: Error, context: string): void {
  const isDevelopment = (() => {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.NODE_ENV === 'development';
    }
    return false;
  })();

  if (isDevelopment) {
    console.group(`🔴 Error in ${context}`);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full Error:', error);
    console.groupEnd();
  }

  if (typeof error === 'object' && error !== null) {
    try {
      const errorData = {
        context,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      if (!isDevelopment) {
        console.error(JSON.stringify(errorData));
      }
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('Failed to fetch') ||
      error.message.includes('Network request failed') ||
      error.message.includes('NetworkError')
    );
  }
  return false;
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('401') ||
      error.message.includes('403') ||
      error.message.includes('Unauthorized') ||
      error.message.includes('Forbidden')
    );
  }
  return false;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}
