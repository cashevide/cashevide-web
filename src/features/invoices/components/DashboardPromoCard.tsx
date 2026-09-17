import { useState } from "react";
import type { ReactNode } from "react";
import { Share2, Sparkles } from "lucide-react";

import { useContent } from "../../../content/useContent";
import { useMalayaliModeStore } from "../../../stores/malayaliModeStore";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { WhatsAppIcon } from "../../../components/ui/WhatsAppIcon";

// Public WhatsApp community invite link — same one shared from
// Settings/wherever else this community is promoted. Update here if
// the invite link ever changes; nothing else references it directly.
const WHATSAPP_COMMUNITY_LINK =
  "https://chat.whatsapp.com/CnulzmDp7YlC0yipL7eFUA";

// Three cards, always visible side-by-side (stacked on mobile) — no
// rotation/carousel. Each card is (title key, body key, button key,
// icon, action). Adding a fourth is: add its 3 content keys to
// keys.ts + a value in both en.ts and malayali.ts, then add one entry
// to CARD_ORDER below and its icon to CARD_ICON — the grid picks it
// up automatically (Tailwind's md:grid-cols-3 stays correct for any
// count; only the visual balance would need a look if this grows
// past 3).
type CardId = "share" | "community" | "thirdSlot";

const CARD_ORDER: CardId[] = ["share", "community", "thirdSlot"];

export function DashboardPromoCard() {
  const t = useContent();
  const isMalayaliMode = useMalayaliModeStore((state) => state.isMalayaliMode);
  const [justCopied, setJustCopied] = useState(false);

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
    window.open(WHATSAPP_COMMUNITY_LINK, "_blank", "noopener,noreferrer");
  }

  // Placeholder — no real destination/functionality yet for this
  // slot. Wire it up to whatever this card ends up promoting once
  // that exists.
  function handleThirdSlotAction() {}

  const cardContent: Record<
    CardId,
    {
      title: string;
      body: string;
      button: string;
      icon: ReactNode;
      onAction: () => void;
    }
  > = {
    share: {
      title: t("dashboard.promoCard.share.title"),
      body: t("dashboard.promoCard.share.body"),
      button: justCopied ? "Copied!" : t("dashboard.promoCard.share.button"),
      icon: <Share2 size={28} className="text-foreground" />,
      onAction: handleShare,
    },
    community: {
      title: t("dashboard.promoCard.community.title"),
      body: t("dashboard.promoCard.community.body"),
      button: t("dashboard.promoCard.community.button"),
      icon: <WhatsAppIcon size={28} />,
      onAction: handleJoinCommunity,
    },
    thirdSlot: {
      title: t("dashboard.promoCard.thirdSlot.title"),
      body: t("dashboard.promoCard.thirdSlot.body"),
      button: t("dashboard.promoCard.thirdSlot.button"),
      icon: <Sparkles size={28} className="text-foreground" />,
      onAction: handleThirdSlotAction,
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {CARD_ORDER.map((cardId) => {
        const card = cardContent[cardId];

        return (
          <div
            key={cardId}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-5 text-center"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary mb-1">
              {card.icon}
            </div>

            <Text
              variant="body-lg"
              className="font-semibold"
              malayalam={isMalayaliMode}
            >
              {card.title}
            </Text>
            <Text
              variant="body-sm"
              className="text-muted-foreground"
              malayalam={isMalayaliMode}
            >
              {card.body}
            </Text>
            <div className="mt-2">
              <Button
                variant="primary"
                title={card.button}
                onClick={card.onAction}
                malayalam={isMalayaliMode}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
