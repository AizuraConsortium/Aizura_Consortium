import { ReactNode, useEffect } from 'react';
import { cn } from '@shared/styles';
import { useEscapeKey, useFocusTrap } from '@shared/hooks';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'light' | 'dark';
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  showAnimation?: boolean;
  className?: string;
  overlayClassName?: string;
}

/**
 * Modal Component
 *
 * Generic modal/dialog component with:
 * - Focus trap (automatically manages focus within modal)
 * - ESC key handling (optional, default: true)
 * - Click outside to close (optional, default: true)
 * - Animation support (fade in/out)
 * - Size variants (sm, md, lg, xl, full)
 * - Light/dark theme support
 * - Header/body/footer slots via children
 * - Body scroll lock when open
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   size="lg"
 *   variant="light"
 * >
 *   <ModalHeader title="My Modal" onClose={handleClose} />
 *   <div className="p-6">
 *     Modal content here
 *   </div>
 *   <ModalFooter>
 *     <button onClick={handleClose}>Close</button>
 *   </ModalFooter>
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  variant = 'light',
  closeOnClickOutside = true,
  closeOnEscape = true,
  showAnimation = true,
  className,
  overlayClassName,
}: ModalProps) {
  const containerRef = useFocusTrap(isOpen);

  useEscapeKey(onClose, isOpen && closeOnEscape);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[95vw]',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black bg-opacity-50 backdrop-blur-sm',
        showAnimation && 'animate-in fade-in duration-200',
        overlayClassName
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={containerRef}
        className={cn(
          'w-full max-h-[90vh] overflow-hidden rounded-lg shadow-xl',
          showAnimation && 'animate-in zoom-in-95 slide-in-from-bottom-4 duration-200',
          sizeClasses[size],
          variant === 'light' ? 'bg-white' : 'bg-slate-800',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

/**
 * ModalBody Component
 *
 * Scrollable modal body content.
 *
 * @example
 * ```tsx
 * <ModalBody>
 *   <p>Your content here</p>
 * </ModalBody>
 * ```
 */
export function ModalBody({ children, className, noPadding = false }: ModalBodyProps) {
  return (
    <div
      className={cn(
        'overflow-y-auto max-h-[calc(90vh-140px)]',
        !noPadding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
