import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link, Outlet, useLocation } from "react-router";

import { cn } from "../../utils/cn";
import { Text } from "../ui/Text";
import { Avatar } from "../ui/Avatar";
import { useThemeStore } from "../../stores/themeStore";
import { useUserProfile } from "../../features/profile/hooks/useUserProfile";
import { APP_TABS, type AppTabConfig } from "../../lib/navigation/appTabs";

const DESKTOP_BREAKPOINT = 768;
const SIDEBAR_WIDTH = 200;
const MOBILE_TAB_SIZE = 44;
const MOBILE_BAR_WIDTH_FRACTION = 0.62;
const MOBILE_BAR_INNER_PADDING = 6;
const MOBILE_BAR_BOTTOM_OFFSET = 12;

// Total vertical footprint of the mobile tab bar: its own height (pill
// content + top/bottom inner padding) plus how far it floats up from
// the screen edge. MobileTabBar is `position: fixed`, so it takes up
// no space in AppShell's flex layout — Outlet gets the full height and
// the bar simply overlays whatever's underneath it. Any scrollable
// page content needs this much bottom padding, or its last bit of
// content ends up permanently hidden behind the bar. Exposed as a CSS
// var (see AppShell below) so Container.tsx's scroll variant, and
// anything else consuming it, don't need to know these px numbers.
const MOBILE_TAB_BAR_SPACE =
  MOBILE_TAB_SIZE + MOBILE_BAR_INNER_PADDING * 2 + MOBILE_BAR_BOTTOM_OFFSET;

// Exact match for a tab's own root ("/settings"), or prefix match for
// any page nested under it ("/settings/account") — otherwise
// navigating to a sub-page would leave nothing highlighted at all.
function isTabActive(pathname: string, tab: AppTabConfig): boolean {
  return pathname === tab.href || pathname.startsWith(`${tab.href}/`);
}

type ProfileSummary = {
  fullName: string | null;
  profilePicture: string | null;
};

interface TabButtonProps {
  tab: AppTabConfig;
  isActive: boolean;
  profile?: ProfileSummary;
  onNavigate?: () => void;
}

function MobileTabButton({
  tab,
  isActive,
  profile,
  onNavigate,
}: TabButtonProps) {
  const Icon = tab.icon;
  const isProfileTab = tab.name === "profile";

  return (
    <Link
      to={tab.href}
      onClick={onNavigate}
      aria-label={tab.label}
      aria-current={isActive ? "page" : undefined}
      style={{ height: MOBILE_TAB_SIZE }}
      className="relative z-10 flex-1 flex items-center justify-center rounded-full"
    >
      {isProfileTab ? (
        <Avatar
          imageUri={profile?.profilePicture}
          name={profile?.fullName}
          size={20}
        />
      ) : (
        <Icon
          size={22}
          className={isActive ? "text-foreground" : "text-muted-foreground"}
        />
      )}
    </Link>
  );
}

function DesktopTabButton({ tab, isActive, profile }: TabButtonProps) {
  const Icon = tab.icon;
  const isProfileTab = tab.name === "profile";

  return (
    <Link
      to={tab.href}
      aria-label={tab.label}
      aria-current={isActive ? "page" : undefined}
      className="relative z-10 w-full flex flex-row items-center gap-3 rounded-lg px-3 py-2.5"
    >
      {isProfileTab ? (
        <Avatar
          imageUri={profile?.profilePicture}
          name={profile?.fullName}
          size={18}
        />
      ) : (
        <Icon
          size={20}
          className={isActive ? "text-foreground" : "text-muted-foreground"}
        />
      )}
      <Text
        variant="body-sm"
        className={cn(
          "flex-1 text-left",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {tab.label}
      </Text>
    </Link>
  );
}

function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function MobileTabBar() {
  // Ported from Expo's BlurView + react-native-reanimated sliding pill
  // — replaced with CSS backdrop-filter (blur) and a plain transition
  // on transform (no extra animation library needed for one property).
  // useSafeAreaInsets (device notch/home-indicator spacing) has no web
  // equivalent and is dropped; a plain fixed bottom offset is used
  // instead.
  const theme = useThemeStore((state) => state.theme);
  const location = useLocation();
  const screenWidth = useWindowWidth();
  const { data: userProfile } = useUserProfile();

  const activeIndex = APP_TABS.findIndex((tab) =>
    isTabActive(location.pathname, tab),
  );

  // Bar spans a fraction of the screen instead of edge-to-edge — with
  // only 3 icon-only tabs, a full-width bar looked sparse/empty.
  const barWidth = screenWidth * MOBILE_BAR_WIDTH_FRACTION;
  const barInnerWidth = barWidth - MOBILE_BAR_INNER_PADDING * 2;
  const slotWidth = barInnerWidth / APP_TABS.length;

  const profile: ProfileSummary | undefined = userProfile
    ? {
        fullName: userProfile.full_name,
        profilePicture: userProfile.profile_picture,
      }
    : undefined;

  return (
    <div
      className="fixed inset-x-0 flex justify-center"
      style={{ bottom: MOBILE_BAR_BOTTOM_OFFSET, pointerEvents: "none" }}
    >
      <div
        style={{ width: barWidth, pointerEvents: "auto" }}
        className="relative flex flex-row items-center rounded-full border border-border p-1.5 overflow-hidden"
      >
        <div
          className={cn(
            "absolute inset-0 z-0",
            theme === "dark" ? "bg-background/60" : "bg-background/70",
          )}
          style={{ backdropFilter: "blur(16px)" }}
        />

        <div
          aria-hidden="true"
          className="absolute z-0 rounded-full bg-foreground/10"
          style={{
            top: MOBILE_BAR_INNER_PADDING,
            left: MOBILE_BAR_INNER_PADDING,
            height: MOBILE_TAB_SIZE,
            width: slotWidth,
            transform: `translateX(${Math.max(activeIndex, 0) * slotWidth}px)`,
            transition: "transform 220ms ease",
            opacity: activeIndex === -1 ? 0 : 1,
          }}
        />

        {APP_TABS.map((tab) => (
          <MobileTabButton
            key={tab.name}
            tab={tab}
            isActive={isTabActive(location.pathname, tab)}
            profile={profile}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopSidebar() {
  const location = useLocation();
  const { data: userProfile } = useUserProfile();

  const profile: ProfileSummary | undefined = userProfile
    ? {
        fullName: userProfile.full_name,
        profilePicture: userProfile.profile_picture,
      }
    : undefined;

  const activeTabName = APP_TABS.find((tab) =>
    isTabActive(location.pathname, tab),
  )?.name;

  // Same sliding-highlight idea as PillTabs and the mobile tab bar,
  // but vertical (translateY) instead of horizontal — sidebar items
  // stack top-to-bottom and are all full-width, so only their
  // vertical position/height varies (not left/width).
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [highlightStyle, setHighlightStyle] = useState<{
    offsetY: number;
    height: number;
  } | null>(null);

  useLayoutEffect(() => {
    const trackEl = trackRef.current;
    const activeEl = activeTabName
      ? buttonRefs.current.get(activeTabName)
      : null;

    if (!trackEl || !activeEl) {
      setHighlightStyle(null);
      return;
    }

    const trackRect = trackEl.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    setHighlightStyle({
      offsetY: activeRect.top - trackRect.top,
      height: activeRect.height,
    });
  }, [activeTabName]);

  return (
    <div className="shrink-0 py-4 pl-4">
      <div
        ref={trackRef}
        style={{ width: SIDEBAR_WIDTH }}
        className="relative h-full flex flex-col gap-1 rounded-lg bg-secondary border border-border shadow-lg px-3 py-6"
      >
        {highlightStyle && (
          <div
            aria-hidden="true"
            className="absolute left-3 right-3 top-0 z-0 rounded-lg bg-foreground/10"
            style={{
              height: highlightStyle.height,
              transform: `translateY(${highlightStyle.offsetY}px)`,
              transition: "transform 220ms ease",
            }}
          />
        )}

        {APP_TABS.map((tab) => (
          <div
            key={tab.name}
            ref={(el) => {
              if (el) buttonRefs.current.set(tab.name, el);
              else buttonRefs.current.delete(tab.name);
            }}
          >
            <DesktopTabButton
              tab={tab}
              isActive={isTabActive(location.pathname, tab)}
              profile={profile}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Shell for the whole authenticated area — desktop sidebar (768px+) or
// a floating mobile bottom tab bar, wrapping whichever tab's page is
// currently active via <Outlet />. Ported from Expo's AppShell.tsx,
// which used expo-router/ui's Tabs/TabList/TabTrigger/TabSlot; that
// whole API is React Native-specific with no web equivalent, so this
// is rebuilt directly on React Router's Outlet + useLocation instead
// (the same pathname-based active-tab detection PillTabs.tsx already
// uses elsewhere in this app).
export function AppShell() {
  const width = useWindowWidth();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  return (
    // h-dvh (not h-screen) — see Container.tsx's min-h-dvh comment.
    // h-screen is 100vh, sized as if the mobile address bar is
    // hidden; with overflow-hidden here, that mismatch either clips
    // real content (MobileTabBar) or leaves dead space depending on
    // whether the address bar happens to be shown or hidden. h-dvh
    // tracks the actual visible height instead.
    //
    // --mobile-tab-bar-space: exposes MOBILE_TAB_BAR_SPACE (see
    // above) as a CSS var so any scrollable descendant can reserve
    // room for the floating tab bar without hardcoding its pixel
    // values. 0 on desktop, where MobileTabBar isn't rendered at all.
    <div
      className="h-dvh flex flex-col bg-background overflow-hidden"
      style={
        {
          "--mobile-tab-bar-space": isDesktop
            ? "0px"
            : `${MOBILE_TAB_BAR_SPACE}px`,
        } as CSSProperties
      }
    >
      <div className="flex-1 flex flex-row overflow-hidden">
        {isDesktop ? <DesktopSidebar /> : null}

        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>

      {!isDesktop ? <MobileTabBar /> : null}
    </div>
  );
}
