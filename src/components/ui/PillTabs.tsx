import { cn } from "../../utils/cn";
import { Text } from "./Text";

export type PillTabItem = {
  key: string;
  label: string;
};

interface PillTabsProps {
  items: PillTabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  className?: string;
  // Centers the pill row when it's shorter than the available width
  // (e.g. Profile's two tabs). Left unset (false) for every other
  // existing usage so nothing else changes — a longer list that
  // actually needs to scroll ignores this anyway, since content wider
  // than the viewport can't be centered.
  centered?: boolean;
  // Purely a rendering choice — this is still PillTabs, still meant
  // for page-level navigation (route changes), same as every other
  // usage. "segmented" only swaps the pixels to match a bordered-track
  // look for screens where floating pills read as incomplete (e.g.
  // Profile's two tabs); it does not make this a same-page
  // filter/toggle control.
  variant?: "pills" | "segmented";
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
  variant = "pills",
}: PillTabsProps) {
  const isSegmented = variant === "segmented";

  const tabs = (
    <div
      className={cn(
        "flex flex-row overflow-x-auto",
        isSegmented ? "gap-0" : "gap-2",
        centered ? "self-center" : "w-full",
        isSegmented &&
          "rounded-md bg-secondary/50 border border-border/50 p-1",
        className,
      )}
      style={{ flexShrink: 0 }}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            aria-pressed={isActive}
            className={cn(
              "flex items-center justify-center shrink-0 cursor-pointer",
              isSegmented ? "h-7 px-3.5 rounded-sm" : "h-9 px-4 rounded-full",
              isActive
                ? isSegmented
                  ? "bg-card shadow-sm"
                  : "bg-secondary border border-border"
                : "bg-transparent",
            )}
          >
            <Text
              variant="body-sm"
              className={cn(
                "font-medium",
                isActive ? "text-foreground" : "text-muted-foreground",
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
