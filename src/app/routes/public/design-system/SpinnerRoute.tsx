import { Container } from "../../../../components/layout/Container";
import { Text } from "../../../../components/ui/Text";
import { Spinner } from "../../../../components/ui/Spinner";

export function SpinnerRoute() {
  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-14 py-12 px-6">
        <Text variant="title">Spinner</Text>

        {/* Sizes */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Sizes</Text>

          {/* Unlike Expo's version (which wrapped React Native's
              ActivityIndicator, where "sm" and "default" both rendered
              as the same native "small" size), this is a CSS-based
              spinner — all three sizes render visually distinct. */}
          <Text variant="body-sm" className="text-muted-foreground">
            CSS-based spinner — sm, default, and lg are all visually
            distinct sizes.
          </Text>

          <div className="flex flex-row flex-wrap items-end gap-10 border-b border-border py-5">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="sm" />
              <Text variant="caption" className="text-muted-foreground">
                sm
              </Text>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Spinner size="default" />
              <Text variant="caption" className="text-muted-foreground">
                default
              </Text>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" />
              <Text variant="caption" className="text-muted-foreground">
                lg
              </Text>
            </div>
          </div>
        </div>

        {/* Custom color */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Custom Color</Text>

          <div className="flex flex-row flex-wrap items-center gap-10 border-b border-border py-5">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" color="var(--color-primary)" />
              <Text variant="caption" className="text-muted-foreground">
                Primary
              </Text>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" color="var(--color-destructive)" />
              <Text variant="caption" className="text-muted-foreground">
                Destructive
              </Text>
            </div>
          </div>
        </div>

        {/* In context */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">In Context</Text>

          <Text variant="body-sm" className="text-muted-foreground">
            Common placement — inline with text while a request is in flight.
          </Text>

          <div className="flex flex-row items-center gap-2 py-5">
            <Spinner size="sm" />
            <Text variant="body-sm" className="text-muted-foreground">
              Loading...
            </Text>
          </div>
        </div>
      </div>
    </Container>
  );
}
