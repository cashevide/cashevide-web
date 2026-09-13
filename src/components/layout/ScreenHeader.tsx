import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

import { cn } from "../../utils/cn";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";

type ContainerVariant = "narrow" | "desktop" | "full";

const VARIANT_CLASS: Record<ContainerVariant, string> = {
  narrow: "max-w-narrow",
  desktop: "max-w-desktop",
  full: "w-full",
};

type ScreenHeaderProps = PropsWithChildren<{
  // Simple case — most screens just need a title. For anything more
  // (a logo + credit-points button, a search field, tabs, etc.) pass
  // `children` instead; when children is given, `title` is ignored
  // and the caller is fully responsible for the row's content.
  title?: string;
  showBackButton?: boolean;
  // Screens decide this themselves rather than the header guessing
  // from navigation state — a tab's own root page never wants one,
  // while a page pushed on top of it always does.
  onBackPress?: () => void;
  // Must match the Container `variant` used below this header on the
  // same page (narrow/desktop/full) — keeps the header row's content
  // aligned to the same max-width + centered column, instead of
  // stretching edge-to-edge while the page content below sits centered.
  containerVariant?: ContainerVariant;
  className?: string;
}>;

export function ScreenHeader({
  title,
  showBackButton = false,
  onBackPress,
  containerVariant = "full",
  className = "",
  children,
}: ScreenHeaderProps) {
  const navigate = useNavigate();

  function handleBackPress() {
    if (onBackPress) {
      onBackPress();
      return;
    }

    navigate(-1);
  }

  return (
    <div className={cn("w-full bg-background", className)}>
      <div className={cn("w-full mx-auto", VARIANT_CLASS[containerVariant])}>
        <div className="h-20 flex flex-row items-center gap-3 px-6">
          {showBackButton ? (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              icon={<ChevronLeft size={18} />}
              onClick={handleBackPress}
              aria-label="Go back"
            />
          ) : null}

          {children ? (
            <div className="flex-1">{children}</div>
          ) : title ? (
            <Text variant="body-lg" className="flex-1 font-semibold text-2xl">
              {title}
            </Text>
          ) : null}
        </div>
      </div>
    </div>
  );
}
