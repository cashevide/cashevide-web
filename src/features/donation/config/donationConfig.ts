import type { DonationOption } from "../types/donationTypes";

// Cashevide's own receiving UPI ID — this is a donation *to* Cashevide,
// not a per-business/per-user field, so it's fixed here rather than
// pulled from any business profile or settings.
export const DONATION_UPI_ID = "9746469319@yescred";
export const DONATION_PAYEE_NAME = "Noufal";

// Same 3 amounts in both modes — only the label/image differ (see
// DonationAmountOptionsModal). Order here is the display order.
export const DONATION_FIXED_OPTIONS: DonationOption[] = [
  {
    kind: "fixed",
    id: "chaya",
    amount: 15,
    imageUri: "/images/chaya-paisa/chaya.jpg",
    qrImageUri: "/images/payment-qr/qr-code-15.svg",
  },
  {
    kind: "fixed",
    id: "chaya-parippuvada",
    amount: 25,
    imageUri: "/images/chaya-paisa/chaya-parippuvada.jpg",
    qrImageUri: "/images/payment-qr/qr-code-25.svg",
  },
  {
    kind: "fixed",
    id: "shawarma",
    amount: 100,
    imageUri: "/images/chaya-paisa/shawarma.jpg",
    qrImageUri: "/images/payment-qr/qr-code-100.svg",
  },
];

export const DONATION_CUSTOM_OPTION: DonationOption = { kind: "custom", id: "custom" };

export const DONATION_OPTIONS: DonationOption[] = [
  ...DONATION_FIXED_OPTIONS,
  DONATION_CUSTOM_OPTION,
];

// Builds the UPI deep link / QR payload for a given amount. Same shape
// as the static QR SVGs (pa/pn/am/cu) so a custom amount produces a
// link identical in structure to the pre-generated ones.
export function buildUpiLink(amount: number): string {
  const params = new URLSearchParams({
    pa: DONATION_UPI_ID,
    pn: DONATION_PAYEE_NAME,
    am: String(amount),
    cu: "INR",
  });
  return `upi://pay?${params.toString()}`;
}
