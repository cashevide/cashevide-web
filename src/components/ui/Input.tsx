import {
  useState,
  type ComponentPropsWithoutRef,
  type FocusEventHandler,
} from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

import { cn } from "../../utils/cn";
import { getInputFieldClasses } from "./inputFieldStyles";
import { Text } from "./Text";

interface InputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "onFocus" | "onBlur"
> {
  label?: string;
  error?: string;
  isPassword?: boolean;
  isSuccess?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export function Input({
  label,
  error,
  isPassword = false,
  isSuccess = false,
  disabled = false,
  className = "",
  multiline = false,
  rows = 4,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const state = error
    ? "error"
    : isSuccess
      ? "success"
      : isFocused
        ? "focused"
        : "default";

  const hasTrailingIcon = isPassword || !!error || isSuccess;

  const fieldClassName = getInputFieldClasses({
    state,
    disabled,
    className: cn(
      "w-full",
      hasTrailingIcon && "pr-12",
      multiline && "h-auto min-h-[96px] py-3",
    ),
  });

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {label && <Text variant="body-sm">{label}</Text>}

      <div className="relative w-full flex items-center">
        {multiline ? (
          <textarea
            className={fieldClassName}
            disabled={disabled}
            rows={rows}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...(props as ComponentPropsWithoutRef<"textarea">)}
          />
        ) : (
          <input
            type={isPassword && !showPassword ? "password" : "text"}
            className={fieldClassName}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
        )}

        <div className="absolute right-4 flex flex-row items-center">
          {!isPassword && error && <XCircle className="text-destructive" />}

          {!isPassword && isSuccess && !error && (
            <CheckCircle className="text-success" />
          )}

          {isPassword && (
            <button
              type="button"
              className="p-1 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="text-muted-foreground" />
              ) : (
                <Eye className="text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <Text variant="body-sm" className="text-destructive text-center">
          {error}
        </Text>
      )}
    </div>
  );
}
