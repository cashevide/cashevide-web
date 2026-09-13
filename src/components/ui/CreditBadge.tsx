import { cn } from "../../utils/cn";
import { Text } from "./Text";

interface CreditBadgeProps {
  points: number;
  onClick?: () => void;
  size?: "sm" | "default";
  className?: string;
}

// Reusable credit-points display — a gold coin icon + point count in a
// bordered pill. Uses the custom Cashevide coin SVG
// (public/images/credit-coin.svg, Noufal's own Illustrator design)
// rather than a generic icon. Clickable (opens a details dialog) when
// onClick is given; a plain static badge otherwise — used in the
// dashboard header today, but written generically enough for anywhere
// else a compact credit-points display is needed (e.g. a
// settings/profile page).
export function CreditBadge({
  points,
  onClick,
  size = "default",
  className = "",
}: CreditBadgeProps) {
  const isSmall = size === "sm";
  const coinSize = isSmall ? 16 : 20;

  const content = (
    <>
      <img
        src="/images/credit-coin.svg"
        alt=""
        width={coinSize}
        height={coinSize}
        className="shrink-0"
      />
      <Text variant={isSmall ? "caption" : "body-sm"} className="font-semibold">
        {points.toLocaleString()}
      </Text>
    </>
  );

  const pillClass = cn(
    "inline-flex flex-row items-center rounded-full bg-secondary border border-border",
    isSmall ? "gap-1 px-2 py-1" : "gap-1.5 px-3 py-1.5",
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(pillClass, "cursor-pointer")}
      >
        {content}
      </button>
    );
  }

  return <div className={pillClass}>{content}</div>;
}
