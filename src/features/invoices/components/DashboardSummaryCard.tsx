import { Text } from "../../../components/ui/Text";
import { cn } from "../../../utils/cn";
import { formatDashboardAmount } from "../utils/invoiceDashboardUtils";

import type { CurrencyAmountMap } from "../types/invoiceDashboardTypes";

type DashboardSummaryCardProps = {
  thisMonth: CurrencyAmountMap;
  lastMonth: CurrencyAmountMap;
  lastThreeMonths: CurrencyAmountMap;
  thisYear: CurrencyAmountMap;
  lastYear: CurrencyAmountMap;
  currency: string;
};

// Expo's version rendered this as a plain list row on native (label
// left, amount right, hairline divider) and a standalone grid cell on
// web (stacked label-over-amount, mini stat-card look) — since this
// project is web-only, only the grid-cell rendering is kept.
function SummaryRow({
  label,
  bucket,
  currency,
}: {
  label: string;
  bucket: CurrencyAmountMap;
  currency: string;
}) {
  const amount = bucket[currency];
  const formattedAmount =
    amount != null ? formatDashboardAmount(amount, currency) : "—";

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center",
        "w-[calc(50%-8px)]",
        "bg-background/40 border border-border/50 rounded-md",
        "px-4 py-3 gap-1",
      )}
    >
      <Text
        variant="body-sm"
        className="text-muted-foreground text-xs uppercase tracking-widest font-bold"
      >
        {label}
      </Text>
      <Text variant="body-sm" className="font-semibold text-lg text-left">
        {formattedAmount}
      </Text>
    </div>
  );
}

export function DashboardSummaryCard({
  thisMonth,
  lastMonth,
  lastThreeMonths,
  thisYear,
  lastYear,
  currency,
}: DashboardSummaryCardProps) {
  const rows = [
    { label: "This Month", bucket: thisMonth },
    { label: "Last Month", bucket: lastMonth },
    { label: "Last 3 Months", bucket: lastThreeMonths },
    { label: "This Year", bucket: thisYear },
    { label: "Last Year", bucket: lastYear },
  ];

  return (
    <div className="flex-1 flex flex-col bg-card border border-border rounded-lg p-5 gap-2">
      <Text variant="body-sm" className="font-semibold mb-1">
        Revenue Breakdown
      </Text>

      <div className="flex flex-row flex-wrap gap-2">
        {rows.map((row) => (
          <SummaryRow
            key={row.label}
            label={row.label}
            bucket={row.bucket}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
}
