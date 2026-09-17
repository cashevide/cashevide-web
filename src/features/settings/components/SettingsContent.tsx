import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronRight,
  UserCircle,
  ShieldCheck,
  Palette,
  Scale,
  UserPlus,
  Coffee,
  type LucideIcon,
} from "lucide-react";

import { useLogout } from "../../auth/hooks/useLogout";
import { useUserProfile } from "../../profile/hooks/useUserProfile";
import { ROUTES } from "../../../lib/routes";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Divider } from "../../../components/ui/Divider";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { CreditPointsDialog } from "../../../components/ui/CreditPointsDialog";
import { SupportFlow } from "../../donation/components/SupportFlow";

type SettingsMenuItem = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
};

// Still a navigation row, not an info-display row — InfoListRow is for
// static label/value fields (Business Profile, Account details), this
// is a clickable menu item that always ends in a chevron and never
// shows a value. Only the icon badge is borrowed from InfoListRow's
// visual language, for consistency across the two, not the row's
// underlying meaning.
function SettingsRow({ icon: Icon, label, onClick }: SettingsMenuItem) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex flex-row items-center gap-3 py-3 px-4 cursor-pointer hover:bg-secondary/30"
    >
      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary">
        <Icon size={18} className="text-muted-foreground" />
      </div>

      <Text variant="body" className="flex-1 text-left">
        {label}
      </Text>

      <ChevronRight size={18} className="text-muted-foreground" />
    </button>
  );
}

// Renders one "grouped table" card of SettingsRow items with dividers
// between them — factored out so the core settings card and the
// support-actions card below share identical markup instead of the
// map+divider JSX being duplicated for each group.
function SettingsGroup({ items }: { items: SettingsMenuItem[] }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {items.map((item, index) => (
        <div key={item.label}>
          <SettingsRow
            icon={item.icon}
            label={item.label}
            onClick={item.onClick}
          />
          {index < items.length - 1 && (
            <div className="pl-16 pr-4">
              <Divider fade />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function SettingsContent() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isSupportFlowOpen, setIsSupportFlowOpen] = useState(false);
  const logoutMutation = useLogout();
  const userProfile = useUserProfile();

  const menuItems: SettingsMenuItem[] = [
    {
      icon: UserCircle,
      label: "Account",
      onClick: () => navigate(ROUTES.settings.account),
    },
    {
      icon: ShieldCheck,
      label: "Security",
      onClick: () => navigate(ROUTES.settings.security.entry),
    },
    {
      icon: Palette,
      label: "App Settings",
      onClick: () => navigate(ROUTES.settings.app),
    },
    {
      icon: Scale,
      label: "Legal",
      onClick: () => navigate(ROUTES.settings.legal),
    },
  ];

  // Separate card from the core settings menu above — these two rows
  // are "support the app" actions (grow it / fund it), not app
  // configuration, so grouping them with Account/Security/etc. would
  // mix unrelated categories under one heading.
  const supportItems: SettingsMenuItem[] = [
    {
      icon: UserPlus,
      label: "Invite Friends",
      onClick: () => setIsInviteDialogOpen(true),
    },
    {
      icon: Coffee,
      label: "Buy Me a Coffee",
      onClick: () => setIsSupportFlowOpen(true),
    },
  ];

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader title="Settings" />

      <Container variant="desktop" scroll>
        <div className="w-full max-w-narrow mx-auto px-6 py-6 flex flex-col gap-6">
          {/* Grouped settings card — iOS/Material "grouped table" pattern:
              related rows share one card with dividers between them,
              rather than each row being its own separate card. */}
          <SettingsGroup items={menuItems} />

          {/* Separate card for "support the app" actions — kept apart
              from the core settings card above since these aren't app
              configuration, they're ways to grow/fund Cashevide. */}
          <SettingsGroup items={supportItems} />

          {/* Destructive/singleton action, visually separated from the
              grouped card above it — mirrors how iOS Settings keeps
              "Sign Out" as its own isolated card at the bottom. */}
          <Button
            variant="destructive"
            title="Logout"
            onClick={() => setShowLogoutConfirm(true)}
          />
        </div>
      </Container>

      <ConfirmDialog
        visible={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        destructive
        isConfirming={logoutMutation.isPending}
        onConfirm={() => logoutMutation.mutate()}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <CreditPointsDialog
        visible={isInviteDialogOpen}
        points={userProfile.data?.credit_points ?? 0}
        onDismiss={() => setIsInviteDialogOpen(false)}
        referralCode={userProfile.data?.referral_code}
      />

      <SupportFlow
        open={isSupportFlowOpen}
        onDone={() => setIsSupportFlowOpen(false)}
      />
    </div>
  );
}
