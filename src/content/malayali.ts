import type { ContentKey } from "./keys";

// Malayali Mode strings — same keys as en.ts, TypeScript enforces
// completeness (Record<ContentKey, string> rejects a missing key).
export const malayali: Record<ContentKey, string> = {
  "dashboard.promoCard.share.title": "Invite Friends",
  "dashboard.promoCard.share.body": "",
  "dashboard.promoCard.share.button": "Invite Friends",

  "dashboard.promoCard.community.title": "Join Community",
  "dashboard.promoCard.community.body": "",
  "dashboard.promoCard.community.button": "Join Now",

  "dashboard.promoCard.thirdSlot.title": "Support me",
  "dashboard.promoCard.thirdSlot.body": "",
  "dashboard.promoCard.thirdSlot.button": "Buy me a chaya",

  "donation.prompt.title": "Invoice marked as paid 🎉",
  "donation.prompt.body":
    "If Cashevide has been useful for your business, consider supporting its development with a small contribution.",
  "donation.prompt.declineButton": "Maybe later",
  "donation.prompt.acceptButton": "Sure, why not",

  "donation.options.title": "Choose an amount",
  // Food names stay Malayalam — this is the one place Malayali Mode
  // is actually about (chaya/parippuvada/shawarma framing for the
  // fixed amounts). Every other string in this file is UI chrome
  // (titles, buttons, placeholders), not the "mode", so it stays
  // English — Malayali Mode is a vibe for the donation options, not
  // an app language switch.
  "donation.options.chaya.label": "ചായ",
  "donation.options.chayaParippuvada.label": "ചായ + പരിപ്പുവട",
  "donation.options.shawarma.label": "ഷവർമ",
  "donation.options.custom.label": "Custom amount",

  "donation.customAmount.title": "Enter an amount",
  "donation.customAmount.placeholder": "Amount",
  "donation.customAmount.continueButton": "Continue",

  "donation.payment.title.mobile": "Opening your UPI app…",
  "donation.payment.title.desktop": "Scan to pay",
  "donation.payment.sentButton": "Sent",
  "donation.payment.backButton": "Back",
};
