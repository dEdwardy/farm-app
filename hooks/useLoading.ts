import { useCallback, useState } from 'react';

interface UseLoadingReturn {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
}

export function useLoading(initialState = false): UseLoadingReturn {
  const [loading, setLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const withLoading = useCallback(async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      return await asyncFn();
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, startLoading, stopLoading, withLoading };
}

interface UseAsyncActionReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<T | null>;
  reset: () => void;
}

export function useAsyncAction<T>(
  asyncFn: () => Promise<T>,
  immediate = false
): UseAsyncActionReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '操作失败';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}
