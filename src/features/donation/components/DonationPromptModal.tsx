import { useContent } from "../../../content/useContent";
import { Modal } from "../../../components/ui/Modal";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";

type DonationPromptModalProps = {
  visible: boolean;
  onDecline: () => void;
  onAccept: () => void;
};

// Modal 1 of the donation flow — shown once, right after an invoice's
// status transitions to PAID (see InvoiceEditContent's handleSubmit).
// "Maybe later" just closes this modal; "Sure, why not" moves on to
// DonationAmountOptionsModal (Modal 2). Content here is plain English
// in both modes (see en.ts/malayali.ts) — Malayali Mode only changes
// the food framing of the fixed amounts in Modal 2, not the app's
// language — so nothing in this modal reads isMalayaliMode.
export function DonationPromptModal({
  visible,
  onDecline,
  onAccept,
}: DonationPromptModalProps) {
  const t = useContent();

  return (
    <Modal visible={visible} dismissible onDismiss={onDecline}>
      <div className="flex flex-col items-center gap-3 text-center">
        <Text variant="subheading">{t("donation.prompt.title")}</Text>
        <Text variant="body" className="text-muted-foreground">
          {t("donation.prompt.body")}
        </Text>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <Button
          variant="primary"
          title={t("donation.prompt.acceptButton")}
          fullWidth
          onClick={onAccept}
        />
        <Button
          variant="ghost"
          title={t("donation.prompt.declineButton")}
          fullWidth
          onClick={onDecline}
        />
      </div>
    </Modal>
  );
}
