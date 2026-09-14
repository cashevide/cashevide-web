import { api } from "../../../lib/api-client";
import { INVOICE_ENDPOINTS } from "../../../lib/api/endpoints";

// Triggers a normal browser download via a Blob + temporary <a> tag.
function downloadPdfWeb(blob: Blob, filename: string) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

// Extracts the filename from the backend's Content-Disposition header
// (e.g. `attachment; filename="ClientName_INV-0003.pdf"`), falling back to
// a generic name if the header is missing or doesn't match.
function extractFilename(
  contentDisposition: string | undefined,
  fallback: string,
): string {
  if (!contentDisposition) {
    return fallback;
  }

  const match = contentDisposition.match(/filename="?([^"]+)"?/);

  return match?.[1] ?? fallback;
}

// Downloads an invoice PDF and triggers a browser download. Native
// share-sheet handling (expo-file-system/expo-sharing) from the Expo
// version is dropped entirely — not applicable on web.
//
// Important: the `api` client's default Accept header is `application/json`
// (see lib/api-client.ts), but this endpoint's DRF view only has a PDF
// renderer configured (renderer_classes=[PDFRenderer], verified in
// invoices/views.py) — sending the default header causes DRF's content
// negotiation to reject the request with 406 Not Acceptable. We override
// the Accept header to `application/pdf` for this request only.
//
// Also: because the view's renderer is PDF-only (not the default JSON
// renderer), a 404 (invoice not found / not owned by this user) also gets
// rendered through PDFRenderer rather than DRF's normal JSON error
// response — so don't rely on response content-type to detect failure,
// only on the HTTP status code (axios throws on non-2xx by default, which
// is what actually surfaces the error here).
export async function downloadInvoicePdfApi(id: number): Promise<void> {
  const response = await api.get(INVOICE_ENDPOINTS.downloadPdf(id), {
    headers: {
      Accept: "application/pdf",
    },
    responseType: "blob",
  });

  const filename = extractFilename(
    response.headers["content-disposition"],
    `Invoice_${id}.pdf`,
  );

  downloadPdfWeb(response.data as Blob, filename);
}
