import { Text } from "../../../../components/ui/Text";
import {
  classicStatusColors,
  invoicePreviewColors as colors,
} from "./invoicePreviewColors";

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
//
// This is the GENERIC palette (app theme tokens) — used by
// CustomizableInvoiceLayout, which has no backend template opinion on
// status colors. ClassicInvoiceLayout passes palette="classic" below to
// get classic.html's own hardcoded colors instead.
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

// classic.html's exact .status-draft / .status-unpaid /
// .status-partially_paid / .status-paid colors — see classicStatusColors
// in invoicePreviewColors.ts.
const CLASSIC_STATUS_CONFIG: Record<InvoiceStatus, StatusConfigEntry> = {
  DRAFT: {
    label: "Draft",
    bg: classicStatusColors.draftBg,
    text: classicStatusColors.draftText,
  },
  UNPAID: {
    label: "Unpaid",
    bg: classicStatusColors.unpaidBg,
    text: classicStatusColors.unpaidText,
  },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    bg: classicStatusColors.partiallyPaidBg,
    text: classicStatusColors.partiallyPaidText,
  },
  PAID: {
    label: "Paid",
    bg: classicStatusColors.paidBg,
    text: classicStatusColors.paidText,
  },
};

type InvoicePreviewStatusBadgeProps = {
  status: InvoiceStatus;
  // Defaults to the generic app-theme palette — CustomizableInvoiceLayout
  // relies on this default and passes nothing. ClassicInvoiceLayout
  // passes "classic" to match classic.html's hardcoded badge colors
  // exactly.
  palette?: "generic" | "classic";
};

export function InvoicePreviewStatusBadge({
  status,
  palette = "generic",
}: InvoicePreviewStatusBadgeProps) {
  const config =
    palette === "classic"
      ? CLASSIC_STATUS_CONFIG[status]
      : STATUS_CONFIG[status];
  const isClassic = palette === "classic";

  return (
    <div
      className={
        isClassic
          ? "inline-block rounded-full"
          : "self-start rounded-full px-2 py-0.5 leading-none"
      }
      style={{
        backgroundColor: config.bg,
        // classic.html's .status-badge: padding: 4pt 12pt — converted
        // at 96 DPI (1pt = 96/72px), same math ClassicInvoiceLayout.tsx
        // uses for its own PX constants. 4pt ≈ 5.33px, 12pt = 16px.
        ...(isClassic
          ? {
              paddingTop: 5,
              paddingBottom: 5,
              paddingLeft: 16,
              paddingRight: 16,
            }
          : undefined),
      }}
    >
      <Text
        variant="caption"
        className={isClassic ? "" : "font-semibold leading-none"}
        style={{
          color: config.text,
          // .status-badge in classic.html is Poppins 600, font-size:
          // 11pt (≈15px at 96 DPI — same PX.smallSize value
          // ClassicInvoiceLayout.tsx uses), text-transform: uppercase.
          // Only applied for the classic palette; the generic palette
          // (CustomizableInvoiceLayout) keeps the app's default
          // font/size/casing.
          ...(isClassic
            ? {
                fontFamily: '"Poppins", sans-serif',
                fontSize: 15,
                fontWeight: 600,
                textTransform: "uppercase" as const,
                lineHeight: 1,
              }
            : undefined),
        }}
      >
        {config.label}
      </Text>
    </div>
  );
}
