import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";

import { Text } from "../../../../components/ui/Text";
import { Switch } from "../../../../components/ui/Switch";
import { Logo } from "../../../../components/ui/Logo";
import { useThemeStore } from "../../../../stores/themeStore";

const NAV_ITEMS = [
  { label: "Overview", href: "/design-system" },
  { label: "Logo", href: "/design-system/logo" },
  { label: "Colors", href: "/design-system/colors" },
  { label: "Text", href: "/design-system/text" },
  { label: "Buttons", href: "/design-system/buttons" },
  { label: "Inputs", href: "/design-system/inputs" },
  { label: "Checkbox", href: "/design-system/checkbox" },
  { label: "Switch", href: "/design-system/switch" },
  { label: "Modal", href: "/design-system/modal" },
  { label: "Pill Tabs", href: "/design-system/pilltabs" },
  { label: "Avatar", href: "/design-system/avatar" },
  { label: "Badge", href: "/design-system/badge" },
  { label: "Divider", href: "/design-system/divider" },
  { label: "Avatar Picker", href: "/design-system/avatarpicker" },
  { label: "Currency Picker", href: "/design-system/currencypicker" },
  { label: "Date Field", href: "/design-system/datefield" },
  { label: "Spinner", href: "/design-system/spinner" },
];
// Note: Star Rating intentionally excluded — it was only ever used by
// the reviews feature, which has been dropped entirely.

const SIDEBAR_OPEN_WIDTH = 240;
const SIDEBAR_CLOSED_WIDTH = 48;
const DESKTOP_BREAKPOINT = 768;

function SidebarToggleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M9 4v16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// Ported from Expo's design-system/_layout.tsx. react-native-reanimated's
// useSharedValue/withTiming for the sidebar's collapse animation is
// replaced with a plain CSS width transition — no extra dependency
// needed for a single animated property on web. useWindowDimensions is
// replaced with a resize listener; usePathname with useLocation.
export function DesignSystemLayout() {
  const [isDesktop, setIsDesktop] = useState(
    () => window.innerWidth >= DESKTOP_BREAKPOINT,
  );
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const location = useLocation();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  function handleResize() {
    const desktop = window.innerWidth >= DESKTOP_BREAKPOINT;
    setIsDesktop(desktop);
  }

  // Attach once; effect-free approach isn't possible here since we need
  // a live window width, but this is a design-system-only page (not
  // shipped in the real app), so a simple addEventListener without a
  // dedicated hook is acceptable rather than over-engineering it.
  if (typeof window !== "undefined") {
    window.onresize = handleResize;
  }

  function toggleSidebar() {
    setSidebarOpen((prev) => !prev);
  }

  const sidebarWidth = sidebarOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH;

  const sidebarContent = (
    <div className="border-r border-border py-4 h-full bg-background flex flex-col">
      <div
        className={`flex flex-row items-center mb-8 ${
          sidebarOpen ? "justify-between px-3" : "justify-center"
        }`}
      >
        {sidebarOpen ? (
          <div className="px-3">
            <Logo width={36} />
          </div>
        ) : null}

        <button
          type="button"
          className="p-1 cursor-pointer text-foreground"
          onClick={toggleSidebar}
        >
          <SidebarToggleIcon size={18} />
        </button>
      </div>

      {sidebarOpen ? (
        <div className="px-3 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => {
                  if (!isDesktop) {
                    setSidebarOpen(false);
                  }
                }}
                className={`px-3 py-2 rounded-md ${
                  isActive ? "bg-secondary" : ""
                }`}
              >
                <Text
                  variant="body-sm"
                  className={
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {item.label}
                </Text>
              </NavLink>
            );
          })}
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-row bg-background">
      {isDesktop ? (
        <div
          style={{ width: sidebarWidth, transition: "width 220ms ease" }}
          className="overflow-hidden shrink-0"
        >
          {sidebarContent}
        </div>
      ) : (
        <>
          <div style={{ width: SIDEBAR_CLOSED_WIDTH }} className="shrink-0">
            {!sidebarOpen ? sidebarContent : null}
          </div>

          {sidebarOpen ? (
            <div
              style={{
                width: sidebarWidth,
                transition: "width 220ms ease",
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                zIndex: 20,
              }}
              className="overflow-hidden"
            >
              {sidebarContent}
            </div>
          ) : null}

          {sidebarOpen ? (
            <div
              className="fixed inset-0 bg-overlay/40 z-10"
              onClick={toggleSidebar}
            />
          ) : null}
        </>
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex flex-row items-center justify-between px-8 h-16 shrink-0">
          <Text variant="body-lg" className="font-semibold">
            Design System
          </Text>

          <div className="flex flex-row items-center gap-4">
            <Text variant="body-sm">Dark mode</Text>
            <Switch
              value={theme === "dark"}
              onValueChange={(next) => setTheme(next ? "dark" : "light")}
              ariaLabel="Toggle dark mode"
            />
          </div>
        </div>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
