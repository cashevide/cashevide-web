import { useEffect, useState } from "react";

import { DonationAmountOptionsModal } from "./DonationAmountOptionsModal";
import { DonationCustomAmountModal } from "./DonationCustomAmountModal";
import { DonationPaymentModal } from "./DonationPaymentModal";

import type { DonationOption } from "../types/donationTypes";

type SupportStep = "closed" | "options" | "customAmount" | "payment";

type PaymentState = {
  amount: number;
  // Present for a fixed option (uses its pre-made static QR on
  // desktop); absent for a custom amount (generates a QR at runtime —
  // see DonationPaymentModal/useUpiQrCode).
  staticQrImageUri?: string;
};

type SupportFlowProps = {
  // Whether to start the flow at all. The caller (Settings' "Buy Me a
  // Coffee" row) flips this to true on click; internal step state is
  // self-contained from there.
  open: boolean;
  // Called once the whole flow is done (dismissed at any step, or
  // finished at the payment step) so the caller can close/reset its
  // own trigger state.
  onDone: () => void;
};

// Settings-triggered counterpart to DonationFlow (the invoice-paid
// flow). Reuses the same amount/custom-amount/payment modals, but
// differs in two ways that reflect it being a deliberate action
// rather than a post-payment nudge:
//   - No prompt step. DonationFlow opens with "Invoice marked as
//     paid — want to support us?" (an ask the user didn't initiate);
//     here the user already chose "Buy Me a Coffee" from Settings, so
//     that ask would be redundant. The flow starts straight at
//     "options".
//   - No opening delay. DonationFlow waits ~500ms before showing its
//     prompt so it doesn't appear the instant the invoice-paid
//     redirect lands. That reasoning doesn't apply to a direct
//     Settings tap — the modal opens immediately.
//   - forceNormalMode is passed to every modal, so this flow always
//     shows plain/professional copy and no food-item theming,
//     regardless of the user's global Malayali Mode setting.
//
//   options -> [customAmount ->] payment
export function SupportFlow({ open, onDone }: SupportFlowProps) {
  const [step, setStep] = useState<SupportStep>("closed");
  const [payment, setPayment] = useState<PaymentState | null>(null);

  // Opens straight to "options" the moment `open` flips true. Guarded
  // by `step === "closed"` so this only fires on the false->true
  // transition, not on every render while `open` stays true for the
  // rest of the flow.
  useEffect(() => {
    if (!open || step !== "closed") {
      return;
    }

    setStep("options");
  }, [open, step]);

  function handleDismissOptions() {
    setStep("closed");
    onDone();
  }

  function handleSelectOption(option: DonationOption) {
    if (option.kind === "custom") {
      setStep("customAmount");
      return;
    }

    setPayment({ amount: option.amount, staticQrImageUri: option.qrImageUri });
    setStep("payment");
  }

  function handleDismissCustomAmount() {
    setStep("closed");
    onDone();
  }

  function handleContinueCustomAmount(amount: number) {
    setPayment({ amount });
    setStep("payment");
  }

  function handleFinishPayment() {
    setStep("closed");
    setPayment(null);
    onDone();
  }

  return (
    <>
      <DonationAmountOptionsModal
        visible={step === "options"}
        onDismiss={handleDismissOptions}
        onSelect={handleSelectOption}
        forceNormalMode
      />

      <DonationCustomAmountModal
        visible={step === "customAmount"}
        onDismiss={handleDismissCustomAmount}
        onContinue={handleContinueCustomAmount}
        forceNormalMode
      />

      {payment && (
        <DonationPaymentModal
          visible={step === "payment"}
          amount={payment.amount}
          staticQrImageUri={payment.staticQrImageUri}
          onSent={handleFinishPayment}
          onCancel={handleFinishPayment}
          forceNormalMode
        />
      )}
    </>
  );
}
