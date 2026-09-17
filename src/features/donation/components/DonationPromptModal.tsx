import { useContent } from "../../../content/useContent";
import { useMalayaliModeStore } from "../../../stores/malayaliModeStore";
import { Modal } from "../../../components/ui/Modal";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Avatar } from "../../../components/ui/Avatar";

type DonationPromptModalProps = {
  visible: boolean;
  onDecline: () => void;
  onAccept: () => void;
};

// Modal 1 of the donation flow — shown once, right after an invoice's
// status transitions to PAID (see InvoiceEditContent's handleSubmit).
// "Maybe later" just closes this modal; "Sure, why not" moves on to
// DonationAmountOptionsModal (Modal 2). English/normal-mode content
// comes from en.ts via useContent; Malayali Mode instead renders its
// own branch below (image + Malayalam copy), same pattern as the
// Customizable "Coming Soon" dialog in InvoiceCreateContent.
export function DonationPromptModal({
  visible,
  onDecline,
  onAccept,
}: DonationPromptModalProps) {
  const t = useContent();
  const isMalayaliMode = useMalayaliModeStore((state) => state.isMalayaliMode);

  if (isMalayaliMode) {
    return (
      <Modal visible={visible} dismissible onDismiss={onDecline}>
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar imageUri="/images/memes/tip.jpg" name="Tip" size={112} />
          <Text variant="subheading" malayalam>
            കോളടിച്ചല്ലോ...
            <br />
            കുറച്ചു കാശ് എനിക്കും താടാ
          </Text>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            variant="primary"
            title="അതിനെന്താ തരാലോ.."
            malayalam
            fullWidth
            onClick={onAccept}
          />
          <Button
            variant="ghost"
            title="പോടാ കാശ് ഒന്നും തരില്ല"
            malayalam
            fullWidth
            onClick={onDecline}
          />
        </div>
      </Modal>
    );
  }

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
