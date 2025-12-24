import React from 'react';
import clsx from 'clsx';

export interface LoginContainerProps {
  children: React.ReactNode;
  variant?: 'admin' | 'client' | 'custom';
  className?: string;
  cardClassName?: string;
}

const containerVariants: Record<'admin' | 'client' | 'custom', string> = {
  admin: 'min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900',
  client: 'min-h-screen flex items-center justify-center bg-gray-50',
  custom: 'min-h-screen flex items-center justify-center bg-gray-50'
};

const cardVariants: Record<'admin' | 'client' | 'custom', string> = {
  admin: 'bg-white rounded-2xl shadow-2xl p-8',
  client: 'bg-white rounded-lg shadow p-8',
  custom: 'bg-white rounded-xl shadow-lg p-8'
};

const wrapperVariants: Record<'admin' | 'client' | 'custom', string> = {
  admin: 'w-full max-w-md px-6',
  client: 'max-w-md w-full space-y-8 px-6',
  custom: 'w-full max-w-md px-6'
};

export function LoginContainer({
  children,
  variant = 'custom',
  className,
  cardClassName
}: LoginContainerProps) {
  const containerClass = clsx(
    containerVariants[variant],
    className
  );

  const wrapperClass = clsx(
    wrapperVariants[variant]
  );

  const cardClass = clsx(
    cardVariants[variant],
    cardClassName
  );

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        <div className={cardClass}>
          {children}
        </div>
      </div>
    </div>
  );
}

export interface LoginContainerWithLinkProps extends LoginContainerProps {
  linkText?: string;
  linkHref?: string;
  linkClassName?: string;
}

export function LoginContainerWithLink({
  children,
  variant = 'custom',
  className,
  cardClassName,
  linkText,
  linkHref,
  linkClassName
}: LoginContainerWithLinkProps) {
  const containerClass = clsx(
    containerVariants[variant],
    className
  );

  const wrapperClass = clsx(
    wrapperVariants[variant]
  );

  const cardClass = clsx(
    cardVariants[variant],
    cardClassName
  );

  const defaultLinkClass = variant === 'admin'
    ? 'text-sm text-gray-400 hover:text-gray-300 transition'
    : 'text-sm text-gray-600 hover:text-gray-900 transition';

  const linkClass = clsx(defaultLinkClass, linkClassName);

  return (
    <div className={containerClass}>
      <div className={wrapperClass}>
        <div className={cardClass}>
          {children}
        </div>

        {linkText && linkHref && (
          <div className="mt-6 text-center">
            <a href={linkHref} className={linkClass}>
              {linkText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
