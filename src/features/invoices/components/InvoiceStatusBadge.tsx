import { Badge } from "../../../components/ui/Badge";

import type { InvoiceStatus } from "../types/invoiceTypes";

type BadgeVariant = "default" | "warning" | "info" | "success";
type StatusConfigEntry = { label: string; variant: BadgeVariant };

const STATUS_CONFIG: Record<InvoiceStatus, StatusConfigEntry> = {
  DRAFT: { label: "Draft", variant: "default" },
  UNPAID: { label: "Unpaid", variant: "warning" },
  PARTIALLY_PAID: { label: "Partially Paid", variant: "info" },
  PAID: { label: "Paid", variant: "success" },
};

type InvoiceStatusBadgeProps = {
  status: InvoiceStatus;
};

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return <Badge label={config.label} variant={config.variant} />;
}
