import { useEffect, useRef } from 'react';

interface UsePollingOptions {
  enabled?: boolean;
  immediate?: boolean;
}

export function usePolling(
  callback: () => void | Promise<void>,
  interval: number,
  options: UsePollingOptions = {}
): void {
  const { enabled = true, immediate = true } = options;
  const savedCallback = useRef(callback);
  const isMountedRef = useRef(true);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled || interval <= 0) {
      return;
    }

    const wrappedCallback = async () => {
      if (isMountedRef.current) {
        await savedCallback.current();
      }
    };

    if (immediate) {
      wrappedCallback();
    }

    const timerId = setInterval(wrappedCallback, interval);

    return () => {
      clearInterval(timerId);
    };
  }, [interval, enabled, immediate]);
}
