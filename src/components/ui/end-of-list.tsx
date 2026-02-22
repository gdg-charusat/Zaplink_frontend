import { CheckCircle2 } from "lucide-react";

interface EndOfListProps {
  message?: string;
}

export function EndOfList({
  message = "You've reached the end",
}: EndOfListProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
      <CheckCircle2 className="h-4 w-4" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
