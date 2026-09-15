import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Spinner } from "../../../components/ui/Spinner";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { InvoicePreview } from "../components/InvoicePreview";
import { InvoiceActionBar } from "../components/InvoiceActionBar";
import { useInvoiceDetails } from "../hooks/useInvoiceDetails";
import { useDeleteInvoice } from "../hooks/useDeleteInvoice";
import { useDownloadInvoicePdf } from "../hooks/useDownloadInvoicePdf";
import { ROUTES } from "../../../lib/routes";

// Shared shell (header + Container) for the invalid/loading/not-found
// states — keeps the header visible even when the main content can't
// render yet, matching the Expo screen's per-state early returns.
function DetailsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader title="Invoice" showBackButton containerVariant="desktop" />
      <Container variant="desktop" scroll>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16">
          {children}
        </div>
      </Container>
    </div>
  );
}

export function InvoiceDetailsContent() {
  const navigate = useNavigate();
  const { id: idParam } = useParams<{ id: string }>();
  const id = Number(idParam);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const invoiceDetails = useInvoiceDetails(id, { enabled: !Number.isNaN(id) });
  const deleteInvoice = useDeleteInvoice();
  const downloadPdf = useDownloadInvoicePdf();

  // Refetch on mount only, same reasoning as InvoiceDashboardContent /
  // InvoiceListContent: no focus-lifecycle event in React Router, so a
  // mount-time refetch covers "data might be stale from an earlier
  // visit" without a focus-tracking library.
  useEffect(() => {
    if (!Number.isNaN(id)) {
      invoiceDetails.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Edit and Record Payment both open the edit screen — Record Payment
  // jumps straight to its Payments section via the ?section=payments
  // query param, matching Expo's edit(invoiceId, "payments") route.
  function handleEdit() {
    navigate(ROUTES.invoices.edit(id));
  }
  function handleRecordPayment() {
    navigate(ROUTES.invoices.edit(id, "payments"));
  }

  function handleDownloadPdf() {
    downloadPdf.mutate(id, {
      onError: () => {
        setErrorMessage(
          "Could not download the invoice PDF. Please try again.",
        );
      },
    });
  }

  function handleDelete() {
    deleteInvoice.mutate(id, {
      onSuccess: () => {
        navigate(ROUTES.invoices.list, { replace: true });
      },
      onError: () => {
        setErrorMessage("Could not delete this invoice. Please try again.");
      },
    });
  }

  if (Number.isNaN(id)) {
    return (
      <DetailsShell>
        <Text variant="body" className="text-muted-foreground">
          Invalid invoice.
        </Text>
      </DetailsShell>
    );
  }

  if (invoiceDetails.isLoading) {
    return (
      <DetailsShell>
        <Spinner />
      </DetailsShell>
    );
  }

  if (invoiceDetails.isError || !invoiceDetails.data) {
    return (
      <DetailsShell>
        <Text variant="body" className="text-muted-foreground">
          This invoice could not be found.
        </Text>
      </DetailsShell>
    );
  }

  const invoice = invoiceDetails.data;

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader showBackButton containerVariant="desktop">
        <Text variant="body-lg" className="font-semibold text-2xl truncate">
          {invoice.name || "Untitled Client"}
          <span className="text-muted-foreground">
            {" - "}
            {invoice.invoice_number}
          </span>
        </Text>
      </ScreenHeader>

      <Container variant="desktop" scroll>
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 px-6 py-6">
          <div className="w-full md:flex-1">
            <InvoicePreview invoice={invoice} />
          </div>

          <div className="w-full md:w-[280px]">
            <InvoiceActionBar
              status={invoice.status}
              onEdit={handleEdit}
              onRecordPayment={handleRecordPayment}
              onDownloadPdf={handleDownloadPdf}
              onDelete={handleDelete}
              isDownloading={downloadPdf.isPending}
              isDeleting={deleteInvoice.isPending}
            />
          </div>
        </div>
      </Container>

      <Modal
        visible={errorMessage !== null}
        dismissible
        onDismiss={() => setErrorMessage(null)}
        title="Something went wrong"
        description={errorMessage}
        footer={
          <Button
            variant="primary"
            title="OK"
            fullWidth
            onClick={() => setErrorMessage(null)}
          />
        }
      />
    </div>
  );
}
