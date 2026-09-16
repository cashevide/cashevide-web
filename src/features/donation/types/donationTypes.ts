// One tappable option in the amount-picker modal (Modal 2). "custom"
// has no amount/qrImage — it opens the amount-entry step instead of
// going straight to the payment modal (see DonationAmountModal).
export type DonationOption =
  | {
      kind: "fixed";
      id: string;
      amount: number;
      // Malayali Mode only — plain-list normal mode has no avatar.
      imageUri?: string;
      // Static, pre-generated QR (desktop) for this exact amount —
      // avoids generating a QR at runtime for the 3 fixed amounts.
      qrImageUri: string;
    }
  | {
      kind: "custom";
      id: "custom";
    };
