import { useState } from "react";

import { useContent } from "../../../content/useContent";
import { useMalayaliModeStore } from "../../../stores/malayaliModeStore";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

type DonationCustomAmountModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onContinue: (amount: number) => void;
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
}: DonationCustomAmountModalProps) {
  const t = useContent();
  const isMalayaliMode = useMalayaliModeStore((state) => state.isMalayaliMode);
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
      className="items-center"
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          placeholder={t("donation.customAmount.placeholder")}
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          className="text-center"
          autoFocus
        />

        <Button
          variant="primary"
          title={t("donation.customAmount.continueButton")}
          malayalam={isMalayaliMode}
          fullWidth
          disabled={!isValidAmount}
          onClick={handleContinue}
        />
      </div>
    </Modal>
  );
}
