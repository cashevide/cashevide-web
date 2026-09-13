import { useState } from "react";

import { Container } from "../../../../../components/layout/Container";
import { Text } from "../../../../../components/ui/Text";
import { CurrencyPicker } from "../../../../../components/ui/CurrencyPicker";

export function CurrencyPickerRoute() {
  const [currency, setCurrency] = useState("");
  const [prefilledCurrency, setPrefilledCurrency] = useState("USD");

  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-14 py-12 px-6">
        <Text variant="title">Currency Picker</Text>

        {/* Interactive */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Interactive</Text>

          <div className="flex flex-row flex-wrap items-start gap-10 pt-5 pb-14 border-b border-border">
            <div className="flex flex-col gap-1.5 w-[240px]">
              <Text variant="caption" className="text-muted-foreground">
                Empty
              </Text>
              <CurrencyPicker value={currency} onChange={setCurrency} />
            </div>

            <div className="flex flex-col gap-1.5 w-[240px]">
              <Text variant="caption" className="text-muted-foreground">
                Pre-selected
              </Text>
              <CurrencyPicker
                value={prefilledCurrency}
                onChange={setPrefilledCurrency}
              />
            </div>
          </div>
        </div>

        {/* Custom placeholder */}
        <div className="flex flex-col gap-6">
          <Text variant="heading">Custom Placeholder</Text>

          <div className="flex items-start pt-5">
            <div className="flex flex-col gap-1.5 w-[240px]">
              <CurrencyPicker
                value=""
                onChange={() => {}}
                placeholder="Choose invoice currency"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
