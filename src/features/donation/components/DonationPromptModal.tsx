import { useContent } from "../../../content/useContent";
import { useMalayaliModeStore } from "../../../stores/malayaliModeStore";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Avatar } from "../../../components/ui/Avatar";

type DonationPromptModalProps = {
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
//
// Renders CONTENT ONLY — no <Modal> wrapper of its own. DonationFlow
// owns a single shared <Modal> for the whole multi-step flow (see
// DonationFlow.tsx) so the backdrop/dialog shell persists across step
// changes instead of unmounting and remounting per step, which used
// to cause two problems: a visible flash/double-blur as one step's
// backdrop faded out while the next one's faded in, and — worse — a
// brief window where both backdrops were in the DOM at once, so a
// click meant to dismiss the (visually topmost) new step could
// actually land on the previous step's still-present backdrop and
// trigger ITS dismiss handler instead.
export function DonationPromptModal({
  onDecline,
  onAccept,
}: DonationPromptModalProps) {
  const t = useContent();
  const isMalayaliMode = useMalayaliModeStore((state) => state.isMalayaliMode);

  if (isMalayaliMode) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
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
    </>
  );
}
