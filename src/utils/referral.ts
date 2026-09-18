import { ROUTES } from "../lib/routes";

// Shared with CreditPointsDialog's invite flow and DashboardPromoCard's
// share flow — both point recipients at the same referral signup link,
// so the URL-building logic lives here once rather than being
// duplicated (and risking drift) in each caller.
//
// Falls back to the bare origin when there's no referral code yet
// (e.g. userProfile is still loading, or the signed-in user simply
// has none) — callers still get a shareable link, just without the
// ?referral= param that auto-applies a code on the recipient's signup.
export function buildReferralLink(referralCode?: string): string {
  if (!referralCode) {
    return window.location.origin;
  }

  return `${window.location.origin}${ROUTES.welcome}?referral=${encodeURIComponent(referralCode)}`;
}

// Same wording wherever a user shares or copies their referral link
// (CreditPointsDialog's "Invite Friends" button, DashboardPromoCard's
// "Share" card) — defined once here so the two callers can't drift
// apart the way they did before this was centralized.
export const REFERRAL_SHARE_TITLE = "Join Cashevide";
export const REFERRAL_SHARE_TEXT =
  "Generate unlimited invoices for free and manage all your clients and catalog in one place.";

// For the clipboard fallback (used when navigator.share is
// unavailable, e.g. desktop Chromium, or when it's called but the
// page isn't in a secure context). Native share sheets get title and
// text as separate fields and lay them out themselves, but a plain
// clipboard paste needs them combined into one string — title and
// text on their own lines, with the link set apart by blank lines
// above and below so it's easy to spot and doesn't run into the
// sentence before it.
export function buildReferralClipboardText(link: string): string {
  return `${REFERRAL_SHARE_TITLE}\n\n${REFERRAL_SHARE_TEXT}\n\n${link}`;
}
