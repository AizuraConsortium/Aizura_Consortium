import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  theme?: 'light' | 'dark';
  variant?: 'default' | 'inline' | 'centered';
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  text,
  fullScreen = false,
  theme = 'light',
  variant = 'default',
  className = ''
}: LoadingSpinnerProps) {
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const spinnerColor = isDark ? 'text-cyan-400' : 'text-blue-600';
  const textColor = isDark ? 'text-slate-300' : 'text-gray-600';
  const bgColor = isDark ? 'bg-slate-900' : 'bg-gray-50';

  const spinner = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin ${spinnerColor}`} aria-hidden="true" />
      {text && (
        <p className={`text-sm ${textColor}`} role="status">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
        {spinner}
      </div>
    );
  }

  if (variant === 'centered') {
    return (
      <div className="flex items-center justify-center p-8">
        {spinner}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin ${spinnerColor}`} aria-hidden="true" />
        {text && <span className={`text-sm ${textColor}`} role="status">{text}</span>}
      </div>
    );
  }

  return spinner;
}
