import { useState } from "react";

import { Container } from "../../../../components/layout/Container";
import { Text } from "../../../../components/ui/Text";
import { Checkbox } from "../../../../components/ui/Checkbox";

// No Expo equivalent — Expo's Checkbox.tsx was an empty placeholder
// file, never implemented or given a design-system page there. This
// page is freshly written to match the existing page style.
export function CheckboxRoute() {
  const [interactiveChecked, setInteractiveChecked] = useState(false);

  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-10 py-12 px-6">
        <Text variant="title">Checkbox</Text>

        <div className="flex flex-col gap-6">
          <Text variant="heading">States</Text>

          <div className="flex flex-row flex-wrap gap-10 border-b border-border py-5">
            <div className="flex flex-col items-center gap-3">
              <Checkbox checked={false} onCheckedChange={() => {}} />
              <Text variant="caption" className="text-muted-foreground">
                Unchecked
              </Text>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Checkbox checked={true} onCheckedChange={() => {}} />
              <Text variant="caption" className="text-muted-foreground">
                Checked
              </Text>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Checkbox checked={false} onCheckedChange={() => {}} disabled />
              <Text variant="caption" className="text-muted-foreground">
                Disabled
              </Text>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Checkbox checked={true} onCheckedChange={() => {}} disabled />
              <Text variant="caption" className="text-muted-foreground">
                Checked + Disabled
              </Text>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Text variant="heading">Interactive</Text>

          <div className="flex flex-row items-center gap-4 border-b border-border py-5">
            <Checkbox
              checked={interactiveChecked}
              onCheckedChange={setInteractiveChecked}
            />
            <Text variant="body-sm" className="text-muted-foreground">
              {interactiveChecked ? "Checked" : "Unchecked"}
            </Text>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Text variant="heading">With Label</Text>

          <div className="flex flex-col gap-4 max-w-[400px] py-5">
            <Checkbox
              checked={interactiveChecked}
              onCheckedChange={setInteractiveChecked}
              label="I agree to the Terms and Privacy Policy"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
