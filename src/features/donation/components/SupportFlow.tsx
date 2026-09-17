import { useEffect, useState } from "react";

import { Modal } from "../../../components/ui/Modal";
import {
  DonationAmountOptionsModal,
  useDonationAmountOptionsTitle,
} from "./DonationAmountOptionsModal";
import {
  DonationCustomAmountModal,
  useDonationCustomAmountTitle,
} from "./DonationCustomAmountModal";
import {
  DonationPaymentModal,
  DONATION_PAYMENT_MODAL_CLASS,
  useDonationPaymentTitle,
} from "./DonationPaymentModal";

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
// Like DonationFlow, it follows the user's global Malayali Mode
// setting (no forceNormalMode) — the modals' own isMalayaliMode read
// from the store handles that.
//
//   options -> [customAmount ->] payment
// Dismissing/cancelling at "options" or "customAmount" ends the whole
// flow via onDone. The payment step is the one exception: its
// secondary action goes back to "options" instead of ending the flow
// (see handleBackFromPayment) — same behavior as DonationFlow.
//
// Like DonationFlow, this renders ONE shared <Modal> for the whole
// flow rather than one per step — see DonationFlow.tsx's comment for
// why (avoids overlapping backdrops during step changes, which used
// to cause a visible flash and, worse, dismiss clicks landing on the
// wrong step's backdrop).
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

  // Takes the user back to the amount-picker step instead of ending
  // the flow — unlike the dismiss handlers above, this doesn't call
  // onDone() since the flow is still open, just one step back.
  function handleBackFromPayment() {
    setPayment(null);
    setStep("options");
  }

  // See DonationFlow.tsx for why all step hooks run unconditionally
  // on every render (Rules of Hooks) rather than only for the current
  // step.
  const optionsTitle = useDonationAmountOptionsTitle();
  const customAmountTitle = useDonationCustomAmountTitle();
  const paymentTitle = useDonationPaymentTitle();

  const title =
    step === "options"
      ? optionsTitle
      : step === "customAmount"
        ? customAmountTitle
        : step === "payment"
          ? paymentTitle
          : undefined;

  const modalClassName =
    step === "options"
      ? "text-center"
      : step === "customAmount"
        ? "items-center text-center"
        : step === "payment"
          ? DONATION_PAYMENT_MODAL_CLASS
          : "";

  // See DonationFlow.tsx — backdrop dismiss means different things
  // per step; "payment" steps back to "options" instead of ending the
  // flow (matches its own Back button).
  const handleModalDismiss =
    step === "options"
      ? handleDismissOptions
      : step === "customAmount"
        ? handleDismissCustomAmount
        : step === "payment"
          ? handleBackFromPayment
          : undefined;

  return (
    <Modal
      visible={step !== "closed"}
      dismissible
      onDismiss={handleModalDismiss}
      title={title}
      className={modalClassName}
    >
      {step === "options" && (
        <DonationAmountOptionsModal onSelect={handleSelectOption} />
      )}

      {step === "customAmount" && (
        <DonationCustomAmountModal onContinue={handleContinueCustomAmount} />
      )}

      {step === "payment" && payment && (
        <DonationPaymentModal
          amount={payment.amount}
          staticQrImageUri={payment.staticQrImageUri}
          onBack={handleBackFromPayment}
        />
      )}
    </Modal>
  );
}
