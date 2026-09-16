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
      className={cn(
        "flex flex-1 flex-col w-full mx-auto",
        VARIANT_CLASS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );

  if (scroll) {
    // flex-1 (not h-full alone) — this Container is typically used as a
    // flex sibling after a fixed-height ScreenHeader inside a flex-col
    // wrapper (e.g. InvoiceListContent: header h-20, then this Container
    // taking the rest). h-full only resolves against the parent's own
    // height (100%), which does NOT account for a sibling already taking
    // up space in a flex layout — a flex item's actual space comes from
    // flex-grow/flex-basis, not a height percentage. Without flex-1, this
    // div's height computation conflicts with sitting alongside the
    // header, and the box ends up overflowing its intended bounds instead
    // of being clipped to "whatever's left after the header" — which is
    // what forced the whole page to scroll instead of just this list.
    // Matches Expo's ScrollView, which used className="flex-1" for
    // exactly the same reason (see cashevide-frontend's Container.tsx).
    return (
      <div className="flex flex-1 flex-col h-full bg-background overflow-y-auto">
        {content}
      </div>
    );
  }

  // min-h-dvh (not min-h-screen) — min-h-screen is Tailwind's 100vh
  // utility, which — like the html/body/#root height fix in
  // index.css — resolves against the layout viewport (sized as if
  // the mobile browser's address bar is hidden). On load, with the
  // address bar visible, that's taller than what's actually on
  // screen, so this div demands more height than the viewport gives
  // it and the whole page scrolls (e.g. WelcomeContent). min-h-dvh
  // tracks the current visible height instead, shrinking/growing
  // live as the address bar shows or hides.
  return <div className="flex flex-col min-h-dvh bg-background">{content}</div>;
}
