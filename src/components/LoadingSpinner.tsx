import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const spinnerVariants = cva(
  "rounded-full border-transparent animate-spin",
  {
    variants: {
      size: {
        small: "h-6 w-6 border-2 border-t-primary border-r-primary/40",
        medium: "h-10 w-10 border-4 border-t-primary border-r-primary/40",
        large: "h-14 w-14 border-4 border-t-primary border-r-primary/40",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(spinnerVariants({ size, className }))}
      {...props}
    />
  )
);

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };
