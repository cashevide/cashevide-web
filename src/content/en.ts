import type { ContentKey } from "./keys";

// Normal-mode strings. Every ContentKey must have a value here —
// TypeScript's Record<ContentKey, string> enforces that at compile
// time, so a key can never ship with only a Malayali-mode value.
export const en: Record<ContentKey, string> = {
  "dashboard.promoCard.share.title": "Enjoying Cashevide?",
  "dashboard.promoCard.share.body": "Share it with a friend who could use it.",
  "dashboard.promoCard.share.button": "Share App",

  "dashboard.promoCard.community.title": "Join Our WhatsApp Community",
  "dashboard.promoCard.community.body":
    "Connect with other freelancers using Cashevide.",
  "dashboard.promoCard.community.button": "Join Now",

  "dashboard.promoCard.thirdSlot.title": "Coming Soon",
  "dashboard.promoCard.thirdSlot.body":
    "We're working on something new for you.",
  "dashboard.promoCard.thirdSlot.button": "Learn More",

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
  "donation.payment.sentButton": "Sent",
  "donation.payment.cancelButton": "Cancel",
};
