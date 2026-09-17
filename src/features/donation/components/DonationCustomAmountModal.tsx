import { useState } from "react";

import { useContent } from "../../../content/useContent";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

type DonationCustomAmountModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onContinue: (amount: number) => void;
  // See DonationAmountOptionsModal — when true, ignores the global
  // Malayali Mode toggle so this modal always shows plain/
  // professional copy. Used by SupportFlow; omit (or pass false)
  // for the normal store-driven behavior used by DonationFlow.
  forceNormalMode?: boolean;
};

// Shown between Modal 2 (picking "custom") and Modal 3 (payment) —
// just collects a positive rupee amount, then hands it to the caller
// to open DonationPaymentModal with. Whole rupees only, matching the
// fixed amounts (15/25/100) and UPI's "am" param, which the pre-made
// QR SVGs also use as plain integers.
export function DonationCustomAmountModal({
  visible,
  onDismiss,
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

  function handleDismiss() {
    setAmountInput("");
    onDismiss();
  }

  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={handleDismiss}
      title={t("donation.customAmount.title")}
      className="items-center text-center"
    >
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
    </Modal>
  );
}
