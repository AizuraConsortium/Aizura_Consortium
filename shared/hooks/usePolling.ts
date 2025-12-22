import { useEffect, useRef, useState, useCallback } from 'react';

interface UsePollingOptions {
  enabled?: boolean;
  immediate?: boolean;
  pauseWhenHidden?: boolean;
  pauseWhenOffline?: boolean;
  adaptivePolling?: boolean;
  maxErrorDelay?: number;
  errorMultiplier?: number;
}

interface UsePollingControls {
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
  errorCount: number;
}

export function usePolling(
  callback: () => void | Promise<void>,
  interval: number,
  options: UsePollingOptions = {}
): UsePollingControls {
  const {
    enabled = true,
    immediate = true,
    pauseWhenHidden = true,
    pauseWhenOffline = true,
    adaptivePolling = true,
    maxErrorDelay = 30000,
    errorMultiplier = 2
  } = options;

  const savedCallback = useRef(callback);
  const isMountedRef = useRef(true);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

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
    if (!pauseWhenHidden) return;

    const handleVisibilityChange = () => {
      if (isMountedRef.current) {
        setIsVisible(!document.hidden);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseWhenHidden]);

  useEffect(() => {
    if (!pauseWhenOffline) return;

    const handleOnline = () => {
      if (isMountedRef.current) {
        setIsOnline(true);
        setErrorCount(0);
      }
    };

    const handleOffline = () => {
      if (isMountedRef.current) {
        setIsOnline(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pauseWhenOffline]);

  const calculateCurrentInterval = useCallback((): number => {
    if (!adaptivePolling || errorCount === 0) {
      return interval;
    }

    const delayMultiplier = Math.pow(errorMultiplier, Math.min(errorCount, 5));
    const adaptedInterval = interval * delayMultiplier;

    return Math.min(adaptedInterval, maxErrorDelay);
  }, [interval, errorCount, adaptivePolling, maxErrorDelay, errorMultiplier]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (!enabled || interval <= 0) {
      return;
    }

    const shouldPause =
      isPaused ||
      (pauseWhenHidden && !isVisible) ||
      (pauseWhenOffline && !isOnline);

    if (shouldPause) {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
      return;
    }

    const wrappedCallback = async () => {
      if (!isMountedRef.current) return;

      try {
        await savedCallback.current();

        if (isMountedRef.current && errorCount > 0) {
          setErrorCount(0);
        }
      } catch (error) {
        if (isMountedRef.current && adaptivePolling) {
          setErrorCount(prev => prev + 1);
        }
      }
    };

    if (immediate && !timerIdRef.current) {
      wrappedCallback();
    }

    const currentInterval = calculateCurrentInterval();
    timerIdRef.current = setInterval(wrappedCallback, currentInterval);

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [
    interval,
    enabled,
    immediate,
    isPaused,
    isVisible,
    isOnline,
    pauseWhenHidden,
    pauseWhenOffline,
    calculateCurrentInterval,
    errorCount,
    adaptivePolling
  ]);

  return {
    pause,
    resume,
    isPaused,
    errorCount
  };
}
