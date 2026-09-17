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
