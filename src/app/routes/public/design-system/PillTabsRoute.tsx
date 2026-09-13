import { useState } from "react";

import { Container } from "../../../../components/layout/Container";
import { Text } from "../../../../components/ui/Text";
import { PillTabs } from "../../../../components/ui/PillTabs";

const SECTION_TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "invoices", label: "Invoices" },
  { key: "clients", label: "Clients" },
  { key: "products", label: "Products" },
];

const CURRENCY_TABS = [
  { key: "INR", label: "INR" },
  { key: "USD", label: "USD" },
  { key: "EUR", label: "EUR" },
];

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "unpaid", label: "Unpaid" },
  { key: "partially_paid", label: "Partially Paid" },
  { key: "paid", label: "Paid" },
];

const SEGMENTED_CURRENCY_TABS = [
  { key: "INR", label: "INR" },
  { key: "USD", label: "USD" },
];

const SENTIMENT_TABS = [
  { key: "positive", label: "Positive", variant: "success" as const },
  { key: "negative", label: "Negative", variant: "destructive" as const },
];

export function PillTabsRoute() {
  const [section, setSection] = useState<string | null>("dashboard");
  const [currency, setCurrency] = useState<string | null>("INR");
  const [status, setStatus] = useState<string | null>("all");
  const [segmentedCurrency, setSegmentedCurrency] = useState<string | null>(
    "INR",
  );
  const [sentiment, setSentiment] = useState<string | null>(null);

  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-10 py-12 px-6">
        <Text variant="title">Pill Tabs</Text>

        <div className="flex flex-col gap-6">
          <Text variant="heading">Pills layout</Text>

          <div className="flex flex-col gap-3">
            <Text variant="body-sm" className="text-muted-foreground">
              Navigation — e.g. Invoices tab's Dashboard / Invoices / Clients /
              Products sections
            </Text>
            <PillTabs
              items={SECTION_TABS}
              activeKey={section}
              onSelect={setSection}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Text variant="body-sm" className="text-muted-foreground">
              Filter/selection — e.g. currency switcher on the invoice dashboard
            </Text>
            <PillTabs
              items={CURRENCY_TABS}
              activeKey={currency}
              onSelect={setCurrency}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Text variant="body-sm" className="text-muted-foreground">
              Longer list, horizontally scrollable — e.g. invoice status filter
            </Text>
            <PillTabs
              items={STATUS_TABS}
              activeKey={status}
              onSelect={setStatus}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Text variant="heading">Segmented layout</Text>

          <Text variant="body-sm" className="text-muted-foreground">
            A same-page filter/toggle (not navigation) — a single bordered track
            with tight segments, closer to an iOS segmented control. Used for
            the invoice dashboard's currency switcher.
          </Text>

          <div className="flex flex-col gap-3">
            <Text variant="body-sm" className="text-muted-foreground">
              Neutral — no sentiment tint
            </Text>
            <PillTabs
              items={SEGMENTED_CURRENCY_TABS}
              activeKey={segmentedCurrency}
              onSelect={setSegmentedCurrency}
              layout="segmented"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Text variant="body-sm" className="text-muted-foreground">
              Sentiment tint + nullable — starts with nothing selected, tapping
              the active segment can deselect back to null (the caller's choice
              in onSelect)
            </Text>
            <PillTabs
              items={SENTIMENT_TABS}
              activeKey={sentiment}
              onSelect={(key) =>
                setSentiment((prev) => (prev === key ? null : key))
              }
              layout="segmented"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Text variant="body-sm" className="text-muted-foreground">
              Centered — for a short segmented group narrower than the available
              width
            </Text>
            <PillTabs
              items={SEGMENTED_CURRENCY_TABS}
              activeKey={segmentedCurrency}
              onSelect={setSegmentedCurrency}
              layout="segmented"
              centered
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
