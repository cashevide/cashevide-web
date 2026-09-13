import { api } from "../../../lib/api-client";
import { INVOICE_ENDPOINTS } from "../../../lib/api/endpoints";

import type { InvoiceDashboardResponse } from "../types/invoiceDashboardTypes";

export async function getInvoiceDashboardApi(): Promise<InvoiceDashboardResponse> {
  const response = await api.get<InvoiceDashboardResponse>(
    INVOICE_ENDPOINTS.dashboardAnalytics,
  );

  return response.data;
}
