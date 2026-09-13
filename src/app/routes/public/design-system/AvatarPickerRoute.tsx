import { useState } from "react";

import { Container } from "../../../../components/layout/Container";
import { Text } from "../../../../components/ui/Text";
import { Button } from "../../../../components/ui/Button";
import { AvatarPicker } from "../../../../components/ui/AvatarPicker";

export function AvatarPickerRoute() {
  const [circleImageUri, setCircleImageUri] = useState<string | null>(
    "https://i.pravatar.cc/150?img=12",
  );
  const [squareImageUri, setSquareImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-14 py-12 px-6">
        <Text variant="title">Avatar Picker</Text>

        {/* Interactive */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Interactive</Text>

          <div className="flex flex-row flex-wrap items-start gap-10 pt-5 pb-14 border-b border-border">
            <div className="flex flex-col items-center gap-3">
              <AvatarPicker
                imageUri={circleImageUri}
                onPick={(file) => setCircleImageUri(URL.createObjectURL(file))}
                onRemove={() => setCircleImageUri(null)}
                shape="circle"
              />
              <Text variant="caption" className="text-muted-foreground">
                Circle, with image
              </Text>
            </div>

            <div className="flex flex-col items-center gap-3">
              <AvatarPicker
                imageUri={squareImageUri}
                onPick={(file) => setSquareImageUri(URL.createObjectURL(file))}
                onRemove={() => setSquareImageUri(null)}
                shape="square"
                placeholderText="Add Logo"
              />
              <Text variant="caption" className="text-muted-foreground">
                Square, empty
              </Text>
            </div>
          </div>
        </div>

        {/* Upload states */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Upload States</Text>

          <div className="flex flex-row flex-wrap items-start gap-10 pt-5 pb-14 border-b border-border">
            <div className="flex flex-col items-center gap-3">
              <AvatarPicker
                imageUri={null}
                onPick={() => {}}
                isUploading={isUploading}
              />
              <Button
                title="Toggle uploading"
                size="sm"
                variant="outline"
                onClick={() => setIsUploading((prev) => !prev)}
              />
            </div>

            <div className="flex flex-col items-center gap-3">
              <AvatarPicker imageUri={null} onPick={() => {}} isError />
              <Text variant="caption" className="text-muted-foreground">
                isError
              </Text>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Sizes</Text>

          <div className="flex flex-row flex-wrap items-end gap-10 pt-5 pb-14 border-b border-border">
            <div className="flex flex-col items-center gap-3">
              <AvatarPicker
                imageUri="https://i.pravatar.cc/150?img=5"
                onPick={() => {}}
              />
              <Text variant="caption" className="text-muted-foreground">
                Default (80px)
              </Text>
            </div>

            <div className="flex flex-col items-center gap-3">
              <AvatarPicker
                imageUri="https://i.pravatar.cc/150?img=8"
                onPick={() => {}}
                size={112}
              />
              <Text variant="caption" className="text-muted-foreground">
                size=112 — used on Personal Profile
              </Text>
            </div>
          </div>
        </div>

        {/* No remove handler */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Without Remove</Text>

          <div className="flex items-start pt-5">
            <AvatarPicker
              imageUri="https://i.pravatar.cc/150?img=33"
              onPick={() => {}}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
