import type {
  InvoiceItem,
  InvoiceItemRequest,
  InvoiceItemsError,
} from "./invoiceItemTypes";
import type {
  PaymentRecord,
  PaymentRecordRequest,
  PaymentRecordsError,
} from "./paymentTypes";
import type { PaginatedResponse } from "../../../types/paginationTypes";

// Generic DRF field-error shape — same pattern as other typed files.
type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

export type InvoiceStatus = "DRAFT" | "UNPAID" | "PARTIALLY_PAID" | "PAID";

// Backend validates this strictly — any other value returns a 400 with
// "'<value>' is not a valid template. Choose from: classic, standard."
// Kept as a strict union (not a plain string) so invalid values are
// caught at compile time across the whole app.
export type InvoiceTemplate = "classic" | "standard";

// Frozen copy of the business profile, taken once when the invoice is
// first saved on the backend (Invoice.save()) and never overwritten
// after that — even if the user edits their business profile later.
// Read-only: the backend rejects writes to this field regardless of
// what's sent. Logo is a plain URL string here, not a file — the
// backend snapshots business_profile.logo.url at creation time.
export type InvoiceBusinessSnapshot = {
  business_name: string;
  logo: string;
  gst_number: string;
  vat_number: string;
  address: string;
  phone_number: string;
  business_email: string;
  website: string;
};

// -------------------- shared shape --------------------
// This is the full InvoiceSerialzer shape — used for create response,
// detail response, and update (PUT) response. All financial fields
// (subtotal/total_amount/amount_paid/balance_due/status/invoice_number)
// are backend-computed and read-only — never editable in any form.
export type Invoice = {
  id: number;
  user: number;
  client: number | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  business_snapshot: InvoiceBusinessSnapshot;
  invoice_number: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
  currency: string;
  issue_date: string | null;
  due_date: string | null;
  subtotal: string;
  discount: string;
  total_amount: string;
  amount_paid: string;
  balance_due: string;
  payments: PaymentRecord[];
  template: InvoiceTemplate;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

// -------------------- list --------------------
// GET /invoices/
export type InvoicesListResponse = PaginatedResponse<Invoice>;

// -------------------- create --------------------
// POST /invoices/
//
// Rules (from backend clean()):
// - Provide EITHER `client` (existing client id) OR `name` (manual entry).
//   Sending neither raises a validation error. If `client` is provided,
//   any of name/email/phone/address left blank gets auto-filled from the
//   client record on the backend — do not assume the value you sent is the
//   value that comes back, always re-render from the response.
// - `items` is required — send at least an empty array if there truly are
//   none, but in practice an invoice needs items to have any value.
// - `payments` is required too — send `[]` on create, since you can't
//   record a payment before the invoice exists.
// - `template` is optional — omitting it defaults to "classic" on the
//   backend. Only "classic" | "standard" are accepted.
// - Do NOT send status/invoice_number/subtotal/total_amount/amount_paid/
//   balance_due/business_snapshot — they are read-only and will be
//   ignored/rejected.
//
// ⚠️ CORRECTED from Expo's version, which said credit-points were only
// required for template != "classic". Verified directly against
// Invoice.clean() (models.py): the check is
//   `if not self.pk: if ... tier == COMMUNITY and credit_points <= 0: raise`
// — it runs on EVERY new invoice (self.pk is unset before the first
// save), completely independent of which template is chosen. A
// Community-tier user with 0 credit points cannot create ANY new
// invoice, "classic" included. (There's a SEPARATE, narrower check in
// InvoiceSerializer.create() that also blocks template != "classic"
// specifically — but the model-level clean() check already blocks
// template == "classic" too, so in practice the template distinction
// doesn't matter: 0 credit points blocks invoice creation outright.)
// The create-invoice UI should surface this restriction up front — not
// only after the user has picked "standard".
export type CreateInvoiceRequest = {
  client?: number | null;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  currency?: string;
  issue_date?: string | null;
  due_date?: string | null;
  discount?: string;
  template?: InvoiceTemplate;
  items: InvoiceItemRequest[];
  payments: PaymentRecordRequest[];
};

export type CreateInvoiceResponse = Invoice;

// -------------------- detail --------------------
// GET /invoices/{id}/
export type InvoiceDetailResponse = Invoice;

export type InvoiceNotFoundError = {
  detail: string;
};

// -------------------- update --------------------
// PUT /invoices/{id}/ — PATCH is NOT supported by this backend for
// invoices (items/payments become required-field errors without a full
// payload) — always use PUT, always send the FULL items and payments
// arrays (existing entries included, with their `id`, to keep them).
//
// `template` is locked after creation — sending a DIFFERENT value than
// the invoice's current template returns a 400: "Template cannot be
// changed once the invoice is created." Always send back the SAME
// template value you loaded, never let the user edit it on this screen.
export type UpdateInvoiceRequest = CreateInvoiceRequest;

export type UpdateInvoiceResponse = Invoice;

// -------------------- validation errors --------------------
export type InvoiceFieldErrorField =
  | "client"
  | "name"
  | "email"
  | "phone"
  | "address"
  | "currency"
  | "issue_date"
  | "due_date"
  | "discount"
  | "template";

export type InvoiceFieldError = FieldErrors<InvoiceFieldErrorField>;

// items/payments errors are nested arrays, not string arrays — see
// invoiceItemTypes.ts / paymentTypes.ts for their shapes.
export type InvoiceNestedFieldError = {
  items?: InvoiceItemsError | string[];
  payments?: PaymentRecordsError | string[];
};

// The credit-points-exhausted error comes back as a bare top-level array
// of strings, NOT the usual {field: [...]}$ shape — e.g.
// ["You do not have enough credit points to create a new invoice."]
// Check `Array.isArray(errorData)` before treating it as a field-error map.
export type InvoiceNonFieldError = string[];

export type CreateInvoiceError =
  | InvoiceFieldError
  | InvoiceNestedFieldError
  | InvoiceNonFieldError;

export type UpdateInvoiceError = CreateInvoiceError;

// -------------------- delete --------------------
// DELETE /invoices/{id}/ — soft delete (is_active=False), 204 No Content.
