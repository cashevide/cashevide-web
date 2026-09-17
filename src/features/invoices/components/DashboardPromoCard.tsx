import { useState } from "react";

import { useContent } from "../../../content/useContent";
import { useMalayaliModeStore } from "../../../stores/malayaliModeStore";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { SupportFlow } from "../../donation/components/SupportFlow";

// Public WhatsApp community invite link — same one shared from
// Settings/wherever else this community is promoted. Update here if
// the invite link ever changes; nothing else references it directly.
const WHATSAPP_COMMUNITY_LINK =
  "https://chat.whatsapp.com/CnulzmDp7YlC0yipL7eFUA";

// Three cards, always visible side-by-side (stacked on mobile) — no
// rotation/carousel, in this fixed display order (Donation first).
// Each card is icon + title + button only (no body text). "thirdSlot"
// is the donation card's content-key/CardId name (see keys.ts) — kept
// generic there since it started as an unused placeholder before
// being wired to SupportFlow here.
//
// Icons are the custom Illustrator SVGs in public/icons/ — full-color
// with their own background circle already baked in, so unlike an
// icon-font glyph they're rendered directly at full size rather than
// wrapped in a bg-secondary circle.
type CardId = "thirdSlot" | "community" | "share";

const CARD_ORDER: CardId[] = ["thirdSlot", "community", "share"];

const CARD_ICON_SRC: Record<CardId, string> = {
  thirdSlot: "/icons/promo-donation.svg",
  community: "/icons/promo-community.svg",
  share: "/icons/promo-share.svg",
};

export function DashboardPromoCard() {
  const t = useContent();
  const isMalayaliMode = useMalayaliModeStore((state) => state.isMalayaliMode);
  const [justCopied, setJustCopied] = useState(false);
  const [isSupportFlowOpen, setIsSupportFlowOpen] = useState(false);

  async function handleShare() {
    const shareData = {
      title: "Cashevide",
      text: "Check out Cashevide — invoicing and payment tracking for freelancers.",
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
    window.open(WHATSAPP_COMMUNITY_LINK, "_blank", "noopener,noreferrer");
  }

  const cardContent: Record<
    CardId,
    { title: string; button: string; onAction: () => void }
  > = {
    thirdSlot: {
      title: t("dashboard.promoCard.thirdSlot.title"),
      button: t("dashboard.promoCard.thirdSlot.button"),
      onAction: () => setIsSupportFlowOpen(true),
    },
    community: {
      title: t("dashboard.promoCard.community.title"),
      button: t("dashboard.promoCard.community.button"),
      onAction: handleJoinCommunity,
    },
    share: {
      title: t("dashboard.promoCard.share.title"),
      button: justCopied ? "Copied!" : t("dashboard.promoCard.share.button"),
      onAction: handleShare,
    },
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CARD_ORDER.map((cardId) => {
          const card = cardContent[cardId];

          return (
            <div
              key={cardId}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-5 text-center"
            >
              <img
                src={CARD_ICON_SRC[cardId]}
                alt=""
                className="h-14 w-14 mb-1"
              />

              <Text
                variant="body-lg"
                className="font-semibold"
                malayalam={isMalayaliMode}
              >
                {card.title}
              </Text>
              <div className="mt-2">
                <Button
                  variant="brand"
                  size="sm"
                  title={card.button}
                  onClick={card.onAction}
                  malayalam={isMalayaliMode}
                />
              </div>
            </div>
          );
        })}
      </div>

      <SupportFlow
        open={isSupportFlowOpen}
        onDone={() => setIsSupportFlowOpen(false)}
      />
    </>
  );
}
