import { AlertCircle, XCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  variant?: 'inline' | 'card' | 'full';
  theme?: 'light' | 'dark';
  showIcon?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorAlert({
  message,
  variant = 'inline',
  theme = 'light',
  showIcon = true,
  onRetry,
  onDismiss,
  className = ''
}: ErrorAlertProps) {
  const isDark = theme === 'dark';

  const baseClasses = isDark
    ? 'bg-red-900/20 border-red-500/50 text-red-400'
    : 'bg-red-50 border-red-200 text-red-800';

  const iconColorClass = isDark ? 'text-red-400' : 'text-red-600';

  if (variant === 'full') {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className={`${baseClasses} border rounded-lg p-6 max-w-md w-full ${className}`}>
          {showIcon && (
            <AlertCircle className={`w-12 h-12 ${iconColorClass} mx-auto mb-4`} aria-hidden="true" />
          )}
          <p className={`text-center ${isDark ? 'text-red-300' : 'text-red-800'}`} role="alert">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-4 w-full py-2 rounded transition ${
                isDark
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} border rounded-lg p-6 ${className}`} role="alert">
        <div className="flex items-start">
          {showIcon && (
            <AlertCircle className={`h-5 w-5 ${iconColorClass} mr-3 flex-shrink-0 mt-0.5`} aria-hidden="true" />
          )}
          <div className="flex-1">
            <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-800'}`}>{message}</p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={`ml-3 ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}`}
              aria-label="Dismiss error"
            >
              <XCircle className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`mt-3 w-full py-2 rounded text-sm font-medium transition ${
              isDark
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} border rounded-lg p-4 flex items-start ${className}`} role="alert">
      {showIcon && (
        <AlertCircle className={`h-5 w-5 ${iconColorClass} mr-2 flex-shrink-0 mt-0.5`} aria-hidden="true" />
      )}
      <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-800'} flex-1`}>{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`ml-2 ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}`}
          aria-label="Dismiss error"
        >
          <XCircle className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
