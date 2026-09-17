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
  // Dashboard — three promo cards shown side-by-side (stacked on
  // mobile). Content differs by mode (professional in normal mode,
  // meme-style in Malayali Mode) — see DashboardPromoCard.tsx.
  | "dashboard.promoCard.share.title"
  | "dashboard.promoCard.share.body"
  | "dashboard.promoCard.share.button"
  | "dashboard.promoCard.community.title"
  | "dashboard.promoCard.community.body"
  | "dashboard.promoCard.community.button"
  | "dashboard.promoCard.thirdSlot.title"
  | "dashboard.promoCard.thirdSlot.body"
  | "dashboard.promoCard.thirdSlot.button"

  // Donation flow — shown right after an invoice is marked PAID.
  // Modal 1: initial prompt. Content differs by mode (playful/personal
  // in Malayali Mode, professional in normal mode) — see
  // DonationPromptModal.tsx.
  | "donation.prompt.title"
  | "donation.prompt.body"
  | "donation.prompt.declineButton"
  | "donation.prompt.acceptButton"

  // Modal 2: amount picker. Item labels only exist in Malayali Mode
  // (normal mode shows plain amounts with no food framing) — see
  // DonationAmountOptionsModal.tsx.
  | "donation.options.title"
  | "donation.options.chaya.label"
  | "donation.options.chayaParippuvada.label"
  | "donation.options.shawarma.label"
  | "donation.options.custom.label"

  // Custom-amount entry step, shown before Modal 3 when "custom" is
  // picked in Modal 2.
  | "donation.customAmount.title"
  | "donation.customAmount.placeholder"
  | "donation.customAmount.continueButton"

  // Modal 3: the actual payment step (deep link on mobile, QR on
  // desktop) — see DonationPaymentModal.tsx.
  | "donation.payment.title.mobile"
  | "donation.payment.title.desktop"
  | "donation.payment.sentButton"
  | "donation.payment.cancelButton";
