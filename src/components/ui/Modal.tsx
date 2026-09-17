import {
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useState,
} from "react";

import { cn } from "../../utils/cn";
import { Text } from "./Text";

// Matches the --animate-overlay-out / --animate-modal-out duration in
// index.css. Kept as a plain constant (rather than reading it from
// CSS) since it only needs to roughly match — it just has to be long
// enough for the animation to finish before we unmount.
const CLOSE_ANIMATION_MS = 150;

type ModalProps = PropsWithChildren<{
  visible: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  title?: string;
  // Renders the title in Anek Malayalam instead of Geist — pass this
  // when `title` is Malayalam text (e.g. Malayali Mode copy), same
  // reasoning as Text's own `malayalam` prop, which this forwards to.
  titleMalayalam?: boolean;
  description?: ReactNode;
  footer?: ReactNode;
  className?: string;
}>;

export function Modal({
  visible,
  dismissible = true,
  onDismiss,
  title,
  titleMalayalam = false,
  description,
  footer,
  className = "",
  children,
}: ModalProps) {
  // Keeps the modal mounted for one extra tick after `visible` turns
  // false, so the exit animation gets a chance to play instead of the
  // modal disappearing instantly. `closing` drives which animation
  // class is applied.
  const [shouldRender, setShouldRender] = useState(visible);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setClosing(false);
      return;
    }

    if (!shouldRender) {
      return;
    }

    setClosing(true);
    const timeout = setTimeout(() => {
      setShouldRender(false);
      setClosing(false);
    }, CLOSE_ANIMATION_MS);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Locks background scroll while the modal is open, same as a native
  // modal blocking interaction with whatever's behind it.
  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  // Escape dismisses the modal, same as clicking the backdrop —
  // respects `dismissible` the same way. Bound on document (not the
  // modal's own div) since the modal itself doesn't hold DOM focus by
  // default, so a div-level listener would miss the keypress entirely
  // unless something inside happened to be focused.
  useEffect(() => {
    if (!shouldRender || !dismissible) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onDismiss?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shouldRender, dismissible, onDismiss]);

  if (!shouldRender) {
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
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-overlay/90 backdrop-blur-lg px-4",
        closing ? "animate-overlay-out" : "animate-overlay-in",
      )}
    >
      <div
        // stopPropagation here keeps a click anywhere inside the modal
        // (a button, an input, the card background) from bubbling up
        // to the backdrop's onClick above and dismissing the modal.
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-[450px] max-h-[80%] flex flex-col gap-6 rounded-lg bg-secondary border border-border p-6 shadow-lg",
          closing ? "animate-modal-out" : "animate-modal-in",
          className,
        )}
      >
        <div className="shrink overflow-y-auto flex flex-col gap-2">
          {hasHeader ? (
            <div className="flex flex-col gap-2">
              {title ? (
                <Text variant="subheading" malayalam={titleMalayalam}>
                  {title}
                </Text>
              ) : null}
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
