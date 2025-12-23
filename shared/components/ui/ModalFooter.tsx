import { ReactNode } from 'react';
import { cn } from '@shared/styles/theme';

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
  align?: 'left' | 'center' | 'right';
}

/**
 * ModalFooter Component
 *
 * Reusable modal footer with flexible content and alignment.
 *
 * @example
 * ```tsx
 * <ModalFooter align="right" variant="light">
 *   <button onClick={handleCancel}>Cancel</button>
 *   <button onClick={handleSave}>Save</button>
 * </ModalFooter>
 * ```
 */
export function ModalFooter({
  children,
  className,
  variant = 'light',
  align = 'right',
}: ModalFooterProps) {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-6 border-t',
        variant === 'light' ? 'border-slate-200' : 'border-slate-700',
        alignmentClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}
