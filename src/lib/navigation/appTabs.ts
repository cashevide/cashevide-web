import {
  LayoutDashboard,
  FileText,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

import { ROUTES } from "../routes";

export type AppTabName = "dashboard" | "invoices" | "settings" | "profile";

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
// Deliberate deviation from Expo: Dashboard is its own top-level tab
// here, rather than living inside Invoices as its first sub-tab (see
// InvoiceSubTabs.tsx). Invoices now points straight to the invoice
// list.
//
// Unlike Expo (which used separate outline/solid Heroicons per tab
// for the active/inactive state), Lucide is a single-style,
// stroke-based icon set with no true filled variant — the active
// state is distinguished by icon/text color alone (see AppShell.tsx),
// not by swapping to a different icon.
export const APP_TABS: AppTabConfig[] = [
  {
    name: "dashboard",
    href: ROUTES.dashboard.home,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "invoices",
    href: ROUTES.invoices.list,
    label: "Invoices",
    icon: FileText,
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
