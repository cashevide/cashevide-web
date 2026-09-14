// Generic DRF field-error shape — same pattern as other typed files.
type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

// -------------------- shared shape --------------------
// This is what comes back nested inside an Invoice (create/detail/update
// responses). `total` is a backend GeneratedField (quantity * unit_price) —
// always read-only, never send this to the backend.
export type InvoiceItem = {
  id: number;
  invoice: number;
  product: number | null;
  title: string;
  description: string;
  quantity: string;
  unit_type: "QTY" | "HRS" | "DAYS";
  unit_price: string;
  total: string;
  created_at: string;
  updated_at: string;
};

// -------------------- request shape (nested inside Invoice create/update) --------------------
// Used inside InvoiceRequest.items[] — never sent as a standalone request,
// there is no separate invoice-items endpoint.
//
// Rules (from backend clean()):
// - If `product` is omitted, `title` AND `unit_price` are required.
// - If `product` is set, title/description/unit_price are auto-filled from
//   the product for any field left empty — do not assume the value you sent
//   is the value that comes back.
// - `id` present + matches an existing item on this invoice -> updates it.
// - `id` absent, or present but not matching -> creates a new item (old one
//   with that id gets deleted if it's not in the array anymore).
// - On PUT, always send the FULL items array — omitting it entirely causes
//   a top-level "items: This field is required." error. To keep an existing
//   item unchanged, include it with its `id`.
export type InvoiceItemRequest = {
  id?: number;
  product?: number | null;
  title?: string;
  description?: string;
  quantity?: string;
  unit_type?: "QTY" | "HRS" | "DAYS";
  unit_price?: string;
};

// -------------------- validation errors --------------------
// Item-level field errors, same DRF shape as everywhere else.
export type InvoiceItemFieldErrorField =
  | "product"
  | "title"
  | "description"
  | "quantity"
  | "unit_type"
  | "unit_price";

export type InvoiceItemFieldError = FieldErrors<InvoiceItemFieldErrorField>;

// If a malformed value is sent in place of an item object (e.g. a raw
// number instead of a dict), the backend returns this shape instead.
export type InvoiceItemNonFieldError = {
  non_field_errors: string[];
};

// The `items` array in a create/update error response is an array where
// each index lines up with the item at that index in the request — an
// empty object `{}` at an index means that item had no errors.
export type InvoiceItemsError = (
  | InvoiceItemFieldError
  | InvoiceItemNonFieldError
)[];
