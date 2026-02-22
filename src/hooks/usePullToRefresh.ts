import { useRef, useCallback, useState, useEffect } from "react";

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  /** Minimum pull distance in px to trigger refresh */
  threshold?: number;
  /** Whether pull-to-refresh is enabled */
  enabled?: boolean;
}

interface UsePullToRefreshReturn {
  pullDistance: number;
  isRefreshing: boolean;
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  enabled = true,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || isRefreshing) return;
      const target = e.currentTarget;
      // Only allow pull-to-refresh when scrolled to top
      if (target.scrollTop <= 0) {
        startYRef.current = e.touches[0].clientY;
        pullingRef.current = true;
      }
    },
    [enabled, isRefreshing]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!pullingRef.current || !enabled || isRefreshing) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startYRef.current;
      if (diff > 0) {
        // Apply resistance – the further you pull, the harder it gets
        const resistance = Math.min(diff * 0.4, threshold * 1.5);
        setPullDistance(resistance);
      }
    },
    [enabled, isRefreshing, threshold]
  );

  const onTouchEnd = useCallback(async () => {
    if (!pullingRef.current || !enabled) return;
    pullingRef.current = false;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold * 0.5); // Show a partial indicator during refresh
      try {
        await onRefreshRef.current();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, enabled]);

  return {
    pullDistance,
    isRefreshing,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
