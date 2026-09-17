import { useEffect } from "react";

import { useContent } from "../../../content/useContent";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Spinner } from "../../../components/ui/Spinner";
import { buildUpiLink } from "../config/donationConfig";
import { useUpiQrCode } from "../hooks/useUpiQrCode";

type DonationPaymentModalProps = {
  amount: number;
  // Static SVG for a fixed amount (15/25/100) — omitted for a custom
  // amount, which generates its QR at runtime via useUpiQrCode instead.
  staticQrImageUri?: string;
  // Takes the user back to the amount-picker step (Modal 2) — this is
  // a "back" action, not a flow-abandoning "cancel"/dismiss. The
  // caller (DonationFlow/SupportFlow) re-opens "options" rather than
  // closing the whole flow.
  onBack: () => void;
  // See DonationAmountOptionsModal — when true, ignores the global
  // Malayali Mode toggle so this modal always shows plain/
  // professional copy. Used by SupportFlow; omit (or pass false)
  // for the normal store-driven behavior used by DonationFlow.
  forceNormalMode?: boolean;
};

// This step's Modal title — depends on isMobile (deep-link handoff on
// mobile vs QR on desktop, see the component below), so it's exposed
// as a hook rather than a plain string — see
// DonationAmountOptionsModal's useDonationAmountOptionsTitle for why
// this lives alongside the component rather than being duplicated at
// the call site.
export function useDonationPaymentTitle(forceNormalMode = false) {
  const t = useContent(forceNormalMode);
  const isMobile = useMediaQuery("(max-width: 767px)");
  return isMobile
    ? t("donation.payment.title.mobile")
    : t("donation.payment.title.desktop");
}

// This step's Modal className — static, but exported alongside the
// title hook so the flow doesn't need to hardcode per-step styling
// choices that belong to this component.
export const DONATION_PAYMENT_MODAL_CLASS = "items-center text-center";

// Modal 3 of the donation flow — the actual payment step.
// - Mobile (<768px): redirects to the UPI deep link as soon as this
//   component mounts, handing off to whatever UPI app is installed.
//   No QR shown here.
// - Desktop (>=768px): shows a QR to scan — the pre-made static SVG
//   for a fixed amount, or a QR generated on the fly for a custom one.
// Same breakpoint (768px) used everywhere else in the app (see
// InvoiceEditContent, InvoiceListContent).
// The secondary button (and the backdrop/dismiss) go back to the
// amount-picker step rather than closing the whole flow — see onBack.
//
// Renders CONTENT ONLY — see DonationPromptModal.tsx for why (no
// <Modal> wrapper of its own; DonationFlow owns one shared <Modal>
// for the whole flow). Because of that, this component now mounts
// exactly when the flow reaches the "payment" step (no separate
// `visible` prop to check) — the deep-link-redirect effect below
// fires on mount instead of on a visible:false->true transition,
// which is equivalent here since the flow only ever renders this
// component while this step is current.
export function DonationPaymentModal({
  amount,
  staticQrImageUri,
  onBack,
  forceNormalMode = false,
}: DonationPaymentModalProps) {
  const t = useContent(forceNormalMode);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const upiLink = buildUpiLink(amount);

  // Only generate a QR at runtime when there's no static one to use
  // (i.e. a custom amount) — passing null skips the network/CPU work
  // entirely for the 3 fixed amounts.
  const { dataUrl: generatedQrDataUrl, isGenerating } = useUpiQrCode(
    staticQrImageUri ? null : upiLink,
  );

  useEffect(() => {
    if (isMobile) {
      window.location.href = upiLink;
    }
    // Only re-run if the device class changes or the link itself
    // changes (different amount) — not on every render, since
    // navigating away is a one-shot side effect per mount of this
    // step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, upiLink]);

  const qrImageSrc = staticQrImageUri ?? generatedQrDataUrl;

  return (
    <>
      <div className="flex flex-col items-center gap-4 w-full mt-3">
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
          variant="ghost"
          title={t("donation.payment.backButton")}
          fullWidth
          onClick={onBack}
        />
      </div>
    </>
  );
}
