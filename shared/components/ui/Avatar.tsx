import { ImgHTMLAttributes, ReactNode, useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '@shared/styles/theme';

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'size'> {
  src?: string | null;
  alt: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  badge?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-32 h-32 text-4xl',
};

const badgePositionClasses = {
  xs: 'bottom-0 right-0',
  sm: 'bottom-0 right-0',
  md: 'bottom-0 right-0',
  lg: 'bottom-1 right-1',
  xl: 'bottom-2 right-2',
};

function getInitials(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  badge,
  onClick,
  className = '',
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = src && !imageError;
  const initials = fallback || getInitials(alt);
  const bgColor = getColorFromString(alt);

  const containerClasses = cn(
    'relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0',
    sizeClasses[size],
    onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
    className
  );

  const imageClasses = cn(
    'w-full h-full object-cover'
  );

  const fallbackClasses = cn(
    'w-full h-full flex items-center justify-center font-semibold text-white',
    bgColor
  );

  const badgeContainerClasses = cn(
    'absolute',
    badgePositionClasses[size]
  );

  return (
    <div
      className={containerClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      aria-label={alt}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className={imageClasses}
          onError={() => setImageError(true)}
          {...props}
        />
      ) : (
        <div className={fallbackClasses} aria-label={`${alt} avatar`}>
          {initials.length <= 2 ? (
            <span>{initials}</span>
          ) : (
            <User className={cn(
              size === 'xs' && 'w-4 h-4',
              size === 'sm' && 'w-5 h-5',
              size === 'md' && 'w-6 h-6',
              size === 'lg' && 'w-10 h-10',
              size === 'xl' && 'w-20 h-20'
            )} />
          )}
        </div>
      )}
      {badge && (
        <div className={badgeContainerClasses}>
          {badge}
        </div>
      )}
    </div>
  );
}
