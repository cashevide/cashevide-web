import { Text } from "../../../components/ui/Text";
import {
  formatDashboardAmountParts,
  isBucketEmpty,
} from "../utils/invoiceDashboardUtils";

import type { CurrencyAmountMap } from "../types/invoiceDashboardTypes";

type DashboardReceivedCardProps = {
  totalRevenue: CurrencyAmountMap;
  currency: string;
};

export function DashboardReceivedCard({
  totalRevenue,
  currency,
}: DashboardReceivedCardProps) {
  const isEmpty = isBucketEmpty(totalRevenue);
  const amount = totalRevenue[currency] ?? 0;
  const parts = formatDashboardAmountParts(amount, currency);

  return (
    <div className="flex-none w-full flex flex-col justify-between min-h-[120px] bg-success/15 border border-success/30 rounded-lg p-5 gap-1">
      <Text variant="overline" className="text-success-text">
        Total Received
      </Text>

      {isEmpty ? (
        <Text variant="title" className="text-success-text" numeric>
          —
        </Text>
      ) : parts.isSymbol ? (
        <Text variant="title" className="text-success-text" numeric>
          {parts.currency}
          {parts.value}
        </Text>
      ) : (
        <div className="flex flex-row items-baseline gap-1.5">
          <Text variant="body-sm" className="text-success-text" numeric>
            {parts.currency}
          </Text>
          <Text variant="title" className="text-success-text" numeric>
            {parts.value}
          </Text>
        </div>
      )}
    </div>
  );
}
