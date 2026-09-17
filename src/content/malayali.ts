import type { ContentKey } from "./keys";

// Malayali Mode strings — same keys as en.ts, TypeScript enforces
// completeness (Record<ContentKey, string> rejects a missing key).
export const malayali: Record<ContentKey, string> = {
  "dashboard.promoCard.share.title": "എല്ലാവരും",
  "dashboard.promoCard.share.body": "app share ചെയ്ത് സഹായിക്ക് മക്കളേ 🙏",
  "dashboard.promoCard.share.button": "Share ചെയ്യ്",

  "dashboard.promoCard.community.title": "വാ മക്കളേ",
  "dashboard.promoCard.community.body":
    "കൂട്ടത്തിൽ കൂടിക്കോ, തനിച്ച് നിക്കണ്ട 😎",
  "dashboard.promoCard.community.button": "Join ചെയ്യ്",

  "dashboard.promoCard.thirdSlot.title": "വരുന്നുണ്ട് മക്കളേ",
  "dashboard.promoCard.thirdSlot.body": "എന്തോ ഒരു സാധനം ഉണ്ടാക്കുന്നുണ്ട് 😏",
  "dashboard.promoCard.thirdSlot.button": "കാത്തിരിക്ക്",

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
