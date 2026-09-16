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
};
