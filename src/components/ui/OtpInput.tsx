import { useRef, useState } from "react";

import { getInputFieldClasses } from "./inputFieldStyles";

interface OtpInputProps {
  value: string;
  onChangeText: (value: string) => void;
  length?: number;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  // Fires on Enter from any digit box — the screens using this always
  // pair it with an already-disabled Verify button until the code is
  // complete, so there's no separate "is it complete" check needed
  // here; the caller's own guard (mirroring the button's disabled
  // condition) decides whether to actually submit.
  onEnter?: () => void;
}

export function OtpInput({
  value,
  onChangeText,
  length = 6,
  error = false,
  disabled = false,
  autoFocus = false,
  onEnter,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  function updateDigit(index: number, text: string) {
    const cleaned = text.replace(/[^0-9]/g, "");

    if (cleaned.length > 1) {
      const merged = (value.slice(0, index) + cleaned).slice(0, length);
      onChangeText(merged);

      const nextIndex = Math.min(merged.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned;
    onChangeText(nextDigits.join("").slice(0, length));

    if (cleaned && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (key === "Enter") {
      onEnter?.();
    }
  }

  return (
    <div className="flex flex-row justify-center gap-2">
      {digits.map((digit, index) => {
        const state = error
          ? "error"
          : focusedIndex === index
            ? "focused"
            : "default";

        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={digit}
            onChange={(e) => updateDigit(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e.key)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() =>
              setFocusedIndex((prev) => (prev === index ? null : prev))
            }
            disabled={disabled}
            autoFocus={autoFocus && index === 0}
            inputMode="numeric"
            className={getInputFieldClasses({
              state,
              disabled,
              className: "w-12 text-xl font-semibold text-center",
            })}
          />
        );
      })}
    </div>
  );
}
