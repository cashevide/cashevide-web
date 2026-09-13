import type { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";
import { Text } from "./Text";

type BadgeVariant =
  | "default"
  | "brand"
  | "success"
  | "warning"
  | "info"
  | "destructive";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

// Same bg/text-color pairing convention as Button's variants — a tinted
// fill (bg-{color}/15) with the matching -text token for readable
// contrast. "default" doesn't have its own -text token in index.css
// (only destructive/success/warning/info do), so it falls back to
// text-muted-foreground, which already passes contrast on a muted fill.
// "brand" reuses info-text rather than raw text-brand — brand and info
// are the exact same color in index.css (#377aff), so raw text-brand
// on a brand/15 tint has the identical low-contrast problem info-text
// was added to fix (3.25:1, below WCAG AA's 4.5:1).
const BG_CLASS: Record<BadgeVariant, string> = {
  default: "bg-muted",
  brand: "bg-brand/15",
  success: "bg-success/15",
  warning: "bg-warning/15",
  info: "bg-info/15",
  destructive: "bg-destructive/15",
};

const TEXT_CLASS: Record<BadgeVariant, string> = {
  default: "text-muted-foreground",
  brand: "text-info-text",
  success: "text-success-text",
  warning: "text-warning-text",
  info: "text-info-text",
  destructive: "text-destructive-text",
};

export function Badge({
  label,
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "self-start rounded-full px-2.5 py-1",
        BG_CLASS[variant],
        className,
      )}
      {...props}
    >
      <Text
        variant="caption"
        className={cn("font-semibold", TEXT_CLASS[variant])}
      >
        {label}
      </Text>
    </div>
  );
}
