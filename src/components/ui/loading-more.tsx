import { Loader2 } from "lucide-react";

interface LoadingMoreProps {
  message?: string;
}

export function LoadingMore({
  message = "Loading more items...",
}: LoadingMoreProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
