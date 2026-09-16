import { Text } from "../../../components/ui/Text";
import { formatDashboardAmountParts } from "../utils/invoiceDashboardUtils";

import type { CurrencyAmountMap } from "../types/invoiceDashboardTypes";

type DashboardSummaryCardProps = {
  thisMonth: CurrencyAmountMap;
  lastMonth: CurrencyAmountMap;
  lastThreeMonths: CurrencyAmountMap;
  thisYear: CurrencyAmountMap;
  lastYear: CurrencyAmountMap;
  currency: string;
};

// All five stats share one equal-sized card style now (no featured/
// small split). The padding (p-5) and min-h-[120px] are deliberately
// the same as DashboardReceivedCard / DashboardBalanceDueCard, and
// justify-between pins the label to the top and the amount to the
// bottom in the same "dashboard tile" arrangement — so these cards
// render at the same height and read the same way as the received/
// balance cards they sit beside in the two-column desktop layout.
// Amount formatting (formatDashboardAmountParts, symbol-vs-code
// rendering) also matches those two cards, for the same reason.
function Stat({
  label,
  bucket,
  currency,
}: {
  label: string;
  bucket: CurrencyAmountMap;
  currency: string;
}) {
  const amount = bucket[currency];
  const parts =
    amount != null ? formatDashboardAmountParts(amount, currency) : null;

  return (
    <div className="flex flex-col items-start justify-between min-h-[120px] bg-card border border-border rounded-lg p-5 gap-1">
      <Text
        variant="body-sm"
        className="text-muted-foreground text-xs uppercase tracking-widest font-bold"
      >
        {label}
      </Text>
      {parts == null ? (
        <Text variant="caption">N/A</Text>
      ) : parts.isSymbol ? (
        <Text variant="title" numeric>
          {parts.currency}
          {parts.value}
        </Text>
      ) : (
        <div className="flex flex-row items-baseline gap-1.5">
          <Text variant="body-sm" numeric>
            {parts.currency}
          </Text>
          <Text variant="title" numeric>
            {parts.value}
          </Text>
        </div>
      )}
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
  const monthStats = [
    { label: "This Month", bucket: thisMonth },
    { label: "Last Month", bucket: lastMonth },
    { label: "Last 3 Months", bucket: lastThreeMonths },
  ];
  const yearStats = [
    { label: "This Year", bucket: thisYear },
    { label: "Last Year", bucket: lastYear },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {monthStats.map((stat) => (
          <Stat
            key={stat.label}
            label={stat.label}
            bucket={stat.bucket}
            currency={currency}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {yearStats.map((stat) => (
          <Stat
            key={stat.label}
            label={stat.label}
            bucket={stat.bucket}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
}
