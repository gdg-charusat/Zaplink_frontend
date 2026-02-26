import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorRetryProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorRetry({
  message = "Something went wrong while loading.",
  onRetry,
}: ErrorRetryProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <div>
        <p className="text-foreground font-medium mb-1">Failed to load</p>
        <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
