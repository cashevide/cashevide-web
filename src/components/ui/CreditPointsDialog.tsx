import { UserPlus } from "lucide-react";

import { Button } from "./Button";
import { Modal } from "./Modal";
import { Text } from "./Text";

interface CreditPointsDialogProps {
  visible: boolean;
  points: number;
  onDismiss: () => void;
  onInviteFriends?: () => void;
}

// Reusable "credit points" info dialog — pairs with CreditBadge as the
// tap target that opens it, but is its own component (not inline in
// any one screen) since credit points will show up in more than one
// place (dashboard header today, likely settings/profile later).
//
// Built directly on Modal rather than InfoDialog — the count needs
// its own prominent line above the description (not squeezed into one
// message string, which InfoDialog only renders as flat text with no
// line-break support), so this owns its layout rather than reusing
// InfoDialog's generic title+message shape.
export function CreditPointsDialog({
  visible,
  points,
  onDismiss,
  onInviteFriends,
}: CreditPointsDialogProps) {
  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onDismiss}
      // Extra top/bottom padding beyond Modal's own p-6 default — this
      // dialog's centered icon+text content reads better with more
      // breathing room than Modal's other uses (title+description+
      // form fields, which are already fairly dense).
      className="py-10"
      footer={
        <Button
          variant="brand"
          title="Invite Friends"
          leftIcon={<UserPlus size={18} />}
          onClick={onInviteFriends ?? onDismiss}
          fullWidth
        />
      }
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <img
          src="/images/credit-coins/credit-coin.svg"
          alt=""
          width={96}
          height={96}
        />

        <Text variant="subheading">
          {points.toLocaleString()} Credit Points
        </Text>

        {/* Width constrained to force a natural 3-line wrap instead of
            hardcoding line breaks manually — the text still reflows
            correctly if the copy changes later. */}
        <Text variant="body-sm" className="text-muted-foreground max-w-[220px]">
          Invite your freelance friends and earn referral points to generate
          customizable invoices.
        </Text>
      </div>
    </Modal>
  );
}
