import { useLocation, useNavigate } from "react-router";

import { PillTabs, type PillTabItem } from "../../../components/ui/PillTabs";
import { ROUTES } from "../../../lib/routes";

const TABS: (PillTabItem & {
  href: typeof ROUTES.profile.home | typeof ROUTES.profile.business;
})[] = [
  { key: "personal", label: "Personal", href: ROUTES.profile.home },
  { key: "business", label: "Business", href: ROUTES.profile.business },
];

export function ProfileSubTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey =
    TABS.find((tab) => tab.href === location.pathname)?.key ?? "personal";

  function handleSelect(key: string) {
    const tab = TABS.find((t) => t.key === key);
    if (tab) {
      navigate(tab.href);
    }
  }

  return (
    <PillTabs
      items={TABS}
      activeKey={activeKey}
      onSelect={handleSelect}
      centered
      layout="segmented"
    />
  );
}
