import { useState } from "react";

import { useContent } from "../../../content/useContent";
import { useMalayaliModeStore } from "../../../stores/malayaliModeStore";
import { useUserProfile } from "../../profile/hooks/useUserProfile";
import { buildReferralLink } from "../../../utils/referral";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Toast } from "../../../components/ui/Toast";
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
  // TanStack Query dedupes by query key, so this doesn't cost an extra
  // request when CreditPointsWidget (or anything else) already has
  // userProfile mounted on the same screen — see that widget's own
  // comment for why the fetch lives at each call site rather than
  // being threaded through props.
  const userProfile = useUserProfile();
  const [justCopied, setJustCopied] = useState(false);
  const [isSupportFlowOpen, setIsSupportFlowOpen] = useState(false);

  async function handleShare() {
    // Same referral-link builder CreditPointsDialog's invite flow
    // uses — falls back to the bare origin if referral_code isn't
    // loaded yet, so the button still shares something useful rather
    // than waiting on the profile fetch.
    const shareUrl = buildReferralLink(userProfile.data?.referral_code);

    const shareData = {
      title: "Cashevide",
      text: "Check out Cashevide — invoicing and payment tracking for freelancers.",
      url: shareUrl,
    };

    // "share" in navigator is the feature-detection check (rather than
    // always calling it and catching the failure), since calling an
    // undefined method throws a TypeError, not the "not supported"
    // rejection this catch block is written for. Same pattern as
    // CreditPointsDialog's handleInviteFriends.
    if ("share" in navigator) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // AbortError when the user cancels the native share sheet, or
        // the browser rejected the call — fall through to clipboard
        // copy either way rather than leaving the button appear to do
        // nothing.
      }
    }

    // navigator.clipboard only exists in a secure context — HTTPS, or
    // localhost during dev. A dev server reached over its network IP
    // (e.g. http://192.168.x.x:5173, for testing on another device) is
    // NOT secure, so navigator.clipboard is undefined there and calling
    // .writeText() on it throws. document.execCommand("copy") is
    // deprecated but still works in that case, so it's the fallback
    // rather than leaving the button silently do nothing.
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      // Off-screen but still focusable/selectable — execCommand needs
      // a real text selection to copy from.
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

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

      {/* Confirms the clipboard-copy fallback path (desktop browsers
          without Web Share support, e.g. Chrome on Linux or Firefox).
          Same pattern as CreditPointsDialog's invite flow — the
          button's own "Copied!" label is easy to miss since it's one
          of three small buttons in a row. */}
      <Toast message="Link Copied!" visible={justCopied} />
    </>
  );
}
