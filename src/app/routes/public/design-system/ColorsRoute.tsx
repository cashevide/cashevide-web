import { Container } from "../../../../../components/layout/Container";
import { Text } from "../../../../../components/ui/Text";

const COLOR_GROUPS = [
  {
    label: "Base",
    tokens: [
      { name: "background", className: "bg-background border border-border" },
      { name: "foreground", className: "bg-foreground" },
    ],
  },
  {
    label: "Surfaces",
    tokens: [
      { name: "card", className: "bg-card border border-border" },
      { name: "card-foreground", className: "bg-card-foreground" },
      { name: "popover", className: "bg-popover border border-border" },
      { name: "popover-foreground", className: "bg-popover-foreground" },
      { name: "overlay", className: "bg-overlay" },
    ],
  },
  {
    label: "Brand / Action",
    tokens: [
      { name: "brand", className: "bg-brand" },
      {
        name: "brand-foreground",
        className: "bg-brand-foreground border border-border",
      },
      { name: "primary", className: "bg-primary" },
      {
        name: "primary-foreground",
        className: "bg-primary-foreground border border-border",
      },
      { name: "secondary", className: "bg-secondary" },
      { name: "secondary-foreground", className: "bg-secondary-foreground" },
      { name: "accent", className: "bg-accent" },
      { name: "accent-foreground", className: "bg-accent-foreground" },
      { name: "link", className: "bg-link" },
    ],
  },
  {
    label: "Semantic / Feedback",
    tokens: [
      { name: "destructive", className: "bg-destructive" },
      {
        name: "destructive-foreground",
        className: "bg-destructive-foreground border border-border",
      },
      { name: "destructive-text", className: "bg-destructive-text" },
      { name: "success", className: "bg-success" },
      {
        name: "success-foreground",
        className: "bg-success-foreground border border-border",
      },
      { name: "success-text", className: "bg-success-text" },
      { name: "warning", className: "bg-warning" },
      {
        name: "warning-foreground",
        className: "bg-warning-foreground border border-border",
      },
      { name: "info", className: "bg-info" },
      {
        name: "info-foreground",
        className: "bg-info-foreground border border-border",
      },
    ],
  },
  {
    label: "Muted / Disabled",
    tokens: [
      { name: "muted", className: "bg-muted" },
      { name: "muted-foreground", className: "bg-muted-foreground" },
      { name: "disabled", className: "bg-disabled" },
      { name: "disabled-foreground", className: "bg-disabled-foreground" },
    ],
  },
  {
    label: "UI Elements",
    tokens: [
      { name: "border", className: "bg-border" },
      { name: "input", className: "bg-input" },
      { name: "ring", className: "bg-ring" },
    ],
  },
] as const;

export function ColorsRoute() {
  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-8 py-12 px-6">
        <Text variant="title">Colors</Text>

        <div className="flex flex-col gap-8">
          {COLOR_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-3">
              <Text variant="body-sm" className="text-muted-foreground">
                {group.label}
              </Text>

              <div className="flex flex-row flex-wrap gap-4">
                {group.tokens.map((token) => (
                  <div
                    key={token.name}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`w-16 h-16 rounded-md ${token.className}`}
                    />
                    <Text
                      variant="caption"
                      className="text-muted-foreground text-center w-16"
                    >
                      {token.name}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
