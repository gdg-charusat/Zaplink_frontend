import { cn } from "../../lib/utils";

interface ListItemSkeletonProps {
  className?: string;
}

export function ListItemSkeleton({ className }: ListItemSkeletonProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border border-border bg-card animate-pulse",
        className
      )}
    >
      {/* Icon placeholder */}
      <div className="h-12 w-12 rounded-xl bg-muted shrink-0" />
      {/* Content placeholder */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 w-3/5 rounded bg-muted" />
        <div className="h-3 w-2/5 rounded bg-muted" />
      </div>
      {/* Right side placeholder */}
      <div className="h-8 w-20 rounded-lg bg-muted shrink-0" />
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export function SkeletonList({ count = 6, className }: SkeletonListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
}
