import { Container } from "../../../../../components/layout/Container";
import { Text } from "../../../../../components/ui/Text";
import { Badge } from "../../../../../components/ui/Badge";

// No Expo equivalent — Badge is a new component in this project, so
// this page is freshly written to match the existing design-system
// page style (title + heading sections), not ported from anywhere.
const BADGE_VARIANTS = [
  "default",
  "brand",
  "success",
  "warning",
  "info",
  "destructive",
] as const;

export function BadgeRoute() {
  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-10 py-12 px-6">
        <Text variant="title">Badge</Text>

        <div className="flex flex-col gap-6">
          <Text variant="heading">Variants</Text>

          <div className="flex flex-row flex-wrap items-center gap-4 border-b border-border py-5">
            {BADGE_VARIANTS.map((variant) => (
              <Badge key={variant} variant={variant} label={variant} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Text variant="heading">In Context</Text>

          <Text variant="body-sm" className="text-muted-foreground">
            Common placement — status labels next to other content.
          </Text>

          <div className="flex flex-col gap-3 py-5">
            <div className="flex flex-row items-center gap-2">
              <Text variant="body">Invoice #1024</Text>
              <Badge variant="success" label="Paid" />
            </div>
            <div className="flex flex-row items-center gap-2">
              <Text variant="body">Invoice #1025</Text>
              <Badge variant="warning" label="Partially Paid" />
            </div>
            <div className="flex flex-row items-center gap-2">
              <Text variant="body">Invoice #1026</Text>
              <Badge variant="destructive" label="Overdue" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
