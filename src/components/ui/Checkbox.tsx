import { Check } from "lucide-react";

import { cn } from "../../utils/cn";

// NOTE: Expo's Checkbox.tsx was an empty placeholder file (never
// implemented there) — this is a fresh implementation, not a port,
// following the same visual language as the rest of this design
// system (Button/Switch's bg-brand-when-active pattern, Modal's
// border/radius scale).
interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  className = "",
}: CheckboxProps) {
  const box = (
    <span
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (!disabled) onCheckedChange(!checked);
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCheckedChange(!checked);
        }
      }}
      className={cn(
        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border cursor-pointer",
        checked
          ? "bg-brand border-brand"
          : "bg-card border-border",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "active:opacity-80",
      )}
    >
      {checked ? (
        <Check size={14} strokeWidth={3} className="text-brand-foreground" />
      ) : null}
    </span>
  );

  if (!label) {
    return <div className={className}>{box}</div>;
  }

  return (
    <label
      className={cn(
        "flex flex-row items-center gap-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      {box}
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}
