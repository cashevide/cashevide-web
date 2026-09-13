import { PillTabs } from "../../../components/ui/PillTabs";

type DashboardCurrencyTabsProps = {
  currencies: string[];
  selectedCurrency: string | null;
  onSelect: (currency: string) => void;
};

export function DashboardCurrencyTabs({
  currencies,
  selectedCurrency,
  onSelect,
}: DashboardCurrencyTabsProps) {
  if (currencies.length === 0) {
    return null;
  }

  const activeCurrency = selectedCurrency ?? currencies[0];
  const items = currencies.map((currency) => ({
    key: currency,
    label: currency,
  }));

  return (
    <PillTabs
      items={items}
      activeKey={activeCurrency}
      onSelect={onSelect}
      layout="segmented"
    />
  );
}
