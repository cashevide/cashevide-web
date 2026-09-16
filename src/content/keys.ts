// Every string shown through the content system has a key here first.
// Adding a new piece of content is always: add the key here, then add
// its value to BOTH en.ts and malayali.ts — TypeScript enforces the
// second part (Record<ContentKey, string> rejects a missing key in
// either file), so a key can never go live with only one language
// filled in.
//
// Keys are dot-namespaced by feature/screen, e.g.
// "dashboard.shareCard.title" — this keeps large groups of related
// strings (a whole screen's worth) easy to find and keeps two
// unrelated features from accidentally colliding on the same key.
export type ContentKey =
  // Dashboard — rotating promo card, shown in both modes. Content
  // differs by mode (professional in normal mode, meme-style in
  // Malayali Mode); which slides exist and rotate is the same in
  // both — see DashboardPromoCard.tsx.
  | "dashboard.promoCard.share.title"
  | "dashboard.promoCard.share.body"
  | "dashboard.promoCard.share.button"
  | "dashboard.promoCard.community.title"
  | "dashboard.promoCard.community.body"
  | "dashboard.promoCard.community.button";
