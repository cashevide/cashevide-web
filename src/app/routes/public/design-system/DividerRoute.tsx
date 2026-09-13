import { Container } from "../../../../../components/layout/Container";
import { Text } from "../../../../../components/ui/Text";
import { Divider } from "../../../../../components/ui/Divider";

// No Expo equivalent — this page is freshly written to match the
// existing design-system page style, not ported from anywhere.
export function DividerRoute() {
  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-10 py-12 px-6">
        <Text variant="title">Divider</Text>

        <div className="flex flex-col gap-6">
          <Text variant="heading">Horizontal</Text>

          <div className="flex flex-col gap-6 border-b border-border py-5">
            <div>
              <Text variant="body-sm" className="text-muted-foreground mb-2">
                Plain
              </Text>
              <Divider />
            </div>

            <div>
              <Text variant="body-sm" className="text-muted-foreground mb-2">
                Fade
              </Text>
              <Divider fade />
            </div>

            <div>
              <Text variant="body-sm" className="text-muted-foreground mb-2">
                With label
              </Text>
              <Divider label="or" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Text variant="heading">Vertical</Text>

          <Text variant="body-sm" className="text-muted-foreground">
            Used inline, e.g. separating the country-code and number fields
            in Phone Number Input.
          </Text>

          <div className="flex flex-row items-center gap-3 h-10 border-b border-border py-5">
            <Text variant="body">Left</Text>
            <Divider orientation="vertical" />
            <Text variant="body">Right</Text>
          </div>
        </div>
      </div>
    </Container>
  );
}
