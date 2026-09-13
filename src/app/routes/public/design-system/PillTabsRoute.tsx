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

export function PillTabsRoute() {
  const [section, setSection] = useState("dashboard");
  const [currency, setCurrency] = useState("INR");
  const [status, setStatus] = useState("all");

  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-10 py-12 px-6">
        <Text variant="title">Pill Tabs</Text>

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
    </Container>
  );
}
