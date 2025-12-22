import { useState, useCallback } from 'react';

export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * useModal Hook
 *
 * Simple modal state management hook.
 *
 * @example
 * ```tsx
 * const modal = useModal();
 *
 * <button onClick={modal.open}>Open Modal</button>
 *
 * <Modal
 *   isOpen={modal.isOpen}
 *   onClose={modal.close}
 * >
 *   Content here
 * </Modal>
 * ```
 *
 * @param initialOpen - Initial open state (default: false)
 * @returns Modal state and control functions
 */
export function useModal(initialOpen: boolean = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
