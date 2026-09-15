import { useThemeStore } from "../../../stores/themeStore";
import { useMalayaliModeStore } from "../../../stores/malayaliModeStore";
import { Container } from "../../../components/layout/Container";
import { ScreenHeader } from "../../../components/layout/ScreenHeader";
import { Text } from "../../../components/ui/Text";
import { Switch } from "../../../components/ui/Switch";
import { Divider } from "../../../components/ui/Divider";

export function AppSettingsContent() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const isMalayaliMode = useMalayaliModeStore((state) => state.isMalayaliMode);
  const setMalayaliMode = useMalayaliModeStore(
    (state) => state.setMalayaliMode,
  );

  const isDarkMode = theme === "dark";

  function handleThemeToggle(value: boolean) {
    setTheme(value ? "dark" : "light");
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader
        title="App Settings"
        showBackButton
        containerVariant="narrow"
      />

      <Container variant="narrow" scroll>
        <div className="w-full max-w-narrow mx-auto px-6 py-6 flex flex-col gap-6">
          {/* Same grouped-card row pattern as SettingsContent /
              SecuritySettingsContent — both app-level preferences share
              one card, with a divider between them, rather than each
              being its own separate card. */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex flex-row items-center justify-between py-3.5 px-4">
              <Text variant="body">Dark Mode</Text>
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                ariaLabel="Toggle dark mode"
              />
            </div>

            <div className="pl-4 pr-4">
              <Divider fade />
            </div>

            <div className="flex flex-row items-center justify-between py-3.5 px-4">
              <Text variant="body">Malayali Mode</Text>
              <Switch
                value={isMalayaliMode}
                onValueChange={setMalayaliMode}
                ariaLabel="Toggle Malayali mode"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
