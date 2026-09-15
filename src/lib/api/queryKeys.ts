import type { GetInvoicesParams } from "../../features/invoices/api/invoicesApi";
import type { GetClientsParams } from "../../features/clients/api/clientsApi";
import type { GetProductsParams } from "../../features/products/api/productsApi";

export const QUERY_KEYS = {
  userProfile: ["userProfile"] as const,
  businessProfile: ["businessProfile"] as const,
  invoiceDashboard: ["invoiceDashboard"] as const,

  invoices: (params?: GetInvoicesParams) => ["invoices", params] as const,
  invoiceDetail: (id: number) => ["invoiceDetail", id] as const,

  clients: (params?: GetClientsParams) => ["clients", params] as const,
  clientDetail: (slug: string) => ["clientDetail", slug] as const,
  clientUsage: ["clientUsage"] as const,

  products: (params?: GetProductsParams) => ["products", params] as const,
  productDetail: (slug: string) => ["productDetail", slug] as const,
  productUsage: ["productUsage"] as const,
} as const;
