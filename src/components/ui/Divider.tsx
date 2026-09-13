import { cn } from "../../utils/cn";
import { Text } from "./Text";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
  // Fades from the border color to transparent left-to-right, instead
  // of ending in a hard edge. Only supported on the plain horizontal
  // divider (no label, no vertical orientation) — those already have
  // their own distinct rendering this doesn't try to merge with.
  fade?: boolean;
}

export function Divider({
  orientation = "horizontal",
  label,
  className = "",
  fade = false,
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        aria-hidden="true"
        className={cn("w-px self-stretch bg-border", className)}
      />
    );
  }

  if (label) {
    return (
      <div className={cn("flex flex-row items-center gap-3", className)}>
        <div className="h-px flex-1 bg-border" />
        <Text variant="caption">{label}</Text>
        <div className="h-px flex-1 bg-border" />
      </div>
    );
  }

  if (fade) {
    return (
      <div
        aria-hidden="true"
        className={cn("w-full", className)}
        style={{
          height: 1,
          background:
            "linear-gradient(to right, var(--color-border), transparent)",
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn("h-px w-full bg-border", className)}
    />
  );
}
