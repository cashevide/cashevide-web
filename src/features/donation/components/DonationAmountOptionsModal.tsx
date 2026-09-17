import { useContent } from "../../../content/useContent";
import { useMalayaliModeStore } from "../../../stores/malayaliModeStore";
import { Modal } from "../../../components/ui/Modal";
import { Text } from "../../../components/ui/Text";
import { Avatar } from "../../../components/ui/Avatar";
import { cn } from "../../../utils/cn";
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
// fixed-amount row, one option per row (4 rows total). Normal mode
// uses 3 rows instead: the first two fixed options ("Small"/chaya and
// "Standard"/chaya-parippuvada) share a row at 50% width each, then
// "Generous"/shawarma and "Custom amount" each get their own
// full-width row below (see LABEL_KEY / en.ts vs malayali.ts).
// Picking "custom" doesn't pay anything yet — the caller (DonationFlow)
// opens the amount-entry step next; picking a fixed amount goes
// straight to DonationPaymentModal.
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

  function renderOption(option: DonationOption, halfWidth: boolean) {
    const label = t(LABEL_KEY[option.id]);
    // Avatar only in Malayali Mode, and only for fixed (food)
    // options — normal mode and the custom row never show one.
    const showAvatar =
      isMalayaliMode && option.kind === "fixed" && option.imageUri;
    // Only the 3 fixed-amount labels (chaya/parippuvada/shawarma) are
    // actually Malayalam text in Malayali Mode — "custom.label" is
    // "Custom amount" in both modes (see malayali.ts), so it always
    // renders in the Latin font regardless of isMalayaliMode.
    const labelIsMalayalam = isMalayaliMode && option.kind === "fixed";
    // Malayali Mode's "custom" row has no avatar and no amount to
    // balance against on the right (unlike the food rows), so its
    // label is centred instead of left-aligned — normal mode's
    // "Custom amount" row is unaffected (still left-aligned, matching
    // the "Generous" row above it).
    const centerCustomLabel = isMalayaliMode && option.kind === "custom";

    return (
      <button
        key={option.id}
        type="button"
        onClick={() => onSelect(option)}
        className={cn(
          "flex items-center gap-3 rounded-lg border border-border bg-card p-3 cursor-pointer active:opacity-60",
          centerCustomLabel ? "text-center justify-center" : "text-left",
          // Row layout (avatar + label + amount inline) for the
          // full-width Malayali Mode rows and normal mode's
          // full-width rows (Generous / Custom amount); the two
          // half-width normal-mode options (Small / Standard) stack
          // label above amount instead, since each card is narrower.
          halfWidth ? "flex-col items-start gap-1 flex-1" : "flex-row w-full",
        )}
      >
        {showAvatar && (
          <Avatar
            imageUri={option.imageUri}
            name={label}
            size={40}
            shape="circle"
          />
        )}

        <div
          className={cn(
            "flex w-full",
            halfWidth
              ? "flex-col items-start gap-1"
              : centerCustomLabel
                ? "flex-1 flex-row items-center justify-center"
                : "flex-1 flex-row items-center justify-between",
          )}
        >
          <Text variant="body" malayalam={labelIsMalayalam}>
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
  }

  // Normal mode's first two fixed options (Small/Standard) share a
  // row; the rest (Generous, Custom amount) render individually below.
  const [firstRowOptions, restOptions] = isMalayaliMode
    ? [[], DONATION_OPTIONS]
    : [DONATION_OPTIONS.slice(0, 2), DONATION_OPTIONS.slice(2)];

  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onDismiss}
      title={t("donation.options.title")}
      className="text-center"
    >
      <div className="flex flex-col gap-3 w-full mt-3">
        {!isMalayaliMode && (
          <div className="flex flex-row gap-3 w-full">
            {firstRowOptions.map((option) => renderOption(option, true))}
          </div>
        )}

        {restOptions.map((option) => renderOption(option, false))}
      </div>
    </Modal>
  );
}
