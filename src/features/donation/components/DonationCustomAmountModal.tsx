import { useState } from "react";

import { useContent } from "../../../content/useContent";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

type DonationCustomAmountModalProps = {
  onContinue: (amount: number) => void;
  // See DonationAmountOptionsModal — when true, ignores the global
  // Malayali Mode toggle so this modal always shows plain/
  // professional copy. Used by SupportFlow; omit (or pass false)
  // for the normal store-driven behavior used by DonationFlow.
  forceNormalMode?: boolean;
};

// This step's Modal title — see DonationAmountOptionsModal's
// useDonationAmountOptionsTitle for why this lives alongside the
// component as a hook rather than being duplicated at the call site.
export function useDonationCustomAmountTitle(forceNormalMode = false) {
  const t = useContent(forceNormalMode);
  return t("donation.customAmount.title");
}

// Shown between Modal 2 (picking "custom") and Modal 3 (payment) —
// just collects a positive rupee amount, then hands it to the caller
// to open DonationPaymentModal with. Whole rupees only, matching the
// fixed amounts (15/25/100) and UPI's "am" param, which the pre-made
// QR SVGs also use as plain integers.
//
// Renders CONTENT ONLY — see DonationPromptModal.tsx for why (no
// <Modal> wrapper of its own; DonationFlow owns one shared <Modal>
// for the whole flow). No onDismiss prop here: this component
// unmounts whenever the flow moves off this step (dismiss included),
// which resets amountInput for free via a fresh useState("") on next
// mount — there's nothing left to clean up on dismiss specifically.
export function DonationCustomAmountModal({
  onContinue,
  forceNormalMode = false,
}: DonationCustomAmountModalProps) {
  const t = useContent(forceNormalMode);
  const [amountInput, setAmountInput] = useState("");

  const parsedAmount = parseInt(amountInput, 10);
  const isValidAmount = !Number.isNaN(parsedAmount) && parsedAmount > 0;

  function handleContinue() {
    if (!isValidAmount) {
      return;
    }
    onContinue(parsedAmount);
    setAmountInput("");
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full mt-3">
      <Input
        type="number"
        inputMode="numeric"
        min={1}
        step={1}
        placeholder={t("donation.customAmount.placeholder")}
        value={amountInput}
        onChange={(e) => setAmountInput(e.target.value)}
        // Hides the native up/down spinner arrows — with them
        // visible people tend to just tap-tap-tap to ₹1 or ₹2
        // instead of typing a real amount (see index.css for the
        // actual rule; className here only reaches Input's outer
        // wrapper, not the <input> itself).
        className="text-center"
        autoFocus
      />

      <Button
        variant="primary"
        title={t("donation.customAmount.continueButton")}
        fullWidth
        disabled={!isValidAmount}
        onClick={handleContinue}
      />
    </div>
  );
}
