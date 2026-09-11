import {
  type ReactNode,
  isValidElement,
  cloneElement,
  type ReactElement,
  type ButtonHTMLAttributes,
} from "react";

import { cn } from "../../utils/cn";
import { Text } from "./Text";
import { Spinner } from "./Spinner";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "brand"
  | "success"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";
type ButtonSize = "sm" | "default" | "lg" | "icon";
// Independent of variant (color) and size — same as fullWidth. Kept
// separate rather than baked into variant because shape and color
// aren't actually coupled: a brand-colored "New Invoice" button and a
// pill-shaped one are two unrelated decisions, and tying them together
// would mean a new variant for every shape × color combination that
// ever comes up.
type ButtonShape = "md" | "full";

const BG_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  brand: "bg-brand",
  success: "bg-success/15 border border-success/30",
  destructive: "bg-destructive/15 border border-destructive/30",
  outline: "bg-secondary border border-border",
  ghost: "bg-transparent",
  link: "bg-transparent",
};

const TEXT_CLASS: Record<ButtonVariant, string> = {
  primary: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  brand: "text-brand-foreground",
  success: "text-success-text",
  destructive: "text-destructive-text",
  outline: "text-foreground",
  ghost: "text-foreground",
  link: "text-link underline",
};

const ICON_COLOR: Record<ButtonVariant, string> = {
  primary: "var(--color-primary-foreground)",
  secondary: "var(--color-secondary-foreground)",
  brand: "var(--color-brand-foreground)",
  success: "var(--color-success-text)",
  destructive: "var(--color-destructive-text)",
  outline: "var(--color-foreground)",
  ghost: "var(--color-foreground)",
  link: "var(--color-link)",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "h-11 min-w-[100px] px-4",
  default: "h-12 min-w-[120px] px-6",
  lg: "h-14 min-w-[140px] px-8",
  icon: "h-12 w-12",
};

const SHAPE_CLASS: Record<ButtonShape, string> = {
  md: "rounded-md",
  full: "rounded-full",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  title,
  variant = "primary",
  size = "default",
  shape = "full",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  icon,
  fullWidth = false,
  className = "",
  "aria-label": ariaLabel,
  ...props
}: ButtonProps) {
  const iconColor = ICON_COLOR[variant];
  const isIconOnly = size === "icon";

  function renderIcon(iconNode: ReactNode) {
    if (isValidElement(iconNode)) {
      return cloneElement(iconNode as ReactElement<{ color?: string }>, {
        color: iconColor,
      });
    }
    return iconNode;
  }

  const isDisabled = disabled || isLoading;
  const isLinkVariant = variant === "link";

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-label={ariaLabel ?? title}
      className={cn(
        "flex flex-row items-center justify-center cursor-pointer",
        isLinkVariant ? "px-0 h-auto" : SHAPE_CLASS[shape],
        !isLinkVariant && SIZE_CLASS[size],
        fullWidth && !isIconOnly && "w-full",
        BG_CLASS[variant],
        "active:opacity-60",
        isDisabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner
          size="sm"
          color={iconColor}
          className={isIconOnly ? "" : "mr-2"}
        />
      ) : isIconOnly ? (
        renderIcon(icon)
      ) : (
        leftIcon && <span className="mr-2">{renderIcon(leftIcon)}</span>
      )}

      {!isIconOnly && (
        <Text variant="button" className={TEXT_CLASS[variant]}>
          {title}
        </Text>
      )}

      {!isLoading && !isIconOnly && rightIcon && (
        <span className="ml-2">{renderIcon(rightIcon)}</span>
      )}
    </button>
  );
}
