import { RefreshCw } from "lucide-react";

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold?: number;
}

export function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  if (pullDistance <= 0 && !isRefreshing) return null;

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      className="flex items-center justify-center overflow-hidden transition-[height] duration-200 ease-out"
      style={{ height: pullDistance }}
    >
      <RefreshCw
        className="h-5 w-5 text-primary transition-transform duration-200"
        style={{
          transform: `rotate(${progress * 360}deg)`,
          opacity: Math.max(progress, isRefreshing ? 1 : 0),
        }}
      />
    </div>
  );
}
