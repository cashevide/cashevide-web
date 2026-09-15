import { Text } from "../../../../components/ui/Text";
import { useBusinessProfile } from "../../../../features/business-profile/hooks/useBusinessProfile";
import { InvoicePreviewStatusBadge } from "./InvoicePreviewStatusBadge";
import { invoicePreviewColors as colors } from "./invoicePreviewColors";

import type { InvoicePreviewData } from "../InvoicePreview";

type CustomizableInvoiceLayoutProps = {
  invoice: InvoicePreviewData;
};

function formatMoney(amount: string, currency: string): string {
  return `${currency || ""} ${amount}`.trim();
}

// Always light — see invoicePreviewColors.ts. Every color here comes
// from the `colors` constant via `style`, never a Tailwind color
// className, so this layout looks identical whether the app is in dark
// or light mode.
//
// Visually distinct from ClassicInvoiceLayout: centered header instead
// of a left/right split, and a borderless spaced item list instead of a
// bordered table. Same information, different presentation — this is a
// first pass and can be revisited later.
export function CustomizableInvoiceLayout({
  invoice,
}: CustomizableInvoiceLayoutProps) {
  const liveBusinessProfile = useBusinessProfile();

  // A saved invoice (has an id) carries a frozen business_snapshot
  // from creation time — that snapshot is the ONLY source used for it,
  // even if it's somehow empty, so this preview always matches what
  // download_pdf on the backend would actually render. Only an
  // unsaved draft (no id yet) falls back to the live profile, since
  // that's genuinely the data the backend will snapshot on first save.
  const isSavedInvoice = invoice.id != null;
  const snapshot = invoice.business_snapshot;

  const businessName = isSavedInvoice
    ? snapshot?.business_name
    : liveBusinessProfile.data?.business_name;
  const businessLogo = isSavedInvoice
    ? snapshot?.logo
    : liveBusinessProfile.data?.logo;
  const businessAddress = isSavedInvoice
    ? snapshot?.address
    : liveBusinessProfile.data?.address;
  const businessPhone = isSavedInvoice
    ? snapshot?.phone_number
    : liveBusinessProfile.data?.phone_number;

  const hasLogo = !!businessLogo;
  const hasBusinessAddress = !!businessAddress;
  const hasBusinessPhone = !!businessPhone;
  const hasEmail = !!invoice.email;
  const hasPhone = !!invoice.phone;
  const hasAddress = !!invoice.address;
  const hasAmountPaid = invoice.amount_paid != null;
  const hasBalanceDue = invoice.balance_due != null;

  return (
    <div
      className="flex flex-col gap-4 rounded-lg p-5 shadow"
      style={{ backgroundColor: colors.card }}
    >
      {/* -------------------- Centered header -------------------- */}
      <div className="flex flex-col items-center gap-1">
        {hasLogo && (
          <img
            src={businessLogo ?? undefined}
            alt={businessName || "Business logo"}
            className="mb-1 h-12 w-12 object-contain"
          />
        )}
        <Text
          variant="body-lg"
          className="font-semibold text-center"
          style={{ color: colors.cardForeground }}
        >
          {businessName || "Your Business"}
        </Text>
        {hasBusinessAddress && (
          <Text
            variant="caption"
            className="text-center"
            style={{ color: colors.mutedForeground }}
          >
            {businessAddress}
          </Text>
        )}
        {hasBusinessPhone && (
          <Text
            variant="caption"
            className="text-center"
            style={{ color: colors.mutedForeground }}
          >
            {businessPhone}
          </Text>
        )}

        {invoice.status && (
          <div className="mt-2">
            <InvoicePreviewStatusBadge status={invoice.status} />
          </div>
        )}
      </div>

      <div className="h-px" style={{ backgroundColor: colors.border }} />

      {/* -------------------- Invoice meta -------------------- */}
      <div className="flex flex-row justify-between">
        <div>
          <Text
            variant="caption"
            className="uppercase"
            style={{ color: colors.mutedForeground }}
          >
            Invoice
          </Text>
          <Text
            variant="body-sm"
            className="font-semibold"
            style={{ color: colors.cardForeground }}
          >
            {invoice.invoice_number ?? "—"}
          </Text>
        </div>
        <div className="flex flex-col items-end">
          <Text
            variant="caption"
            className="uppercase"
            style={{ color: colors.mutedForeground }}
          >
            Issued
          </Text>
          <Text variant="body-sm" style={{ color: colors.cardForeground }}>
            {invoice.issue_date ?? "—"}
          </Text>
        </div>
        <div className="flex flex-col items-end">
          <Text
            variant="caption"
            className="uppercase"
            style={{ color: colors.mutedForeground }}
          >
            Due
          </Text>
          <Text variant="body-sm" style={{ color: colors.cardForeground }}>
            {invoice.due_date ?? "—"}
          </Text>
        </div>
      </div>

      {/* -------------------- Bill To -------------------- */}
      <div className="flex flex-col gap-0.5">
        <Text
          variant="caption"
          className="uppercase"
          style={{ color: colors.mutedForeground }}
        >
          Billed To
        </Text>
        <Text
          variant="body-sm"
          className="font-semibold"
          style={{ color: colors.cardForeground }}
        >
          {invoice.name || "Untitled Client"}
        </Text>
        {hasEmail && (
          <Text variant="caption" style={{ color: colors.mutedForeground }}>
            {invoice.email}
          </Text>
        )}
        {hasPhone && (
          <Text variant="caption" style={{ color: colors.mutedForeground }}>
            {invoice.phone}
          </Text>
        )}
        {hasAddress && (
          <Text variant="caption" style={{ color: colors.mutedForeground }}>
            {invoice.address}
          </Text>
        )}
      </div>

      {/* -------------------- Items (borderless spaced list) -------------------- */}
      <div className="flex flex-col gap-3">
        {invoice.items.map((item) => (
          <div key={item.id} className="flex flex-row justify-between">
            <div className="flex-1 pr-3">
              <Text
                variant="body-sm"
                className="font-semibold"
                style={{ color: colors.cardForeground }}
              >
                {item.title || "—"}
              </Text>
              <Text variant="caption" style={{ color: colors.mutedForeground }}>
                {item.quantity || "—"} × {item.unit_price || "—"}
              </Text>
            </div>
            <Text
              variant="body-sm"
              className="font-semibold"
              style={{ color: colors.cardForeground }}
            >
              {formatMoney(item.total, invoice.currency)}
            </Text>
          </div>
        ))}
      </div>

      <div className="h-px" style={{ backgroundColor: colors.border }} />

      {/* -------------------- Totals -------------------- */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <Text variant="body-sm" style={{ color: colors.mutedForeground }}>
            Subtotal
          </Text>
          <Text variant="body-sm" style={{ color: colors.cardForeground }}>
            {formatMoney(invoice.subtotal, invoice.currency)}
          </Text>
        </div>
        <div className="flex flex-row justify-between">
          <Text variant="body-sm" style={{ color: colors.mutedForeground }}>
            Discount
          </Text>
          <Text variant="body-sm" style={{ color: colors.cardForeground }}>
            {formatMoney(invoice.discount, invoice.currency)}
          </Text>
        </div>
        <div className="flex flex-row justify-between pt-1">
          <Text
            variant="body"
            className="font-semibold"
            style={{ color: colors.cardForeground }}
          >
            Total
          </Text>
          <Text
            variant="body"
            className="font-semibold"
            style={{ color: colors.cardForeground }}
          >
            {formatMoney(invoice.total_amount, invoice.currency)}
          </Text>
        </div>

        {hasAmountPaid && (
          <div className="flex flex-row justify-between">
            <Text variant="body-sm" style={{ color: colors.mutedForeground }}>
              Amount Paid
            </Text>
            <Text variant="body-sm" style={{ color: colors.cardForeground }}>
              {formatMoney(invoice.amount_paid!, invoice.currency)}
            </Text>
          </div>
        )}
        {hasBalanceDue && (
          <div className="flex flex-row justify-between">
            <Text
              variant="body-sm"
              className="font-semibold"
              style={{ color: colors.cardForeground }}
            >
              Balance Due
            </Text>
            <Text
              variant="body-sm"
              className="font-semibold"
              style={{ color: colors.cardForeground }}
            >
              {formatMoney(invoice.balance_due!, invoice.currency)}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
