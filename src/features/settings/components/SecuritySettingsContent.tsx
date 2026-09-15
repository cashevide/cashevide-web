import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";

import { ROUTES } from "../../../lib/routes";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";

type SecurityMenuItem = {
  label: string;
  onClick: () => void;
};

function SecurityRow({ label, onClick }: SecurityMenuItem) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex flex-row items-center justify-between py-3.5 px-4 cursor-pointer hover:bg-secondary/30"
    >
      <Text variant="body">{label}</Text>
      <ChevronRight size={18} className="text-muted-foreground" />
    </button>
  );
}

export function SecuritySettingsContent() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader
        title="Security"
        showBackButton
        containerVariant="desktop"
      />

      <Container variant="desktop" scroll>
        <div className="w-full max-w-narrow mx-auto px-6 py-6 flex flex-col gap-6">
          {/* Same grouped-card pattern as SettingsContent — one row
              today, but built to hold more (2FA, login history, etc.)
              without restructuring. */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <SecurityRow
              label="Change Password"
              onClick={() =>
                navigate(ROUTES.settings.security.changePassword)
              }
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
