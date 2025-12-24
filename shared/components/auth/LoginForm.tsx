import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ErrorAlert } from '../ErrorAlert';
import { Input } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';
import type { AuthResult } from '@shared/types/auth';

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<AuthResult>;
  title: string;
  subtitle: string;
  variant?: 'admin' | 'client' | 'custom';
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  redirectText?: string;
  redirectLink?: string;
  user?: any;
  isAuthenticated?: boolean;
  redirectPath?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  submitText?: string;
  loadingText?: string;
  showEmailLabel?: boolean;
  showPasswordLabel?: boolean;
  autoCompleteEmail?: string;
  autoCompletePassword?: string;
  validateEmail?: boolean;
  className?: string;
  buttonClassName?: string;
}

const defaultButtonClasses: Record<'admin' | 'client' | 'custom', string> = {
  admin: 'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center',
  client: 'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50',
  custom: 'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
};

export function LoginForm({
  onSubmit,
  title,
  subtitle,
  variant = 'custom',
  icon,
  footer,
  redirectText,
  redirectLink,
  user,
  isAuthenticated,
  redirectPath = '/',
  emailPlaceholder = 'Email address',
  passwordPlaceholder = 'Password',
  submitText = 'Sign In',
  loadingText = 'Signing in...',
  showEmailLabel = true,
  showPasswordLabel = true,
  autoCompleteEmail = 'email',
  autoCompletePassword = 'current-password',
  validateEmail = true,
  className = '',
  buttonClassName
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user || isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (validateEmail && !isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await onSubmit(email, password);

      if (!result.success) {
        setError(result.error || 'Login failed');
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const buttonClass = buttonClassName || defaultButtonClasses[variant];

  return (
    <div className={className}>
      {icon && (
        <div className="flex items-center justify-center mb-8">
          {icon}
        </div>
      )}

      <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">{title}</h1>
      <p className="text-center text-gray-600 mb-8">{subtitle}</p>

      {error && (
        <ErrorAlert
          message={error}
          className="mb-6"
          showIcon={variant === 'admin'}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Input
          id="email"
          type="email"
          label={showEmailLabel ? 'Email Address' : undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          placeholder={emailPlaceholder}
          autoComplete={autoCompleteEmail}
          required
          aria-label={showEmailLabel ? undefined : 'Email Address'}
          aria-required="true"
          aria-invalid={error ? 'true' : 'false'}
        />

        <PasswordInput
          id="password"
          label={showPasswordLabel ? 'Password' : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          placeholder={passwordPlaceholder}
          autoComplete={autoCompletePassword}
          required
          aria-label={showPasswordLabel ? undefined : 'Password'}
          aria-required="true"
          aria-invalid={error ? 'true' : 'false'}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={buttonClass}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" aria-hidden="true" />
              {loadingText}
            </>
          ) : (
            submitText
          )}
        </button>
      </form>

      {footer && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          {footer}
        </div>
      )}

      {redirectText && redirectLink && (
        <div className="mt-6 text-center">
          <a
            href={redirectLink}
            className="text-sm text-gray-400 hover:text-gray-300 transition"
          >
            {redirectText}
          </a>
        </div>
      )}
    </div>
  );
}
