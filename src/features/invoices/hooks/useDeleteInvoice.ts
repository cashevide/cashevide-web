import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteInvoiceApi } from "../api/invoicesApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

// Soft delete (backend sets is_active=False, no credit-point refund) —
// invalidates list/detail/dashboard so the deleted invoice drops out of
// view everywhere. No userProfile invalidation: deleting doesn't touch
// credit points (the deduction signal only fires on create).
export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteInvoiceApi(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.invoiceDetail(id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoiceDashboard });
    },
  });
}
