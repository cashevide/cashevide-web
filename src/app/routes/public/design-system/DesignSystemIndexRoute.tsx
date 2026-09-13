import { Link } from "react-router";

import { Container } from "../../../../components/layout/Container";
import { Text } from "../../../../components/ui/Text";

const SECTIONS = [
  {
    title: "Logo",
    description: "Brand mark in multiple sizes",
    href: "/design-system/logo",
  },
  {
    title: "Colors",
    description: "Semantic color tokens for light and dark mode",
    href: "/design-system/colors",
  },
  {
    title: "Text",
    description: "Typography scale from display to caption",
    href: "/design-system/text",
  },
  {
    title: "Buttons",
    description: "Variants, sizes, icon buttons, loading and disabled states",
    href: "/design-system/buttons",
  },
  {
    title: "Inputs",
    description: "Text fields with error, success, and password states",
    href: "/design-system/inputs",
  },
  {
    title: "Checkbox",
    description: "Checkbox control with checked, unchecked, and label states",
    href: "/design-system/checkbox",
  },
  {
    title: "Switch",
    description: "Toggle control with enabled, disabled, and label states",
    href: "/design-system/switch",
  },
  {
    title: "Modal",
    description: "Dismissible dialog with optional footer actions",
    href: "/design-system/modal",
  },
  {
    title: "Pill Tabs",
    description: "Horizontal pill tabs for navigation and filter selection",
    href: "/design-system/pilltabs",
  },
  {
    title: "Avatar",
    description: "Image, initial-letter, and generic-icon fallback chain",
    href: "/design-system/avatar",
  },
  {
    title: "Badge",
    description: "Small status/label pill in several semantic colors",
    href: "/design-system/badge",
  },
  {
    title: "Divider",
    description: "Horizontal/vertical separator lines, with an optional label",
    href: "/design-system/divider",
  },
  {
    title: "Avatar Picker",
    description: "Pick, preview, and remove a profile image with upload states",
    href: "/design-system/avatarpicker",
  },
  {
    title: "Currency Picker",
    description: "Searchable country/currency picker in a modal sheet",
    href: "/design-system/currencypicker",
  },
  {
    title: "Date Field",
    description: "Typed DD/MM/YYYY date input with a calendar picker",
    href: "/design-system/datefield",
  },
  {
    title: "Spinner",
    description: "Loading indicator in small and large sizes",
    href: "/design-system/spinner",
  },
] as const;
// Note: Star Rating intentionally excluded — see DesignSystemLayout.tsx.

export function DesignSystemIndexRoute() {
  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-10 py-12 px-6">
        <div className="flex flex-col gap-2">
          <Text variant="title">Cashevide Design System</Text>
          <Text variant="body" className="text-muted-foreground">
            Reference for colors, typography, and reusable UI components used
            across the app.
          </Text>
        </div>

        <div className="flex flex-col gap-3">
          {SECTIONS.map((section) => (
            <Link
              key={section.title}
              to={section.href}
              className="flex flex-col gap-1 bg-card border border-border rounded-lg p-4"
            >
              <Text variant="body-lg" className="font-semibold">
                {section.title}
              </Text>
              <Text variant="body-sm" className="text-muted-foreground">
                {section.description}
              </Text>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
