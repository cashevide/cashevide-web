import { useState } from "react";

import { Container } from "../../../../components/layout/Container";
import { Text } from "../../../../components/ui/Text";
import { Switch } from "../../../../components/ui/Switch";

export function SwitchRoute() {
  const [interactiveValue, setInteractiveValue] = useState(true);

  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-14 py-12 px-6">
        <Text variant="title">Switch</Text>

        {/* States */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">States</Text>

          <div className="flex flex-row flex-wrap gap-10 border-b border-border py-5">
            <div className="flex flex-col items-center gap-3">
              <Switch value={true} onValueChange={() => {}} />
              <Text variant="caption" className="text-muted-foreground">
                Enabled
              </Text>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Switch value={false} onValueChange={() => {}} />
              <Text variant="caption" className="text-muted-foreground">
                Disabled
              </Text>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Switch value={true} onValueChange={() => {}} disabled />
              <Text variant="caption" className="text-muted-foreground">
                Enabled + Disabled state
              </Text>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Switch value={false} onValueChange={() => {}} disabled />
              <Text variant="caption" className="text-muted-foreground">
                Disabled + Disabled state
              </Text>
            </div>
          </div>
        </div>

        {/* Interactive */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Interactive</Text>

          <div className="flex flex-row items-center gap-4 border-b border-border py-5">
            <Switch
              value={interactiveValue}
              onValueChange={setInteractiveValue}
              ariaLabel="Toggle example"
            />
            <Text variant="body-sm" className="text-muted-foreground">
              {interactiveValue ? "On" : "Off"}
            </Text>
          </div>
        </div>

        {/* With label */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">With Label</Text>

          <div className="flex flex-col gap-4 max-w-[400px] py-5">
            <div className="flex flex-row items-center justify-between">
              <Text variant="body">Push notifications</Text>
              <Switch value={true} onValueChange={() => {}} />
            </div>

            <div className="flex flex-row items-center justify-between">
              <Text variant="body">Email updates</Text>
              <Switch value={false} onValueChange={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
