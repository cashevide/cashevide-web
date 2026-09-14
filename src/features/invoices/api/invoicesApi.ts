import { api } from "../../../lib/api-client";
import { INVOICE_ENDPOINTS } from "../../../lib/api/endpoints";
import type {
  InvoicesListResponse,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  InvoiceDetailResponse,
  UpdateInvoiceRequest,
  UpdateInvoiceResponse,
  InvoiceStatus,
} from "../types/invoiceTypes";

// Mirrors InvoiceFilter (backend filters.py) + search_fields + ordering_fields
// from InvoiceViewSet. Omitting `ordering` uses the backend's own default
// (-created_at, newest first).
export type GetInvoicesParams = {
  status?: InvoiceStatus;
  client?: number;
  currency?: string;
  from_issue_date?: string;
  to_issue_date?: string;
  from_due_date?: string;
  to_due_date?: string;
  search?: string;
  ordering?:
    | "issue_date"
    | "-issue_date"
    | "due_date"
    | "-due_date"
    | "total_amount"
    | "-total_amount"
    | "balance_due"
    | "-balance_due"
    | "created_at"
    | "-created_at";
  page?: number;
};

export async function getInvoicesApi(
  params?: GetInvoicesParams,
): Promise<InvoicesListResponse> {
  const response = await api.get<InvoicesListResponse>(INVOICE_ENDPOINTS.list, {
    params,
  });

  return response.data;
}

export async function createInvoiceApi(
  payload: CreateInvoiceRequest,
): Promise<CreateInvoiceResponse> {
  const response = await api.post<CreateInvoiceResponse>(
    INVOICE_ENDPOINTS.create,
    payload,
  );

  return response.data;
}

export async function getInvoiceDetailApi(
  id: number,
): Promise<InvoiceDetailResponse> {
  const response = await api.get<InvoiceDetailResponse>(
    INVOICE_ENDPOINTS.detail(id),
  );

  return response.data;
}

// PUT only — this backend does not support PATCH for invoices (items/
// payments become required-field errors without the full payload). Always
// send the full items[] and payments[] arrays, existing entries included
// with their `id`, to retain them.
export async function updateInvoiceApi(
  id: number,
  payload: UpdateInvoiceRequest,
): Promise<UpdateInvoiceResponse> {
  const response = await api.put<UpdateInvoiceResponse>(
    INVOICE_ENDPOINTS.detail(id),
    payload,
  );

  return response.data;
}

// Soft delete — backend sets is_active=False, returns 204 No Content.
export async function deleteInvoiceApi(id: number): Promise<void> {
  await api.delete(INVOICE_ENDPOINTS.detail(id));
}
