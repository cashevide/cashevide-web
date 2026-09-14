// Generic DRF PageNumberPagination response shape — every paginated list
// endpoint on this backend returns this exact envelope (verified against
// Cashevide_API.yaml: PaginatedInvoiceList, PaginatedClientList,
// PaginatedProductList, etc. — all identical apart from the `results`
// item type). Use this instead of redefining {count, next, previous,
// results} per feature.
//
// Usage: `PaginatedResponse<Invoice>`, `PaginatedResponse<Client>`, etc.
export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
