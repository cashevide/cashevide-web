import { Text } from "./Text";

interface ToastProps {
  message: string;
  visible: boolean;
}

// Fixed banner pinned to the bottom of the viewport, above any open
// Modal (z-[60], Modal itself is z-50) — so it stays visible even if
// the person dismisses a dialog right after triggering it. Purely
// presentational: the caller owns the visible state and its timing
// (e.g. a setTimeout to auto-hide), this component just renders the
// message when told to.
//
// Text's body-sm variant carries its own text-foreground by default;
// text-background is passed as part of Text's own className (not
// just on this wrapper) since Text applies VARIANT_CLASS before
// className, so tailwind-merge lets this win and override it —
// otherwise the text would blend into its own bg-foreground pill.
export function Toast({ message, visible }: ToastProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <div className="rounded-full bg-foreground px-4 py-2 shadow-lg">
        <Text variant="body-sm" className="font-medium text-background">
          {message}
        </Text>
      </div>
    </div>
  );
}
