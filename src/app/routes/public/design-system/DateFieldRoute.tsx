import { useState } from "react";

import { Container } from "../../../../../components/layout/Container";
import { Text } from "../../../../../components/ui/Text";
import { DateField } from "../../../../../components/ui/DateField";

export function DateFieldRoute() {
  const [date, setDate] = useState<string | undefined>(undefined);
  const [prefilledDate, setPrefilledDate] = useState<string | undefined>(
    "2026-03-15",
  );

  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-14 py-12 px-6">
        <Text variant="title">Date Field</Text>

        {/* Description differs from Expo's version, which wrapped a
            native OS date picker there — this is a custom typed
            DD/MM/YYYY field with a calendar dropdown in a Modal, since
            a raw <input type="date"> displays in the browser's locale
            format and can't be forced to match this app's convention. */}
        <Text variant="body-sm" className="text-muted-foreground max-w-[640px]">
          Typed DD/MM/YYYY text field with a calendar picker (opens in a
          Modal) as an alternative to typing.
        </Text>

        {/* Interactive */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Interactive</Text>

          <div className="flex flex-row flex-wrap items-start gap-10 pt-5 pb-14 border-b border-border">
            <div className="w-[240px]">
              <DateField
                label="Payment Date"
                value={date}
                onChange={setDate}
                placeholder="Select date"
              />
            </div>

            <div className="w-[240px]">
              <DateField
                label="Issue Date"
                value={prefilledDate}
                onChange={setPrefilledDate}
              />
            </div>
          </div>
        </div>

        {/* Date range (as used in invoice filters) */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Date Range</Text>

          <div className="flex items-start pt-5">
            <div className="flex flex-row gap-3 w-[300px]">
              <DateField label="From" value={undefined} onChange={() => {}} />
              <DateField label="To" value={undefined} onChange={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
