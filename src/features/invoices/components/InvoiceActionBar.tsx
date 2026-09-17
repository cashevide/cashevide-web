import { useState } from "react";
import { Pencil, CreditCard, Download, Trash2 } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { cn } from "../../../utils/cn";

import type { InvoiceStatus } from "../types/invoiceTypes";

type InvoiceActionBarProps = {
  status: InvoiceStatus;
  onEdit: () => void;
  onRecordPayment: () => void;
  onDownloadPdf: () => void;
  onDelete: () => void;
  isDownloading?: boolean;
  isDeleting?: boolean;
  // Edit and Record Payment open the edit screen, which doesn't exist
  // yet — disable both rather than navigating to a broken/placeholder
  // route until that screen is built.
  editDisabled?: boolean;
  recordPaymentDisabled?: boolean;
};

export function InvoiceActionBar({
  status,
  onEdit,
  onRecordPayment,
  onDownloadPdf,
  onDelete,
  isDownloading = false,
  isDeleting = false,
  editDisabled = false,
  recordPaymentDisabled = false,
}: InvoiceActionBarProps) {
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  function handleDeleteConfirmed() {
    setDeleteConfirmVisible(false);
    onDelete();
  }

  const isPaid = status === "PAID";

  // Always "Record Payment" regardless of paid status — this button
  // opens the payments section of the edit screen, which supports
  // editing/removing existing payment records too, not just adding new
  // ones, so it stays enabled on a PAID invoice for correcting a
  // mistaken entry. The label itself doesn't change with status.
  const recordPaymentLabel = "Record Payment";

  // Same compact size/shape as the "New Invoice" / "New Client" buttons
  // (h-9, shape="md", px-3.5, rounded-md) so this row reads as the same
  // family of controls instead of the old full-width sidebar buttons.
  const compactButtonClass = "h-9 min-w-0 shrink-0 px-3.5 rounded-md";

  // Single row above the preview, matching Expo's "row" mode instead of
  // the old sidebar stack. Left group in task order: Record Payment
  // (brand, primary action) → Edit (outline) → Delete (destructive).
  // Download sits alone at the right edge via justify-between, kept
  // separate since it's a read-only/export action rather than one that
  // changes the invoice. overflow-x-auto is a safety net for narrow
  // viewports where four labeled buttons don't all fit — it scrolls
  // instead of wrapping awkwardly.
  return (
    <div className="flex flex-row items-center justify-between gap-2 overflow-x-auto">
      <div className="flex flex-row items-center gap-2 shrink-0">
        <Button
          variant="brand"
          shape="md"
          className={compactButtonClass}
          title={recordPaymentLabel}
          leftIcon={<CreditCard size={14} />}
          onClick={onRecordPayment}
          disabled={recordPaymentDisabled}
        />
        <Button
          variant="outline"
          shape="md"
          className={compactButtonClass}
          title="Edit"
          leftIcon={<Pencil size={14} />}
          onClick={onEdit}
          disabled={editDisabled}
        />
        <Button
          variant="destructive"
          shape="md"
          className={compactButtonClass}
          title={isDeleting ? "Deleting..." : "Delete Invoice"}
          leftIcon={<Trash2 size={14} />}
          onClick={() => setDeleteConfirmVisible(true)}
          disabled={isDeleting}
        />
      </div>

      <Button
        variant="outline"
        shape="md"
        className={cn(compactButtonClass, "shrink-0")}
        title={isDownloading ? "Preparing PDF..." : "Download / Share PDF"}
        leftIcon={<Download size={14} />}
        onClick={onDownloadPdf}
        disabled={isDownloading}
      />

      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Delete this invoice?"
        message={
          isPaid
            ? "This invoice has been marked as paid. Deleting it will permanently remove the invoice and its payment history. This action cannot be undone."
            : "This invoice will be removed from your list. This action cannot be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        isConfirming={isDeleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteConfirmVisible(false)}
      />
    </div>
  );
}
