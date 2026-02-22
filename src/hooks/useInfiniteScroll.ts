import { useState, useCallback, useRef, useEffect } from "react";

export interface UseInfiniteScrollOptions<T> {
  /** Function that fetches the next page. Receives the current page number (0-indexed). */
  fetchPage: (page: number) => Promise<{ items: T[]; hasMore: boolean }>;
  /** Number of items per page / chunk size */
  pageSize?: number;
  /** Initial items to start with */
  initialItems?: T[];
}

export interface UseInfiniteScrollReturn<T> {
  items: T[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  retry: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

export function useInfiniteScroll<T>({
  fetchPage,
  initialItems = [],
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageRef = useRef(0);
  const loadingRef = useRef(false);
  const fetchPageRef = useRef(fetchPage);

  useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    const isFirstPage = pageRef.current === 0 && items.length === 0;

    if (isFirstPage) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }
    setError(null);

    try {
      const result = await fetchPageRef.current(pageRef.current);
      setItems((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      pageRef.current += 1;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load items";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
      loadingRef.current = false;
    }
  }, [hasMore, items.length]);

  const retry = useCallback(async () => {
    setError(null);
    loadingRef.current = false;
    await loadMore();
  }, [loadMore]);

  const refresh = useCallback(async () => {
    pageRef.current = 0;
    loadingRef.current = false;
    setItems([]);
    setHasMore(true);
    setError(null);
    setIsLoading(true);

    try {
      const result = await fetchPageRef.current(0);
      setItems(result.items);
      setHasMore(result.hasMore);
      pageRef.current = 1;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load items";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    pageRef.current = 0;
    loadingRef.current = false;
    setItems(initialItems);
    setHasMore(true);
    setError(null);
    setIsLoading(false);
    setIsFetchingMore(false);
  }, [initialItems]);

  return {
    items,
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    loadMore,
    retry,
    refresh,
    reset,
  };
}
