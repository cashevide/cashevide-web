import { Container } from "../../../../../components/layout/Container";
import { Text } from "../../../../../components/ui/Text";

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
      </div>
    </Container>
  );
}
