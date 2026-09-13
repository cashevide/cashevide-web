import { useLocation, useNavigate } from "react-router";

import { PillTabs, type PillTabItem } from "../../../components/ui/PillTabs";
import { ROUTES } from "../../../lib/routes";

const TABS: (PillTabItem & { href: string })[] = [
  { key: "invoices", label: "Invoices", href: ROUTES.invoices.list },
  { key: "clients", label: "Clients", href: ROUTES.invoices.clients.list },
  { key: "products", label: "Products", href: ROUTES.invoices.products.list },
];

// Deliberate deviation from Expo: there's no "Dashboard" entry here —
// Dashboard is now its own top-level AppShell tab (see appTabs.ts),
// not the first sub-tab under Invoices.
export function InvoiceSubTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  // Exact match only — each of these routes is a genuine sibling page
  // (not nested under one another the way a tab's own sub-pages are),
  // so there's no need for the prefix-matching AppShell's bottom bar
  // does.
  const activeKey =
    TABS.find((tab) => tab.href === location.pathname)?.key ?? "invoices";

  function handleSelect(key: string) {
    const tab = TABS.find((t) => t.key === key);
    if (tab) {
      navigate(tab.href);
    }
  }

  return (
    <PillTabs items={TABS} activeKey={activeKey} onSelect={handleSelect} />
  );
}
