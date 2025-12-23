import { X } from 'lucide-react';
import { cn } from '@shared/styles/theme';
import { handleKeyboardClick } from '@shared/utils/accessibility';

export interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
  className?: string;
  variant?: 'light' | 'dark';
}

/**
 * ModalHeader Component
 *
 * Reusable modal header with title and optional close button.
 *
 * @example
 * ```tsx
 * <ModalHeader
 *   title="Error Details"
 *   onClose={handleClose}
 *   variant="light"
 * />
 * ```
 */
export function ModalHeader({
  title,
  onClose,
  className,
  variant = 'light',
}: ModalHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-6 border-b',
        variant === 'light'
          ? 'border-slate-200'
          : 'border-slate-700',
        className
      )}
    >
      <h2
        className={cn(
          'text-xl font-semibold',
          variant === 'light' ? 'text-slate-900' : 'text-white'
        )}
      >
        {title}
      </h2>
      {onClose && (
        <button
          onClick={onClose}
          onKeyDown={(e) => handleKeyboardClick(e, onClose)}
          className={cn(
            'transition-colors',
            variant === 'light'
              ? 'text-slate-400 hover:text-slate-600'
              : 'text-slate-500 hover:text-slate-300'
          )}
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
