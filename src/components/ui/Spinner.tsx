import type { ComponentPropsWithoutRef } from "react";

import { cn } from "../../utils/cn";

type SpinnerSize = "sm" | "default" | "lg";

const SIZE_CLASS: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  default: "h-5 w-5 border-2",
  lg: "h-8 w-8 border-[3px]",
};

interface SpinnerProps extends ComponentPropsWithoutRef<"span"> {
  size?: SpinnerSize;
  color?: string;
  className?: string;
}

export function Spinner({
  size = "default",
  color = "var(--color-foreground)",
  className = "",
  style,
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-solid border-current border-r-transparent",
        SIZE_CLASS[size],
        className,
      )}
      style={{ color, ...style }}
      {...props}
    />
  );
}
