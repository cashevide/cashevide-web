import { useState } from "react";

import { Container } from "../../../../../components/layout/Container";
import { Text } from "../../../../../components/ui/Text";
import { Input } from "../../../../../components/ui/Input";
import { SearchInput } from "../../../../../components/ui/SearchInput";
import { OtpInput } from "../../../../../components/ui/OtpInput";
import { PhoneNumberInput } from "../../../../../components/ui/PhoneNumberInput";

export function InputsRoute() {
  const [password, setPassword] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchWithText, setSearchWithText] = useState("Invoice #1024");
  const [otpValue, setOtpValue] = useState("");
  const [otpErrorValue, setOtpErrorValue] = useState("482");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <Container variant="desktop" scroll>
      <div className="flex flex-col gap-10 py-12 px-6">
        <Text variant="title">Inputs</Text>

        <div className="flex flex-row flex-wrap gap-x-12 gap-y-10">
          {/* Column 1: Text Input + Search Input (paired by content weight) */}
          <div className="flex flex-col gap-10 w-[400px]">
            <div className="flex flex-col gap-6">
              <Text variant="subheading">Text Input</Text>

              <div className="flex flex-col gap-6">
                <Input label="Default" placeholder="Enter your name" />

                <Input
                  label="With Error"
                  placeholder="Enter your email"
                  error="Please enter a valid email address"
                />

                <Input
                  label="Success"
                  placeholder="Username"
                  isSuccess
                  defaultValue="noufal_k"
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  isPassword
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Input
                  label="Disabled"
                  placeholder="Cannot edit this"
                  disabled
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <Text variant="subheading">Search Input</Text>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <Text variant="caption">Empty</Text>
                  <SearchInput
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onClear={() => setSearchValue("")}
                    placeholder="Search clients"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Text variant="caption">With value (shows clear button)</Text>
                  <SearchInput
                    value={searchWithText}
                    onChange={(e) => setSearchWithText(e.target.value)}
                    onClear={() => setSearchWithText("")}
                    placeholder="Search invoices"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <Text variant="subheading">Phone Number Input</Text>

              <div className="flex flex-col gap-3">
                <PhoneNumberInput onChangeFullNumber={setPhoneNumber} />
                <Text variant="caption">
                  Full number: {phoneNumber || "(empty)"}
                </Text>
              </div>
            </div>
          </div>

          {/* Column 2: OTP Input */}
          <div className="flex flex-col gap-6 w-[400px]">
            <Text variant="subheading">OTP Input</Text>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5 self-start">
                <Text variant="caption">Default (6 digits)</Text>
                <OtpInput value={otpValue} onChangeText={setOtpValue} />
              </div>

              <div className="flex flex-col gap-1.5 self-start">
                <Text variant="caption">Error state</Text>
                <OtpInput
                  value={otpErrorValue}
                  onChangeText={setOtpErrorValue}
                  error
                />
              </div>

              <div className="flex flex-col gap-1.5 self-start">
                <Text variant="caption">Disabled</Text>
                <OtpInput value="123456" onChangeText={() => {}} disabled />
              </div>

              <div className="flex flex-col gap-1.5 self-start">
                <Text variant="caption">4-digit variant</Text>
                <OtpInput value="" onChangeText={() => {}} length={4} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
