import { useState, type ComponentPropsWithoutRef } from "react";
import { Search, XCircle } from "lucide-react";

import { cn } from "../../utils/cn";
import { getInputFieldClasses } from "./inputFieldStyles";

interface SearchInputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "value"> {
  value: string;
  onClear?: () => void;
  className?: string;
}

// Search-specific input: leading magnifying-glass icon, trailing clear
// button that only shows once there's text to clear. Shares Input's
// token system (getInputFieldClasses) but doesn't use Input itself —
// the two icon slots (leading search icon, trailing conditional clear)
// don't fit Input's existing trailing-only icon slot cleanly.
export function SearchInput({
  value,
  onClear,
  className = "",
  onFocus,
  onBlur,
  ...props
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn("relative w-full flex items-center", className)}>
      <div className="absolute left-4 z-10">
        <Search size={18} className="text-muted-foreground" />
      </div>

      <input
        value={value}
        className={getInputFieldClasses({
          state: isFocused ? "focused" : "default",
          className: cn("w-full pl-11", value && "pr-11"),
        })}
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
      />

      {value.length > 0 && onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-4 z-10 p-1 cursor-pointer"
        >
          <XCircle size={18} className="text-muted-foreground" />
        </button>
      ) : null}
    </div>
  );
}
