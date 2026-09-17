import type { ContentKey } from "./keys";

// Normal-mode strings. Every ContentKey must have a value here —
// TypeScript's Record<ContentKey, string> enforces that at compile
// time, so a key can never ship with only a Malayali-mode value.
export const en: Record<ContentKey, string> = {
  // Display order (Donation, Community, Share) is set by CARD_ORDER
  // in DashboardPromoCard.tsx, not by the order here — see keys.ts.
  // Cards show only a heading + button now (no body text), so the
  // .body keys below are unused placeholders — kept (rather than
  // removed from ContentKey) so a body line can come back later
  // without another type change. See DashboardPromoCard.tsx.
  "dashboard.promoCard.share.title": "Invite Friends",
  "dashboard.promoCard.share.body": "",
  "dashboard.promoCard.share.button": "Invite Friends",

  "dashboard.promoCard.community.title": "Join Community",
  "dashboard.promoCard.community.body": "",
  "dashboard.promoCard.community.button": "Join Now",

  "dashboard.promoCard.thirdSlot.title": "Support me",
  "dashboard.promoCard.thirdSlot.body": "",
  "dashboard.promoCard.thirdSlot.button": "Buy me a coffee",

  "donation.prompt.title": "Invoice marked as paid 🎉",
  "donation.prompt.body":
    "If Cashevide has been useful for your business, consider supporting its development with a small contribution.",
  "donation.prompt.declineButton": "Maybe later",
  "donation.prompt.acceptButton": "Sure, why not",

  "donation.options.title": "Choose an amount",
  // Plain, professional labels in normal mode — no food framing, no
  // avatar images (see DonationAmountOptionsModal for the image/no-image
  // branch).
  "donation.options.chaya.label": "Small",
  "donation.options.chayaParippuvada.label": "Standard",
  "donation.options.shawarma.label": "Generous",
  "donation.options.custom.label": "Custom amount",

  "donation.customAmount.title": "Enter an amount",
  "donation.customAmount.placeholder": "Amount",
  "donation.customAmount.continueButton": "Continue",

  "donation.payment.title.mobile": "Opening your UPI app…",
  "donation.payment.title.desktop": "Scan to pay",
  "donation.payment.backButton": "Back",
};
