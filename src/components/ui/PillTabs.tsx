import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "../../utils/cn";
import { Text } from "./Text";

export type PillTabItem = {
  key: string;
  label: string;
  // Optional sentiment tint for the active state — used when a
  // segment represents a judgment (e.g. a POSITIVE/NEGATIVE tag)
  // rather than a neutral choice (currency, sort order). Only takes
  // effect in "segmented" layout; "pills" layout ignores it (page
  // navigation tabs don't carry sentiment). Omit for the default
  // neutral active state.
  variant?: "success" | "destructive";
};

interface PillTabsProps {
  items: PillTabItem[];
  // Nullable — a "segmented" group can start with nothing selected
  // (e.g. an optional mutually-exclusive tag group), unlike a
  // currency/sort control where something is always active. Whether
  // tapping an already-active segment deselects it back to null is
  // the caller's decision (in onSelect), not this component's — it
  // only renders whatever activeKey it's given.
  activeKey: string | null;
  onSelect: (key: string) => void;
  className?: string;
  // Centers the row when it's shorter than the available width (e.g.
  // Profile's two tabs). Left unset (false) for every other existing
  // usage so nothing else changes — a longer list that actually needs
  // to scroll ignores this anyway, since content wider than the
  // viewport can't be centered.
  centered?: boolean;
  // "pills": floating pills, meant for page-level navigation (route
  // changes) — e.g. Dashboard/Invoices/Clients/Products.
  // "segmented": a single bordered track with tight segments, closer
  // to an iOS segmented control — for a same-page filter/toggle
  // rather than navigation (a currency switch, a sort order). Floating
  // pills read as "another row of pages to visit"; a same-page control
  // needs to look visually secondary and clearly grouped instead.
  layout?: "pills" | "segmented";
}

// Visual language matches Button's outline (active) and ghost (inactive)
// variants — same bg/border/text classes — just at pill sizing instead
// of Button's own size scale.
export function PillTabs({
  items,
  activeKey,
  onSelect,
  className = "",
  centered = false,
  layout = "pills",
}: PillTabsProps) {
  const isSegmented = layout === "segmented";

  // Sliding highlight — same idea as AppShell's mobile tab bar (an
  // absolutely positioned pill behind the buttons, animated with
  // transform), but measured from each button's actual rendered
  // rect via refs instead of a fixed slot width. Mobile bar items are
  // all identical icon-only squares so a fixed slotWidth works there;
  // PillTabs items are variable-width text ("Newest" vs "Due Date"),
  // so the highlight's offsetX/width have to come from the DOM.
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [highlightStyle, setHighlightStyle] = useState<{
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    opacity: number;
  } | null>(null);

  function measure() {
    const activeEl = activeKey ? buttonRefs.current.get(activeKey) : null;

    if (!activeEl) {
      // No active item (nullable segmented group) — collapse and
      // fade the highlight out rather than leaving it stuck at its
      // last position.
      setHighlightStyle((prev) => (prev ? { ...prev, opacity: 0 } : null));
      return;
    }

    // offsetLeft/offsetTop/offsetWidth/offsetHeight are relative to
    // the nearest positioned ancestor — trackRef itself, since it's
    // position:relative and each button is its direct child. This
    // is the correct pairing for positioning an absolutely-positioned
    // sibling: getBoundingClientRect() was used before, but it
    // returns viewport-relative border-box rects, which don't line
    // up cleanly with an absolutely positioned child's own top:0/
    // left:0 reference point when the relative parent has its own
    // border (segmented's track has border border-border/50) — that
    // mismatch was the source of the highlight sitting off-position.
    setHighlightStyle({
      offsetX: activeEl.offsetLeft,
      offsetY: activeEl.offsetTop,
      width: activeEl.offsetWidth,
      height: activeEl.offsetHeight,
      opacity: 1,
    });
  }

  useLayoutEffect(measure, [activeKey, items]);

  // ResizeObserver on the track and every button, rather than a
  // window "resize" listener — this catches ANY layout shift that
  // changes a button's rect: a container resize, but also a web-font
  // swap (font-display: swap loads a fallback first, then Geist,
  // which can shift each label's width without the *window* ever
  // resizing) or the items list itself changing width. A window
  // resize listener alone would miss all of those, leaving the
  // highlight stuck at stale measurements.
  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    const observer = new ResizeObserver(measure);
    observer.observe(trackEl);
    buttonRefs.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, items]);

  const activeItem = items.find((item) => item.key === activeKey);

  const highlightBgClass = isSegmented
    ? activeItem?.variant === "success"
      ? "bg-success/15"
      : activeItem?.variant === "destructive"
        ? "bg-destructive/15"
        : "bg-card shadow-sm"
    : "bg-secondary border border-border";

  const tabs = (
    <div
      ref={trackRef}
      className={cn(
        "relative flex flex-row overflow-x-auto",
        isSegmented ? "gap-0" : "gap-2",
        centered ? "self-center" : isSegmented ? "self-start" : "w-full",
        isSegmented && "rounded-md bg-secondary/50 border border-border/50 p-1",
        className,
      )}
      style={{ flexShrink: 0 }}
    >
      {highlightStyle && (
        <div
          aria-hidden="true"
          className={cn(
            "absolute left-0 top-0 z-0",
            isSegmented ? "rounded-sm" : "rounded-full",
            highlightBgClass,
          )}
          style={{
            width: highlightStyle.width,
            height: highlightStyle.height,
            transform: `translate(${highlightStyle.offsetX}px, ${highlightStyle.offsetY}px)`,
            opacity: highlightStyle.opacity,
            transition:
              "transform 220ms ease, width 220ms ease, height 220ms ease, opacity 150ms ease",
          }}
        />
      )}

      {items.map((item) => {
        const isActive = item.key === activeKey;

        const activeTextClass = isSegmented
          ? item.variant === "success"
            ? "text-success-text"
            : item.variant === "destructive"
              ? "text-destructive-text"
              : "text-foreground"
          : "text-foreground";

        return (
          <button
            key={item.key}
            ref={(el) => {
              if (el) buttonRefs.current.set(item.key, el);
              else buttonRefs.current.delete(item.key);
            }}
            type="button"
            onClick={() => onSelect(item.key)}
            aria-pressed={isActive}
            className={cn(
              "relative z-10 flex items-center justify-center shrink-0 cursor-pointer",
              isSegmented ? "h-7 px-3.5 rounded-sm" : "h-9 px-4 rounded-full",
            )}
          >
            <Text
              variant="body-sm"
              className={cn(
                "font-medium",
                isActive ? activeTextClass : "text-muted-foreground",
              )}
            >
              {item.label}
            </Text>
          </button>
        );
      })}
    </div>
  );

  // "self-center" on the row alone doesn't center it without a
  // full-width parent to center within — flex layout centers a child
  // relative to its parent's cross axis, so without this wrapper the
  // row has nothing wider than itself to center against.
  if (centered) {
    return <div className="w-full flex flex-col items-center">{tabs}</div>;
  }

  return tabs;
}
