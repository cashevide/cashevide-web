import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";

import { cn } from "../../utils/cn";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";

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
  className?: string;
}>;

// The header row always sits at desktop width, regardless of how
// narrow the page's own Container is below it — this is a deliberate,
// fixed choice (not something each screen configures), so there's no
// per-page value that needs to stay in sync with the Container below.
const HEADER_WIDTH_CLASS = "max-w-desktop";

export function ScreenHeader({
  title,
  showBackButton = false,
  onBackPress,
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
      <div className={cn("w-full mx-auto", HEADER_WIDTH_CLASS)}>
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
