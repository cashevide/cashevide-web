import { type PropsWithChildren, type ReactNode, useEffect } from "react";

import { cn } from "../../utils/cn";
import { Text } from "./Text";

type ModalProps = PropsWithChildren<{
  visible: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  title?: string;
  description?: ReactNode;
  footer?: ReactNode;
  className?: string;
}>;

export function Modal({
  visible,
  dismissible = true,
  onDismiss,
  title,
  description,
  footer,
  className = "",
  children,
}: ModalProps) {
  // Locks background scroll while the modal is open, same as a native
  // modal blocking interaction with whatever's behind it.
  useEffect(() => {
    if (!visible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  function handleBackdropClick() {
    if (dismissible) {
      onDismiss?.();
    }
  }

  const hasHeader = title || description;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/90 backdrop-blur-lg px-4"
    >
      <div
        // stopPropagation here keeps a click anywhere inside the modal
        // (a button, an input, the card background) from bubbling up
        // to the backdrop's onClick above and dismissing the modal.
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-[450px] max-h-[80%] flex flex-col gap-6 rounded-lg bg-secondary border border-border p-6 shadow-lg",
          className,
        )}
      >
        <div className="shrink overflow-y-auto flex flex-col gap-2">
          {hasHeader ? (
            <div className="flex flex-col gap-2">
              {title ? <Text variant="subheading">{title}</Text> : null}
              {description ? (
                typeof description === "string" ? (
                  <Text variant="body-sm">{description}</Text>
                ) : (
                  description
                )
              ) : null}
            </div>
          ) : null}

          {children}
        </div>

        {footer ? <div>{footer}</div> : null}
      </div>
    </div>
  );
}
