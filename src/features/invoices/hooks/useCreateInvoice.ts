import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createInvoiceApi } from "../api/invoicesApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type {
  CreateInvoiceRequest,
  CreateInvoiceResponse,
} from "../types/invoiceTypes";

// Invalidates three caches on success, all verified against the backend:
// - invoices list: the new invoice needs to appear in it.
// - invoiceDashboard: revenue/balance-due summary changes with a new invoice.
// - userProfile: invoices/signals.py deducts 1 credit point on invoice
//   creation for Community-tier users (template != "classic") — the
//   cached credit balance shown in the UI (CreditBadge) would otherwise
//   go stale after every create. This does NOT apply to updates (the
//   signal only fires on create, `created=True`), so useUpdateInvoice
//   should not invalidate userProfile.
export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation<CreateInvoiceResponse, Error, CreateInvoiceRequest>({
    mutationFn: createInvoiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoiceDashboard });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userProfile });
    },
  });
}
