import { Text } from "../../../components/ui/Text";
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

// The featured stat (This Month) gets its own larger card spanning
// the full width of the top row — the most immediately relevant
// number, so it reads first. The other four sit below as an even
// row of equal-sized cards. Together the two rows read as one
// square-ish block rather than an odd number of mismatched tiles:
// 5 cards can't divide evenly into a clean grid on their own (a
// plain 2-per-row wrap always leaves one card alone on its own row),
// so grouping them as 1-large + 4-small sidesteps that entirely.
function FeaturedStat({
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
    <div className="flex flex-col items-start justify-center bg-card border border-border rounded-lg px-5 py-4 gap-1">
      <Text
        variant="body-sm"
        className="text-muted-foreground text-xs uppercase tracking-widest font-bold"
      >
        {label}
      </Text>
      <Text variant="heading">{formattedAmount}</Text>
    </div>
  );
}

function SmallStat({
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
    <div className="flex flex-col items-start justify-center bg-card border border-border rounded-lg px-3 py-3 gap-0.5">
      <Text
        variant="caption"
        className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold"
      >
        {label}
      </Text>
      <Text variant="body-sm" className="font-semibold">
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
  const smallStats = [
    { label: "Last Month", bucket: lastMonth },
    { label: "Last 3 Months", bucket: lastThreeMonths },
    { label: "This Year", bucket: thisYear },
    { label: "Last Year", bucket: lastYear },
  ];

  return (
    <div className="flex flex-col gap-2">
      <FeaturedStat label="This Month" bucket={thisMonth} currency={currency} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {smallStats.map((stat) => (
          <SmallStat
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
