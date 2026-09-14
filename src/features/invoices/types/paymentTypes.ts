// Generic DRF field-error shape — same pattern as other typed files.
type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

// -------------------- shared shape --------------------
// This is what comes back nested inside an Invoice (create/detail/update
// responses). There is no separate payments endpoint — payments only ever
// exist nested inside an invoice's `payments` array.
export type PaymentRecord = {
  id: number;
  invoice: number;
  amount: string;
  payment_date: string;
  payment_method: string;
  note: string;
  created_at: string;
  updated_at: string;
};

// -------------------- request shape (nested inside Invoice create/update) --------------------
// Used inside InvoiceRequest.payments[].
//
// Rules (same nested-array pattern as items):
// - `amount` and `payment_date` are required per the model (payment_method
//   and note are optional, default to "").
// - `id` present + matches an existing payment on this invoice -> updates it.
// - `id` absent, or present but not matching -> creates a new payment.
// - On PUT, always send the FULL payments array — omitting it entirely
//   causes a top-level "payments: This field is required." error (same as
//   items). To keep an existing payment unchanged, include it with its `id`.
// - Every payment save/delete recalculates the invoice's status and
//   financial totals on the backend (amount_paid, balance_due, status) —
//   never compute these on the frontend, always trust the response.
export type PaymentRecordRequest = {
  id?: number;
  amount: string;
  payment_date: string;
  payment_method?: string;
  note?: string;
};

// -------------------- validation errors --------------------
export type PaymentRecordFieldErrorField =
  | "amount"
  | "payment_date"
  | "payment_method"
  | "note";

export type PaymentRecordFieldError = FieldErrors<PaymentRecordFieldErrorField>;

// Same indexed-array error shape as items — one entry per payment in the
// request, in order. An empty object `{}` at an index means no errors there.
export type PaymentRecordsError = PaymentRecordFieldError[];
