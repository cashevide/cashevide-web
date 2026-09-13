import { useQuery } from "@tanstack/react-query";

import { getInvoiceDashboardApi } from "../api/invoiceDashboardApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type { InvoiceDashboardResponse } from "../types/invoiceDashboardTypes";

export function useInvoiceDashboard() {
  return useQuery<InvoiceDashboardResponse, Error>({
    queryKey: QUERY_KEYS.invoiceDashboard,
    queryFn: getInvoiceDashboardApi,
  });
}
