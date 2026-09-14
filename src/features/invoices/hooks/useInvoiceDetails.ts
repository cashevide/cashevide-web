import { useQuery } from "@tanstack/react-query";

import { getInvoiceDetailApi } from "../api/invoicesApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type { InvoiceDetailResponse } from "../types/invoiceTypes";

export function useInvoiceDetails(
  id: number,
  options: { enabled?: boolean } = {},
) {
  const { enabled = true } = options;

  return useQuery<InvoiceDetailResponse, Error>({
    queryKey: QUERY_KEYS.invoiceDetail(id),
    queryFn: () => getInvoiceDetailApi(id),
    enabled,
  });
}
