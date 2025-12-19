import { ReactNode } from 'react';
import { cn } from '@shared/styles';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  characterCount?: {
    current: number;
    max: number;
  };
}

export function FormField({
  label,
  htmlFor,
  error,
  helperText,
  required,
  className,
  children,
  characterCount,
}: FormFieldProps) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const helperId = helperText ? `${htmlFor}-helper` : undefined;

  return (
    <div className={cn('w-full', className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1"
      >
        <span>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {characterCount && (
          <span className="text-xs text-gray-500">
            {characterCount.current}/{characterCount.max}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
