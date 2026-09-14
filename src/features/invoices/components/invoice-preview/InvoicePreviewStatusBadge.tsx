import { Text } from "../../../../components/ui/Text";
import { invoicePreviewColors as colors } from "./invoicePreviewColors";

import type { InvoiceStatus } from "../../types/invoiceTypes";

type StatusConfigEntry = {
  label: string;
  bg: string;
  text: string;
};

// Light-mode-only mirror of InvoiceStatusBadge.tsx / Badge.tsx's variant
// mapping — see invoicePreviewColors.ts for why this can't just reuse the
// shared `Badge` component (it's theme-aware; this must never be).
// Padding/leading kept in sync with Badge.tsx's current compact style.
const STATUS_CONFIG: Record<InvoiceStatus, StatusConfigEntry> = {
  DRAFT: {
    label: "Draft",
    bg: colors.statusDefaultBg,
    text: colors.statusDefaultText,
  },
  UNPAID: {
    label: "Unpaid",
    bg: colors.statusWarningBg,
    text: colors.statusWarningText,
  },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    bg: colors.statusInfoBg,
    text: colors.statusInfoText,
  },
  PAID: {
    label: "Paid",
    bg: colors.statusSuccessBg,
    text: colors.statusSuccessText,
  },
};

type InvoicePreviewStatusBadgeProps = {
  status: InvoiceStatus;
};

export function InvoicePreviewStatusBadge({
  status,
}: InvoicePreviewStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className="self-start rounded-full px-2 py-0.5 leading-none"
      style={{ backgroundColor: config.bg }}
    >
      <Text
        variant="caption"
        className="font-semibold leading-none"
        style={{ color: config.text }}
      >
        {config.label}
      </Text>
    </div>
  );
}
