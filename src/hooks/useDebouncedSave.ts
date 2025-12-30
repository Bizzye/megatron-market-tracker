import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedSave<
  T extends (...args: Parameters<T>) => void | Promise<void>
>(callback: T, delay = 600) {
  const latest = useRef(callback);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    latest.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        latest.current(...args);
      }, delay);
    },
    [delay]
  );
}
