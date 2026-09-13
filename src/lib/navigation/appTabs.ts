import { Home, Settings, User, type LucideIcon } from "lucide-react";

import { ROUTES } from "../routes";

export type AppTabName = "invoices" | "settings" | "profile";

export interface AppTabConfig {
  name: AppTabName;
  href: string;
  label: string;
  icon: LucideIcon;
}

// Order here drives the order tabs render in, both in the mobile
// bottom bar and the desktop sidebar. "reviews" tab intentionally
// dropped — that feature has been removed entirely.
//
// Unlike Expo (which used separate outline/solid Heroicons per tab
// for the active/inactive state), Lucide is a single-style,
// stroke-based icon set with no true filled variant — the active
// state is distinguished by icon/text color alone (see AppShell.tsx),
// not by swapping to a different icon.
export const APP_TABS: AppTabConfig[] = [
  {
    name: "invoices",
    href: ROUTES.invoices.dashboard,
    label: "Invoices",
    icon: Home,
  },
  {
    name: "settings",
    href: ROUTES.settings.home,
    label: "Settings",
    icon: Settings,
  },
  {
    name: "profile",
    href: ROUTES.profile.home,
    label: "Profile",
    icon: User,
  },
];
