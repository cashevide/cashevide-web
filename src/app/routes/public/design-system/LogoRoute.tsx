import { Container } from "../../../../components/layout/Container";
import { Text } from "../../../../components/ui/Text";
import { Logo } from "../../../../components/ui/Logo";

export function LogoRoute() {
  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-6 py-12 px-6">
        <Text variant="title">Logo</Text>

        <div className="flex flex-row flex-wrap items-end gap-8 border-b border-border py-5">
          <div className="flex flex-col items-center gap-2">
            <Logo width={40} />
            <Text variant="caption" className="text-muted-foreground">
              40px
            </Text>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Logo width={80} />
            <Text variant="caption" className="text-muted-foreground">
              80px
            </Text>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Logo width={120} />
            <Text variant="caption" className="text-muted-foreground">
              120px
            </Text>
          </div>
        </div>
      </div>
    </Container>
  );
}
