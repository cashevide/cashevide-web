import type { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";

type ContainerVariant = "narrow" | "desktop" | "full";

const VARIANT_CLASS: Record<ContainerVariant, string> = {
  narrow: "max-w-narrow",
  desktop: "max-w-desktop",
  full: "w-full",
};

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ContainerVariant;
  className?: string;
  scroll?: boolean;
}

export function Container({
  variant = "full",
  className = "",
  scroll = false,
  children,
  ...props
}: ContainerProps) {
  const content = (
    <div
      className={cn("flex-1 w-full mx-auto", VARIANT_CLASS[variant], className)}
      {...props}
    >
      {children}
    </div>
  );

  if (scroll) {
    return (
      <div className="flex-1 bg-background overflow-y-auto">{content}</div>
    );
  }

  return <div className="flex-1 bg-background">{content}</div>;
}
