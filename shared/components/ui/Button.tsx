import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn, themeClasses } from '@shared/styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: themeClasses.button.primary,
    secondary: themeClasses.button.secondary,
    danger: themeClasses.button.danger,
    ghost: themeClasses.button.ghost,
  };

  const sizeClasses = {
    sm: themeClasses.button.sizes.sm,
    md: themeClasses.button.sizes.md,
    lg: themeClasses.button.sizes.lg,
  };

  return (
    <button
      className={cn(
        themeClasses.button.base,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
