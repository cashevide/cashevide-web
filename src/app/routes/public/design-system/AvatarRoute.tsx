import { Container } from "../../../../components/layout/Container";
import { Text } from "../../../../components/ui/Text";
import { Avatar } from "../../../../components/ui/Avatar";

export function AvatarRoute() {
  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-10 py-12 px-6">
        <Text variant="title">Avatar</Text>

        <div className="flex flex-col gap-3">
          <Text variant="body-sm" className="text-muted-foreground">
            Falls back in order: image → first letter of name → generic icon.
            Used for the profile tab and anywhere a person/business needs a
            picture.
          </Text>

          <div className="flex flex-row items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar imageUri="https://i.pravatar.cc/150?img=12" size={56} />
              <Text variant="body-sm" className="text-muted-foreground">
                Image
              </Text>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Avatar name="Noufal Kadalur" size={56} />
              <Text variant="body-sm" className="text-muted-foreground">
                Initial
              </Text>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Avatar size={56} />
              <Text variant="body-sm" className="text-muted-foreground">
                No image, no name
              </Text>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Text variant="body-sm" className="text-muted-foreground">
            Sizes
          </Text>
          <div className="flex flex-row items-end gap-4">
            <Avatar name="Noufal Kadalur" size={20} />
            <Avatar name="Noufal Kadalur" size={32} />
            <Avatar name="Noufal Kadalur" size={48} />
            <Avatar name="Noufal Kadalur" size={72} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Text variant="body-sm" className="text-muted-foreground">
            Shape — circle (people) vs square (businesses/logos)
          </Text>
          <div className="flex flex-row items-center gap-6">
            <Avatar name="Cashevide" shape="circle" size={56} />
            <Avatar name="Cashevide" shape="square" size={56} />
            <Avatar
              imageUri="https://i.pravatar.cc/150?img=33"
              shape="square"
              size={56}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
