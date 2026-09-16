import { useEffect, useState } from "react";

import { useContent } from "../../../content/useContent";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";

const ROTATE_INTERVAL_MS = 5000;

// Each slide is (title key, body key, button key, action). Adding a
// new slide is: add its 3 keys to keys.ts + a value in both en.ts and
// malayali.ts, then add one entry here — the rotation and dot
// indicators pick it up automatically, nothing else to wire.
type SlideId = "share" | "community";

const SLIDE_ORDER: SlideId[] = ["share", "community"];

export function DashboardPromoCard() {
  const t = useContent();
  const [slideIndex, setSlideIndex] = useState(0);
  const [justCopied, setJustCopied] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDE_ORDER.length);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  const currentSlide = SLIDE_ORDER[slideIndex];

  async function handleShare() {
    const shareData = {
      title: "Cashevide",
      text: t("dashboard.promoCard.share.body"),
      url: window.location.origin,
    };

    // navigator.share isn't available in every browser/context (e.g.
    // desktop Chrome without HTTPS, or older browsers) — clipboard copy
    // is the fallback so the button still does something useful there.
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // AbortError when the user cancels the native share sheet —
        // not a real failure, nothing to do.
      }
      return;
    }

    await navigator.clipboard.writeText(shareData.url);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 2000);
  }

  function handleJoinCommunity() {
    // Placeholder — no real community link yet. Wire this up to the
    // actual WhatsApp/Telegram/Discord invite URL once one exists.
  }

  const slideContent =
    currentSlide === "share"
      ? {
          title: t("dashboard.promoCard.share.title"),
          body: t("dashboard.promoCard.share.body"),
          button: justCopied
            ? "Copied!"
            : t("dashboard.promoCard.share.button"),
          onAction: handleShare,
        }
      : {
          title: t("dashboard.promoCard.community.title"),
          body: t("dashboard.promoCard.community.body"),
          button: t("dashboard.promoCard.community.button"),
          onAction: handleJoinCommunity,
        };

  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-5 text-center">
      <Text variant="body-lg" className="font-semibold">
        {slideContent.title}
      </Text>
      <Text variant="body-sm" className="text-muted-foreground">
        {slideContent.body}
      </Text>
      <div className="mt-2">
        <Button
          variant="primary"
          title={slideContent.button}
          onClick={slideContent.onAction}
        />
      </div>

      {/* Dot indicators — purely visual, not clickable. The rotation
          is time-based only; jumping to a specific slide isn't a
          need this card has right now. */}
      <div className="flex flex-row gap-1.5 mt-1">
        {SLIDE_ORDER.map((slide, index) => (
          <div
            key={slide}
            className={
              index === slideIndex
                ? "h-1.5 w-4 rounded-full bg-primary"
                : "h-1.5 w-1.5 rounded-full bg-muted"
            }
          />
        ))}
      </div>
    </div>
  );
}
