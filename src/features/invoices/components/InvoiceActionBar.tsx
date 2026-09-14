import { useState } from "react";
import { Pencil, CreditCard, Download, Trash2 } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";

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

  // This button opens the payments section of the edit screen, which
  // supports editing and removing existing payment records, not just
  // adding new ones — so it stays visible and enabled on a PAID invoice
  // too, for correcting a mistaken entry. Only the label changes once
  // paid, since "Record Payment" reads like there's still an
  // outstanding balance to collect, which isn't true anymore — "Manage
  // Payments" doesn't imply that.
  const recordPaymentLabel = isPaid ? "Manage Payments" : "Record Payment";

  // Mobile (below md): 2x2 grid, matching Expo's "rows" mode. Desktop
  // (md+): every action full-width, one per row in a single column,
  // matching Expo's "stack" mode used in the sidebar. This must be ONE
  // grid across all 4 buttons, not two 2-button rows each switching
  // independently — otherwise md:flex-row on each pair leaves two
  // side-by-side rows instead of collapsing into one column of 4.
  return (
    <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
      <Button
        variant="primary"
        title="Edit"
        leftIcon={<Pencil size={16} />}
        onClick={onEdit}
        disabled={editDisabled}
        fullWidth
      />
      <Button
        variant="secondary"
        title={recordPaymentLabel}
        leftIcon={<CreditCard size={16} />}
        onClick={onRecordPayment}
        disabled={recordPaymentDisabled}
        fullWidth
      />
      <Button
        variant="outline"
        title={isDownloading ? "Preparing PDF..." : "Download / Share PDF"}
        leftIcon={<Download size={16} />}
        onClick={onDownloadPdf}
        disabled={isDownloading}
        fullWidth
      />
      <Button
        variant="destructive"
        title={isDeleting ? "Deleting..." : "Delete Invoice"}
        leftIcon={<Trash2 size={16} />}
        onClick={() => setDeleteConfirmVisible(true)}
        disabled={isDeleting}
        fullWidth
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
