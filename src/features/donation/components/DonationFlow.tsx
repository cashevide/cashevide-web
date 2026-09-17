import { useEffect, useState } from "react";

import { Modal } from "../../../components/ui/Modal";
import { DonationPromptModal } from "./DonationPromptModal";
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

type DonationStep =
  | "closed"
  | "prompt"
  | "options"
  | "customAmount"
  | "payment";

type PaymentState = {
  amount: number;
  // Present for a fixed option (uses its pre-made static QR on
  // desktop); absent for a custom amount (generates a QR at runtime —
  // see DonationPaymentModal/useUpiQrCode).
  staticQrImageUri?: string;
};

type DonationFlowProps = {
  // Whether to start the flow at all. The caller (InvoiceEditContent)
  // renders this component only right after an invoice transitions to
  // PAID; `open` is that one-shot trigger. Internal step state is
  // self-contained from there.
  open: boolean;
  // Called once the whole flow is done (declined at the prompt,
  // dismissed at any step, or finished at the payment step) so the
  // caller can proceed with whatever it was going to do next (e.g.
  // navigate to the invoice detail page).
  onDone: () => void;
};

// Orchestrates the 4-step donation flow shown after an invoice is
// marked PAID:
//   prompt -> options -> [customAmount ->] payment -> (done)
// Each step's CONTENT is its own component (DonationPromptModal etc.)
// but they no longer own a <Modal> each — this component renders ONE
// shared <Modal> for the whole flow and swaps out its title/className/
// children as `step` changes. That's deliberate: with 4 independent
// Modals, a step change (one closing, the next opening) meant two
// separate backdrops briefly overlapping in the DOM, which caused two
// bugs — a visible flash/double-blur as one backdrop faded out while
// the other faded in, and a worse one where a click meant to dismiss
// the (visually topmost) new step's backdrop could actually land on
// the previous step's still-present backdrop underneath and fire ITS
// dismiss handler instead. A single persistent Modal has only one
// backdrop, ever, so neither problem can occur — the backdrop simply
// stays put across step changes and only the dialog's content swaps.
export function DonationFlow({ open, onDone }: DonationFlowProps) {
  const [step, setStep] = useState<DonationStep>("closed");
  const [payment, setPayment] = useState<PaymentState | null>(null);

  // Opens the flow ~half a second after `open` flips true, rather than
  // instantly on landing — gives the invoice detail page a moment to
  // settle first instead of the prompt appearing the instant the
  // redirect lands. Only fires on the false->true transition (guarded
  // by `step === "closed"`) — once the flow is running, this effect
  // stays quiet even though `open` remains true for the rest of it.
  useEffect(() => {
    if (!open || step !== "closed") {
      return;
    }

    const timeoutId = setTimeout(() => {
      setStep("prompt");
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [open, step]);

  function handleDeclinePrompt() {
    setStep("closed");
    onDone();
  }

  function handleAcceptPrompt() {
    setStep("options");
  }

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

  // Each step's Modal title is computed via that step's own hook (see
  // e.g. useDonationAmountOptionsTitle) rather than duplicated here,
  // so the title text can't drift out of sync with its component.
  // Hooks can't be called conditionally, so all four run on every
  // render regardless of the current step — cheap (just translation
  // lookups plus one media query) and how the Rules of Hooks require
  // it anyway.
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

  // Backdrop click / Escape (Modal's own dismiss) means different
  // things per step — "prompt"/"options"/"customAmount" end the whole
  // flow (same as their explicit decline/dismiss buttons), but
  // "payment" only steps back to "options" (see handleBackFromPayment
  // — same as its own Back button, never a flow-ending dismiss).
  const handleModalDismiss =
    step === "prompt"
      ? handleDeclinePrompt
      : step === "options"
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
      {step === "prompt" && (
        <DonationPromptModal
          onDecline={handleDeclinePrompt}
          onAccept={handleAcceptPrompt}
        />
      )}

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
