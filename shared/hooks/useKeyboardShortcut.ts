import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export type KeyCombo = string | string[];

/**
 * useKeyboardShortcut Hook
 *
 * Generic keyboard shortcut handler.
 *
 * Supports:
 * - Single keys: 'Escape', 'Enter', etc.
 * - Key combos: 'Meta+k', 'Ctrl+Shift+p'
 * - Multiple shortcuts: ['Ctrl+s', 'Meta+s']
 *
 * @example
 * ```tsx
 * // Single key
 * useKeyboardShortcut('Escape', handleClose);
 *
 * // Key combo
 * useKeyboardShortcut('Meta+k', handleSearch, { preventDefault: true });
 *
 * // Multiple shortcuts
 * useKeyboardShortcut(['Ctrl+s', 'Meta+s'], handleSave, {
 *   enabled: isDirty,
 *   preventDefault: true,
 * });
 * ```
 *
 * @param keys - Key or array of keys to listen for
 * @param callback - Function to call when shortcut is pressed
 * @param options - Configuration options
 */
export function useKeyboardShortcut(
  keys: KeyCombo,
  callback: (event: KeyboardEvent) => void,
  options: KeyboardShortcutOptions = {}
) {
  const {
    enabled = true,
    preventDefault = false,
    stopPropagation = false,
  } = options;

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const keyArray = Array.isArray(keys) ? keys : [keys];

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedCombo = [
        event.ctrlKey && 'Ctrl',
        event.shiftKey && 'Shift',
        event.altKey && 'Alt',
        event.metaKey && 'Meta',
        event.key,
      ]
        .filter(Boolean)
        .join('+');

      const matches = keyArray.some((combo) => {
        const normalizedCombo = combo.replace(/\s/g, '');
        const normalizedPressed = pressedCombo.replace(/\s/g, '');
        return normalizedCombo.toLowerCase() === normalizedPressed.toLowerCase();
      });

      if (matches) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        callbackRef.current(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyArray, enabled, preventDefault, stopPropagation]);
}
