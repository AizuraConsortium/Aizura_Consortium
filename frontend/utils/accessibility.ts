/**
 * Accessibility utility functions for keyboard navigation and focus management
 */

/**
 * Handle keyboard interaction for clickable elements
 * Triggers callback on Enter or Space key
 */
export function handleKeyboardClick(
  event: React.KeyboardEvent,
  callback: () => void
): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(selector));
}

/**
 * Restore focus to a previously focused element
 */
export function restoreFocus(element: HTMLElement | null): void {
  if (element && typeof element.focus === 'function') {
    setTimeout(() => {
      element.focus();
    }, 0);
  }
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
