import { useEffect, useState } from "react";

import { DonationPromptModal } from "./DonationPromptModal";
import { DonationAmountOptionsModal } from "./DonationAmountOptionsModal";
import { DonationCustomAmountModal } from "./DonationCustomAmountModal";
import { DonationPaymentModal } from "./DonationPaymentModal";

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
// Each step is its own modal component; this just tracks which one is
// visible and the amount carried from "options"/"customAmount" into
// "payment". Dismissing or cancelling at the prompt/options/
// customAmount steps ends the whole flow via onDone, same as
// finishing at payment — there's no partial/resume state there. The
// payment step is the one exception: its secondary action goes back
// to "options" instead of ending the flow (see handleBackFromPayment).
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

  function handleFinishPayment() {
    setStep("closed");
    setPayment(null);
    onDone();
  }

  // Takes the user back to the amount-picker step instead of ending
  // the flow — unlike handleFinishPayment, this doesn't call onDone()
  // since the flow is still open, just one step back.
  function handleBackFromPayment() {
    setPayment(null);
    setStep("options");
  }

  return (
    <>
      <DonationPromptModal
        visible={step === "prompt"}
        onDecline={handleDeclinePrompt}
        onAccept={handleAcceptPrompt}
      />

      <DonationAmountOptionsModal
        visible={step === "options"}
        onDismiss={handleDismissOptions}
        onSelect={handleSelectOption}
      />

      <DonationCustomAmountModal
        visible={step === "customAmount"}
        onDismiss={handleDismissCustomAmount}
        onContinue={handleContinueCustomAmount}
      />

      {payment && (
        <DonationPaymentModal
          visible={step === "payment"}
          amount={payment.amount}
          staticQrImageUri={payment.staticQrImageUri}
          onSent={handleFinishPayment}
          onBack={handleBackFromPayment}
        />
      )}
    </>
  );
}
