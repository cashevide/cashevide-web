import { cn } from "../../utils/cn";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 26;
const THUMB_SIZE = 20;
const THUMB_MARGIN = 3;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN * 2;

// Expo's version drove the thumb's slide with react-native-reanimated
// (useDerivedValue + withTiming). Web has no equivalent native-driver
// concern — a plain CSS transition on transform achieves the same
// 150ms slide with zero extra dependencies.
export function Switch({
  value,
  onValueChange,
  disabled = false,
  ariaLabel,
  className = "",
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onValueChange(!value)}
      className={cn(
        "inline-flex cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <span
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
        }}
        className={cn(
          "flex items-center",
          value ? "bg-brand" : "bg-disabled-foreground",
        )}
      >
        <span
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            marginLeft: THUMB_MARGIN,
            transform: `translateX(${value ? THUMB_TRAVEL : 0}px)`,
            transition: "transform 150ms ease",
          }}
          className="block rounded-full bg-white"
        />
      </span>
    </button>
  );
}
