import { useContent } from "../../../content/useContent";
import { useMalayaliModeStore } from "../../../stores/malayaliModeStore";
import { Modal } from "../../../components/ui/Modal";
import { Text } from "../../../components/ui/Text";
import { Avatar } from "../../../components/ui/Avatar";
import { DONATION_OPTIONS } from "../config/donationConfig";

import type { ContentKey } from "../../../content/keys";
import type { DonationOption } from "../types/donationTypes";

type DonationAmountOptionsModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (option: DonationOption) => void;
  // When true, ignores the global Malayali Mode toggle for this modal
  // — plain "Small/Standard/Generous" labels, no food avatars — even
  // if the user has Malayali Mode on elsewhere in the app. Used by
  // SupportFlow (the Settings-triggered "Buy Me a Coffee" entry
  // point), which always wants a plain/professional presentation.
  // Omit (or pass false) for the normal store-driven behavior, as
  // used by the invoice-paid DonationFlow.
  forceNormalMode?: boolean;
};

// Maps each option's stable id to its label key — kept here rather
// than in donationConfig.ts since it's presentation (which content
// key labels this row), not the payment data itself (amount/qr/image).
const LABEL_KEY: Record<string, ContentKey> = {
  chaya: "donation.options.chaya.label",
  "chaya-parippuvada": "donation.options.chayaParippuvada.label",
  shawarma: "donation.options.shawarma.label",
  custom: "donation.options.custom.label",
};

// Modal 2 of the donation flow — a card list of amounts to choose
// from. Malayali Mode shows a food-item avatar on the left of each
// fixed-amount row; normal mode shows no avatar and plainer labels
// (see LABEL_KEY / en.ts vs malayali.ts). Picking "custom" doesn't
// pay anything yet — the caller (DonationFlow) opens the amount-entry
// step next; picking a fixed amount goes straight to DonationPaymentModal.
export function DonationAmountOptionsModal({
  visible,
  onDismiss,
  onSelect,
  forceNormalMode = false,
}: DonationAmountOptionsModalProps) {
  const t = useContent(forceNormalMode);
  const isMalayaliModeFromStore = useMalayaliModeStore(
    (state) => state.isMalayaliMode,
  );
  const isMalayaliMode = forceNormalMode ? false : isMalayaliModeFromStore;

  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onDismiss}
      title={t("donation.options.title")}
      className="items-center"
    >
      <div className="flex flex-col gap-3 w-full">
        {DONATION_OPTIONS.map((option) => {
          const label = t(LABEL_KEY[option.id]);
          // Avatar only in Malayali Mode, and only for fixed (food)
          // options — normal mode and the custom row never show one.
          const showAvatar =
            isMalayaliMode && option.kind === "fixed" && option.imageUri;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option)}
              className="flex flex-row items-center gap-3 w-full rounded-lg border border-border bg-card p-3 text-left cursor-pointer active:opacity-60"
            >
              {showAvatar && (
                <Avatar
                  imageUri={option.imageUri}
                  name={label}
                  size={40}
                  shape="circle"
                />
              )}

              <div className="flex flex-1 flex-row items-center justify-between">
                <Text variant="body" malayalam={isMalayaliMode}>
                  {label}
                </Text>

                {option.kind === "fixed" && (
                  <Text variant="body" numeric className="font-semibold">
                    ₹{option.amount}
                  </Text>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
