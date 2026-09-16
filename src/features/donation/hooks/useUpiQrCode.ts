import { useEffect, useState } from "react";
import QRCode from "qrcode";

// Only used for custom amounts — the 3 fixed amounts (15/25/100) use
// the pre-made static QR SVGs from donationConfig.ts instead, so this
// never runs for those. Regenerates whenever `upiLink` changes.
export function useUpiQrCode(upiLink: string | null) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!upiLink) {
      setDataUrl(null);
      return;
    }

    let cancelled = false;
    setIsGenerating(true);

    QRCode.toDataURL(upiLink, { width: 320, margin: 1 })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
        }
      })
      .catch(() => {
        // Leaves dataUrl null on failure — DonationPaymentModal falls
        // back to showing nothing rather than a broken image; the UPI
        // link text itself (if ever shown) still stays valid.
        if (!cancelled) {
          setDataUrl(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsGenerating(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [upiLink]);

  return { dataUrl, isGenerating };
}
