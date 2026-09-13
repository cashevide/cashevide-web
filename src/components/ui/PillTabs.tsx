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

  const tabs = (
    <div
      className={cn(
        "flex flex-row overflow-x-auto",
        isSegmented ? "gap-0" : "gap-2",
        centered ? "self-center" : isSegmented ? "self-start" : "w-full",
        isSegmented && "rounded-md bg-secondary/50 border border-border/50 p-1",
        className,
      )}
      style={{ flexShrink: 0 }}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;

        const activeBgClass = isSegmented
          ? item.variant === "success"
            ? "bg-success/15"
            : item.variant === "destructive"
              ? "bg-destructive/15"
              : "bg-card shadow-sm"
          : "bg-secondary border border-border";

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
            type="button"
            onClick={() => onSelect(item.key)}
            aria-pressed={isActive}
            className={cn(
              "flex items-center justify-center shrink-0 cursor-pointer",
              isSegmented ? "h-7 px-3.5 rounded-sm" : "h-9 px-4 rounded-full",
              isActive && activeBgClass,
              !isActive && "bg-transparent",
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
