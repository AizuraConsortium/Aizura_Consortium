import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  theme?: 'light' | 'dark';
  appName?: string;
  enableLogging?: boolean;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    if (this.props.enableLogging) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        await fetch(`${apiUrl}/admin/errors/log`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source: 'frontend',
            errorType: 'react_error_boundary',
            message: error.message,
            details: {
              stack: error.stack,
              componentStack: errorInfo.componentStack,
              appName: this.props.appName
            }
          })
        });
      } catch (logError) {
        console.error('Failed to log error:', logError);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const theme = this.props.theme || 'light';
      const isDark = theme === 'dark';

      const bgClass = isDark ? 'bg-slate-900' : 'bg-gray-50';
      const cardBgClass = isDark ? 'bg-slate-800' : 'bg-white';
      const borderClass = isDark ? 'border-red-500/50' : 'border-red-200';
      const titleClass = isDark ? 'text-red-400' : 'text-red-600';
      const textClass = isDark ? 'text-slate-300' : 'text-gray-700';
      const summaryClass = isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900';
      const detailsBgClass = isDark ? 'bg-slate-900' : 'bg-gray-100';
      const errorTextClass = isDark ? 'text-red-400' : 'text-red-600';
      const buttonClass = isDark ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-blue-600 hover:bg-blue-700';

      return (
        <div className={`min-h-screen ${bgClass} flex items-center justify-center p-6`}>
          <div className={`${cardBgClass} border ${borderClass} rounded-xl p-8 max-w-2xl ${isDark ? '' : 'shadow-lg'}`}>
            <h1 className={`text-2xl font-bold ${titleClass} mb-4`}>
              Something went wrong
            </h1>
            <p className={`${textClass} mb-4`}>
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            <details className="mb-6">
              <summary className={`cursor-pointer ${summaryClass} ${isDark ? '' : 'font-medium'}`}>
                Error details
              </summary>
              <pre className={`mt-2 p-4 ${detailsBgClass} rounded text-sm ${errorTextClass} overflow-auto`}>
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className={`${buttonClass} text-white font-medium py-2 px-6 rounded-lg transition-colors`}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
