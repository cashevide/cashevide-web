import { cn } from "../../utils/cn";

export type InputFieldState = "default" | "focused" | "error" | "success";

interface InputFieldClassesOptions {
  state: InputFieldState;
  disabled?: boolean;
  className?: string;
}

const BORDER_CLASS: Record<InputFieldState, string> = {
  default: "border-border",
  focused: "border-ring",
  error: "border-destructive",
  success: "border-success",
};

// Shared base styling for any text-entry field (Input, OtpInput,
// PhoneNumberInput, ...). Change radius/bg/border-width/etc. here once
// and every field built on top of it stays in sync.
export function getInputFieldClasses({
  state,
  disabled = false,
  className = "",
}: InputFieldClassesOptions) {
  return cn(
    "h-12 px-4 bg-input text-foreground rounded-lg border outline-none placeholder:text-muted-foreground",
    BORDER_CLASS[state],
    disabled && "opacity-50",
    className,
  );
}
