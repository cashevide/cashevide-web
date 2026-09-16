import { Container } from "../../../../components/layout/Container";
import { Text } from "../../../../components/ui/Text";

const TYPOGRAPHY_VARIANTS = [
  { variant: "display", label: "Display" },
  { variant: "title", label: "Title" },
  { variant: "heading", label: "Heading" },
  { variant: "subheading", label: "Subheading" },
  { variant: "body-lg", label: "Body Large" },
  { variant: "body", label: "Body" },
  { variant: "body-sm", label: "Body Small" },
  { variant: "caption", label: "Caption" },
  { variant: "overline", label: "Overline" },
  { variant: "link", label: "Link" },
  { variant: "button", label: "Button" },
] as const;

// Font props — independent of variant (size/weight). numeric switches
// the digit-heavy Space Mono in for figures (amounts, invoice
// numbers); malayalam switches in Anek Malayalam for Malayali Mode's
// Kerala-themed content spots. Shown at "title" size here since
// that's roughly where each is actually used (dashboard amounts,
// promo card text) — the props themselves work at any variant.
const FONT_VARIANTS = [
  {
    prop: "numeric" as const,
    label: "Numeric (Space Mono)",
    sample: "₹1,24,500.00",
  },
  {
    prop: "malayalam" as const,
    label: "Malayalam (Anek Malayalam)",
    sample: "എല്ലാവരും app share ചെയ്യൂ",
  },
] as const;

export function TextRoute() {
  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-6 py-12 px-6">
        <Text variant="title">Text</Text>

        <div className="flex flex-col gap-1">
          {TYPOGRAPHY_VARIANTS.map(({ variant, label }) => (
            <div
              key={variant}
              className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8 border-b border-border py-4"
            >
              <Text
                variant="caption"
                className="md:w-28 md:shrink-0 text-muted-foreground"
              >
                {label}
              </Text>

              <div className="flex-1">
                <Text
                  variant={variant}
                  className={variant === "button" ? "text-foreground" : ""}
                >
                  The quick brown fox jumps
                </Text>
              </div>

              <Text
                variant="overline"
                className="md:shrink-0 text-muted-foreground"
              >
                {variant}
              </Text>
            </div>
          ))}
        </div>

        <Text variant="title">Font Variants</Text>

        {/* numeric and malayalam are boolean props on Text (and on
            Button, which passes malayalam through to its own internal
            Text) — they swap the font family only, independent of
            variant. Callers decide when to apply them (Text itself
            doesn't read app state), e.g.:
              <Text variant="title" numeric>{amount}</Text>
              <Text variant="body-lg" malayalam={isMalayaliMode}>{title}</Text> */}
        <div className="flex flex-col gap-1">
          {FONT_VARIANTS.map(({ prop, label, sample }) => (
            <div
              key={prop}
              className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8 border-b border-border py-4"
            >
              <Text
                variant="caption"
                className="md:w-56 md:shrink-0 text-muted-foreground"
              >
                {label}
              </Text>

              <div className="flex-1">
                <Text
                  variant="title"
                  numeric={prop === "numeric"}
                  malayalam={prop === "malayalam"}
                >
                  {sample}
                </Text>
              </div>

              <Text
                variant="overline"
                className="md:shrink-0 text-muted-foreground"
              >
                {prop}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
