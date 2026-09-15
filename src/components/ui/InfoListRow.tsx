import { Clipboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "../../utils/cn";
import { Text } from "./Text";

interface InfoListRowProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  // Group is responsible for telling the last row not to draw a
  // divider — this component only knows about itself, not its
  // siblings.
  isLast?: boolean;
  // Only for values meant to be shared/reused (a referral code, an
  // account ID) rather than just read — renders a trailing copy
  // button. Most rows (email, phone, address) are display-only and
  // leave this unset.
  onCopy?: () => void;
}

// A single labeled field in a settings-style detail list: icon on the
// left, label/value stacked in a row rather than InfoRow's old
// caption-above-body stack. This is the standard "settings row" pattern
// (Stripe, FreshBooks, Wave) — scannable at a glance across many
// fields, with the icon giving each row a recognizable shape before
// reading the text. Fields with no value are hidden entirely rather
// than shown empty, same as the old InfoRow.
export function InfoListRow({
  icon: Icon,
  label,
  value,
  isLast = false,
  onCopy,
}: InfoListRowProps) {
  if (!value) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-row items-center gap-3 py-3",
        !isLast && "border-b border-border/50",
      )}
    >
      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary">
        <Icon size={18} className="text-muted-foreground" />
      </div>

      <Text variant="body-sm" className="text-muted-foreground w-28">
        {label}
      </Text>

      <Text variant="body" className="flex-1 font-medium truncate">
        {value}
      </Text>

      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${label}`}
          className="h-8 w-8 flex items-center justify-center rounded-md cursor-pointer"
        >
          <Clipboard size={18} className="text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
