import type { GetInvoicesParams } from "../../features/invoices/api/invoicesApi";

export const QUERY_KEYS = {
  userProfile: ["userProfile"] as const,
  businessProfile: ["businessProfile"] as const,
  invoiceDashboard: ["invoiceDashboard"] as const,

  invoices: (params?: GetInvoicesParams) => ["invoices", params] as const,
  invoiceDetail: (id: number) => ["invoiceDetail", id] as const,
} as const;
