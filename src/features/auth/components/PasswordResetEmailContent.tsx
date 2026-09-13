import { useState } from "react";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";

import { Container } from "../../../components/layout/Container";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useRequestPasswordResetOtp } from "../hooks/useRequestPasswordResetOtp";
import { useCountdown } from "../../../hooks/useCountdown";
import { usePasswordResetStore } from "../../../stores/passwordResetStore";
import { ROUTES } from "../../../lib/routes";

import type { PasswordResetRequestOtpError } from "../types/passwordResetTypes";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PasswordResetEmailContent() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const isValidEmailFormat = EMAIL_REGEX.test(email.trim());

  const requestOtpMutation = useRequestPasswordResetOtp();

  const storedEmail = usePasswordResetStore((state) => state.email);
  const otpCooldownUntil = usePasswordResetStore(
    (state) => state.otpCooldownUntil,
  );

  const cooldownSeconds = useCountdown(otpCooldownUntil);

  const isSameEmailAsStored =
    email.trim().toLowerCase() === storedEmail.toLowerCase() &&
    storedEmail.length > 0;

  const isCooldownActive = cooldownSeconds > 0 && isSameEmailAsStored;

  function handleContinue() {
    if (isCooldownActive) {
      navigate(ROUTES.passwordReset.otp);

      return;
    }

    if (!isValidEmailFormat) {
      setEmailTouched(true);
      return;
    }

    requestOtpMutation.mutate({ email: email.trim() });
  }

  const requestOtpError =
    requestOtpMutation.error as AxiosError<PasswordResetRequestOtpError> | null;

  // Verified against backend: this endpoint's 400 response can be
  // either { error: string } or a per-field error map — same nuance as
  // signup's request-otp endpoint.
  const responseData = requestOtpError?.response?.data;
  const errorMessages = responseData
    ? "error" in responseData
      ? [responseData.error]
      : Object.values(responseData).flat()
    : [];

  const emailFormatError =
    emailTouched && email.trim().length > 0 && !isValidEmailFormat
      ? "Enter a valid email address."
      : undefined;

  const emailError = emailFormatError ?? errorMessages[0];

  return (
    <Container variant="narrow" scroll>
      <div className="flex-1 flex flex-col justify-center px-6 py-10 gap-8">
        <Text variant="subheading" className="text-center">
          Reset your password
        </Text>

        <div className="flex flex-col gap-4">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailTouched(false)}
            onBlur={() => setEmailTouched(true)}
            placeholder="Email"
            type="email"
            error={emailError}
          />

          {isCooldownActive ? (
            <Text variant="body-sm" className="text-center">
              You can enter it in {cooldownSeconds}s, or continue now.
            </Text>
          ) : null}

          <div className="flex items-center justify-center">
            <Button
              variant="primary"
              title="Send OTP"
              onClick={handleContinue}
              disabled={!isCooldownActive && !isValidEmailFormat}
              isLoading={requestOtpMutation.isPending}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
