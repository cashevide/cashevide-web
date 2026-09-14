import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateInvoiceApi } from "../api/invoicesApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type {
  UpdateInvoiceRequest,
  UpdateInvoiceResponse,
} from "../types/invoiceTypes";

type UpdateInvoiceVariables = {
  id: number;
  payload: UpdateInvoiceRequest;
};

// No userProfile invalidation here (unlike useCreateInvoice) — verified
// against invoices/signals.py: the credit-points deduction signal checks
// `if not created: return`, so it only fires on invoice creation, never
// on update. Invalidating userProfile on every edit would be unnecessary.
export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation<UpdateInvoiceResponse, Error, UpdateInvoiceVariables>({
    mutationFn: ({ id, payload }) => updateInvoiceApi(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.invoiceDetail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoiceDashboard });
    },
  });
}
