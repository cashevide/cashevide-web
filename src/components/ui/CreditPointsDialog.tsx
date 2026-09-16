import { useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "./Button";
import { Modal } from "./Modal";
import { Text } from "./Text";
import { Toast } from "./Toast";
import { ROUTES } from "../../lib/routes";

interface CreditPointsDialogProps {
  visible: boolean;
  points: number;
  onDismiss: () => void;
  // The signed-in user's own referral code (UserProfile.referral_code)
  // — when present, "Invite Friends" shares/copies a link that
  // auto-applies this code on the recipient's signup flow
  // (WelcomeContent forwards ?referral= through to whichever signup
  // path they pick). Left undefined while the profile is still
  // loading, in which case the button just closes the dialog.
  referralCode?: string;
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
  referralCode,
}: CreditPointsDialogProps) {
  const [justCopied, setJustCopied] = useState(false);

  async function handleInviteFriends() {
    if (!referralCode) {
      onDismiss();
      return;
    }

    const inviteLink = `${window.location.origin}${ROUTES.welcome}?referral=${encodeURIComponent(referralCode)}`;

    // Web Share API — supported on mobile browsers and Safari/Edge on
    // desktop, but not desktop Chrome-on-Linux or desktop Firefox, so
    // this always needs the clipboard fallback below rather than being
    // treated as universally available. `"share" in navigator` is the
    // feature-detection check (rather than always calling it and
    // catching the failure), since calling an undefined method throws
    // a TypeError, not the "not supported" rejection this catch block
    // is written for.
    if ("share" in navigator) {
      try {
        await navigator.share({
          title: "Join me on Cashevide",
          text: "Sign up on Cashevide with my referral link and we both earn credit points.",
          url: inviteLink,
        });
        return;
      } catch {
        // User cancelled the share sheet, or the browser rejected the
        // call — fall through to clipboard copy either way rather
        // than leaving the button appearing to do nothing.
      }
    }

    // navigator.clipboard only exists in a secure context — HTTPS, or
    // localhost during dev. A dev server reached over its network IP
    // (e.g. http://192.168.x.x:5173, for testing on another device)
    // is NOT secure, so navigator.clipboard is undefined there and
    // calling .writeText() on it throws. document.execCommand("copy")
    // is deprecated but still works in that case, so it's the
    // fallback rather than leaving the button silently do nothing.
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(inviteLink);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = inviteLink;
      // Off-screen but still focusable/selectable — execCommand needs
      // a real text selection to copy from.
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 2000);
  }

  return (
    <>
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
            onClick={handleInviteFriends}
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
          <Text
            variant="body-sm"
            className="text-muted-foreground max-w-[220px]"
          >
            Invite your freelance friends and earn referral points to generate
            customizable invoices.
          </Text>
        </div>
      </Modal>

      {/* Confirms the clipboard-copy fallback path (desktop browsers
          without Web Share support, e.g. Chrome on Linux or Firefox).
          The button's own text used to be the only feedback, but
          that's easy to miss since it's inside the dialog the person
          is about to close — Toast sits above the modal instead, so
          it stays visible even as the dialog is dismissed. */}
      <Toast message="Link Copied!" visible={justCopied} />
    </>
  );
}
