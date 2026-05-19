import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastComponent, Toast, ToastType } from './Toast';

interface ToastContextType {
  showToast: (typeOrTitle: ToastType | string, titleOrType?: string, message?: string, duration?: number) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTypes: ToastType[] = ['success', 'error', 'warning', 'info'];

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (typeOrTitle: ToastType | string, titleOrType?: string, message?: string, duration?: number) => {
      const firstArgIsType = toastTypes.includes(typeOrTitle as ToastType);
      const type = firstArgIsType
        ? (typeOrTitle as ToastType)
        : (toastTypes.includes(titleOrType as ToastType) ? (titleOrType as ToastType) : 'info');
      const title = firstArgIsType ? (titleOrType || '') : typeOrTitle;
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = {
        id,
        type,
        title,
        message,
        duration,
      };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        return updated.slice(-maxToasts);
      });
    },
    [maxToasts]
  );

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showToast('success', title, message);
    },
    [showToast]
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      showToast('error', title, message, 7000);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (title: string, message?: string) => {
      showToast('warning', title, message, 6000);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showToast('info', title, message);
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast,
      }}
    >
      {children}
      <div
        className="fixed bottom-0 right-0 z-50 p-4 space-y-4 pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
