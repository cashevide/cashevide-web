import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";

import { ROUTES } from "../../../lib/routes";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Divider } from "../../../components/ui/Divider";

type LegalMenuItem = {
  label: string;
  onClick: () => void;
};

function LegalRow({ label, onClick }: LegalMenuItem) {
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

export function LegalSettingsContent() {
  const navigate = useNavigate();

  const menuItems: LegalMenuItem[] = [
    {
      label: "Terms of Service",
      onClick: () => navigate(ROUTES.legal.terms),
    },
    {
      label: "Privacy Policy",
      onClick: () => navigate(ROUTES.legal.privacyPolicy),
    },
  ];

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader title="Legal" showBackButton containerVariant="narrow" />

      <Container variant="narrow" scroll>
        <div className="w-full max-w-narrow mx-auto px-6 py-6 flex flex-col gap-6">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {menuItems.map((item, index) => (
              <div key={item.label}>
                <LegalRow label={item.label} onClick={item.onClick} />
                {index < menuItems.length - 1 && (
                  <div className="ml-4">
                    <Divider />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
