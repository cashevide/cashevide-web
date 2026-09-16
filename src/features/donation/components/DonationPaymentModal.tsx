import { useEffect } from "react";

import { useContent } from "../../../content/useContent";
import { useMalayaliModeStore } from "../../../stores/malayaliModeStore";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { Modal } from "../../../components/ui/Modal";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { buildUpiLink } from "../config/donationConfig";
import { useUpiQrCode } from "../hooks/useUpiQrCode";

type DonationPaymentModalProps = {
  visible: boolean;
  amount: number;
  // Static SVG for a fixed amount (15/25/100) — omitted for a custom
  // amount, which generates its QR at runtime via useUpiQrCode instead.
  staticQrImageUri?: string;
  onSent: () => void;
  onCancel: () => void;
  // See DonationAmountOptionsModal — when true, ignores the global
  // Malayali Mode toggle so this modal always shows plain/
  // professional copy. Used by SupportFlow; omit (or pass false)
  // for the normal store-driven behavior used by DonationFlow.
  forceNormalMode?: boolean;
};

// Modal 3 of the donation flow — the actual payment step.
// - Mobile (<768px): redirects to the UPI deep link as soon as this
//   modal mounts/becomes visible, handing off to whatever UPI app is
//   installed. No QR shown here.
// - Desktop (>=768px): shows a QR to scan — the pre-made static SVG
//   for a fixed amount, or a QR generated on the fly for a custom one.
// Same breakpoint (768px) used everywhere else in the app (see
// InvoiceEditContent, InvoiceListContent).
export function DonationPaymentModal({
  visible,
  amount,
  staticQrImageUri,
  onSent,
  onCancel,
  forceNormalMode = false,
}: DonationPaymentModalProps) {
  const t = useContent(forceNormalMode);
  const isMalayaliModeFromStore = useMalayaliModeStore(
    (state) => state.isMalayaliMode,
  );
  const isMalayaliMode = forceNormalMode ? false : isMalayaliModeFromStore;
  const isMobile = useMediaQuery("(max-width: 767px)");

  const upiLink = buildUpiLink(amount);

  // Only generate a QR at runtime when there's no static one to use
  // (i.e. a custom amount) — passing null skips the network/CPU work
  // entirely for the 3 fixed amounts.
  const { dataUrl: generatedQrDataUrl, isGenerating } = useUpiQrCode(
    staticQrImageUri ? null : upiLink,
  );

  useEffect(() => {
    if (visible && isMobile) {
      window.location.href = upiLink;
    }
    // Only re-run if the modal opens/closes, the device class changes,
    // or the link itself changes (different amount) — not on every
    // render, since navigating away is a one-shot side effect per
    // "session" of this modal being open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isMobile, upiLink]);

  const qrImageSrc = staticQrImageUri ?? generatedQrDataUrl;

  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onCancel}
      title={
        isMobile
          ? t("donation.payment.title.mobile")
          : t("donation.payment.title.desktop")
      }
      className="items-center"
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <Text variant="subheading" numeric>
          ₹{amount}
        </Text>

        {!isMobile && (
          <div className="flex items-center justify-center w-[240px] h-[240px] rounded-lg bg-white p-3">
            {qrImageSrc ? (
              <img
                src={qrImageSrc}
                alt="UPI payment QR code"
                className="w-full h-full object-contain"
              />
            ) : isGenerating ? (
              <Spinner size="lg" />
            ) : null}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-6 w-full">
        <Button
          variant="primary"
          title={t("donation.payment.sentButton")}
          malayalam={isMalayaliMode}
          fullWidth
          onClick={onSent}
        />
        <Button
          variant="ghost"
          title={t("donation.payment.cancelButton")}
          malayalam={isMalayaliMode}
          fullWidth
          onClick={onCancel}
        />
      </div>
    </Modal>
  );
}
