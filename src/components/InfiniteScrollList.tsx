import React, { useRef, useEffect, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import { useDebouncedCallback } from "../hooks/useDebounce";
import { SkeletonList } from "./ui/skeleton-list";
import { ErrorRetry } from "./ui/error-retry";
import { EndOfList } from "./ui/end-of-list";
import { LoadingMore } from "./ui/loading-more";
import { PullToRefreshIndicator } from "./ui/pull-to-refresh-indicator";
import { cn } from "../lib/utils";

export interface InfiniteScrollProps<T> {
  /** All loaded items */
  items: T[];
  /** Called to load the next page of items */
  loadMore: () => Promise<void>;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether the initial load is in progress */
  isLoading: boolean;
  /** Whether a subsequent page is being fetched */
  isFetchingMore: boolean;
  /** Error message, if any */
  error: string | null;
  /** Retry callback after an error */
  onRetry: () => void;
  /** Refresh callback for pull-to-refresh */
  onRefresh: () => Promise<void>;
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Estimated height of each item in pixels (for virtualization) */
  estimateSize?: number;
  /** Overscan – how many items to render outside the visible area */
  overscan?: number;
  /** Additional CSS class for the outer container */
  className?: string;
  /** Enable pull-to-refresh (default: true on touch devices) */
  enablePullToRefresh?: boolean;
  /** Number of skeleton items to show during initial load */
  skeletonCount?: number;
  /** How many items from the bottom to trigger loadMore */
  loadMoreThreshold?: number;
  /** Unique key extractor for items */
  getItemKey?: (item: T, index: number) => string | number;
}

export function InfiniteScrollList<T>({
  items,
  loadMore,
  hasMore,
  isLoading,
  isFetchingMore,
  error,
  onRetry,
  onRefresh,
  renderItem,
  estimateSize = 80,
  overscan = 5,
  className,
  enablePullToRefresh = true,
  skeletonCount = 8,
  loadMoreThreshold = 5,
  getItemKey,
}: InfiniteScrollProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(loadMore);

  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  // Scroll restoration across route changes
  useScrollRestoration(parentRef);

  // Pull-to-refresh for mobile
  const {
    pullDistance,
    isRefreshing,
    handlers: pullHandlers,
  } = usePullToRefresh({
    onRefresh,
    enabled: enablePullToRefresh,
  });

  // Virtual row count includes an extra row for loading/end indicator
  const rowCount = items.length + (hasMore || error ? 1 : (!hasMore && items.length > 0 ? 1 : 0));

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: getItemKey
      ? (index) => {
          if (index < items.length) {
            return getItemKey(items[index], index);
          }
          return `__footer_${index}`;
        }
      : undefined,
  });

  // Debounced loadMore to avoid rapid-fire calls
  const debouncedLoadMore = useDebouncedCallback(() => {
    loadMoreRef.current();
  }, 150);

  // IntersectionObserver trigger: load when sentinel enters viewport
  useEffect(() => {
    const root = parentRef.current;
    const sentinel = sentinelRef.current;

    if (!root || !sentinel || !hasMore || isFetchingMore || isLoading || error) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          debouncedLoadMore();
        }
      },
      {
        root,
        rootMargin: `${estimateSize * loadMoreThreshold}px 0px`,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [
    hasMore,
    isFetchingMore,
    isLoading,
    error,
    items.length,
    estimateSize,
    loadMoreThreshold,
    debouncedLoadMore,
  ]);

  // Debounced scroll fallback (for environments where observer can be delayed)
  const debouncedHandleScroll = useDebouncedCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number) => {
      if (!hasMore || isFetchingMore || isLoading || error) return;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      if (distanceToBottom <= estimateSize * loadMoreThreshold) {
        loadMoreRef.current();
      }
    },
    120
  );

  const onScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      debouncedHandleScroll(
        target.scrollTop,
        target.scrollHeight,
        target.clientHeight
      );
    },
    [debouncedHandleScroll]
  );

  const virtualItems = virtualizer.getVirtualItems();

  // ─── Initial loading state ───
  if (isLoading && items.length === 0) {
    return (
      <div className={cn("px-4", className)}>
        <SkeletonList count={skeletonCount} />
      </div>
    );
  }

  // ─── Initial error state ───
  if (error && items.length === 0) {
    return (
      <div className={className}>
        <ErrorRetry message={error} onRetry={onRetry} />
      </div>
    );
  }

  // ─── Empty state ───
  if (!isLoading && items.length === 0 && !hasMore) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-20 text-muted-foreground", className)}>
        <p className="text-lg font-medium">No items yet</p>
        <p className="text-sm mt-1">Items will appear here once created.</p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={cn(
        "h-full overflow-auto will-change-scroll",
        className
      )}
      onScroll={onScroll}
      {...pullHandlers}
    >
      {/* Pull-to-refresh indicator */}
      <PullToRefreshIndicator
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
      />

      {/* Virtualized list */}
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualRow) => {
          const isFooter = virtualRow.index >= items.length;

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isFooter ? (
                // Footer: loading more, error, or end-of-list
                <div className="px-4">
                  {isFetchingMore && <LoadingMore />}
                  {error && <ErrorRetry message={error} onRetry={onRetry} />}
                  {!hasMore && !error && !isFetchingMore && (
                    <EndOfList />
                  )}
                </div>
              ) : (
                <div className="px-4 py-1.5">
                  {renderItem(items[virtualRow.index], virtualRow.index)}
                </div>
              )}
            </div>
          );
        })}

        {/* Sentinel for IntersectionObserver */}
        <div
          ref={sentinelRef}
          style={{
            position: "absolute",
            top: Math.max(0, virtualizer.getTotalSize() - 1),
            left: 0,
            width: "100%",
            height: 1,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
