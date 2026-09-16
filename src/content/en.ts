import type { ContentKey } from "./keys";

// Normal-mode strings. Every ContentKey must have a value here —
// TypeScript's Record<ContentKey, string> enforces that at compile
// time, so a key can never ship with only a Malayali-mode value.
export const en: Record<ContentKey, string> = {
  "dashboard.promoCard.share.title": "Enjoying Cashevide?",
  "dashboard.promoCard.share.body": "Share it with a friend who could use it.",
  "dashboard.promoCard.share.button": "Share App",

  "dashboard.promoCard.community.title": "Join Our Community",
  "dashboard.promoCard.community.body":
    "Connect with other freelancers using Cashevide.",
  "dashboard.promoCard.community.button": "Join Now",
};
