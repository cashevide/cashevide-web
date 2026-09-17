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

  "donation.prompt.title": "പൈസ കിട്ടി അല്ലേ! 🎉",
  "donation.prompt.body":
    "നീ കുറേ നേടുന്നുണ്ടല്ലോ... ഒരു ചായക്കാശ് എങ്കിലും താടാ 😏",
  "donation.prompt.declineButton": "പിന്നെ തരാം",
  "donation.prompt.acceptButton": "പിന്നെന്താ തരാലോ",

  "donation.options.title": "എത്ര താടാ?",
  "donation.options.chaya.label": "ചായ",
  "donation.options.chayaParippuvada.label": "ചായ + പരിപ്പുവട",
  "donation.options.shawarma.label": "ഷവർമ",
  "donation.options.custom.label": "നിനക്ക് ഇഷ്ടമുള്ളത്",

  "donation.customAmount.title": "എത്ര രൂപ?",
  "donation.customAmount.placeholder": "തുക",
  "donation.customAmount.continueButton": "മുന്നോട്ട്",

  "donation.payment.title.mobile": "UPI app open ആകുന്നു…",
  "donation.payment.title.desktop": "QR scan ചെയ്ത് pay ചെയ്യ്",
  "donation.payment.sentButton": "അയച്ചു",
  "donation.payment.cancelButton": "വേണ്ട",
};
