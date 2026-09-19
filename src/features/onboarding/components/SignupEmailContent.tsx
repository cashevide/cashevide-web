import { useState } from "react";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";

import { Container } from "../../../components/layout/Container";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Spinner } from "../../../components/ui/Spinner";
import { useCheckUser } from "../hooks/useCheckUser";
import { useSignupRequestOtp } from "../hooks/useSignupRequestOtp";
import { useCountdown } from "../../../hooks/useCountdown";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useSignupStore } from "../../../stores/signupStore";
import { ROUTES } from "../../../lib/routes";

import type { SignupRequestOtpError } from "../types/signupTypes";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupEmailContent() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  // Mirrors LoginContent/PasswordResetEmailContent's pattern: the
  // format error only shows once the field has been left (blurred)
  // with invalid content, not while the person is still typing and
  // simply paused mid-email — focusing the field again clears it so
  // resuming typing doesn't leave a stale error sitting there.
  const [emailTouched, setEmailTouched] = useState(false);

  const debouncedEmail = useDebouncedValue(email, 500);

  const isValidEmailFormat = EMAIL_REGEX.test(email.trim());
  const isDebouncedValidEmailFormat = EMAIL_REGEX.test(debouncedEmail.trim());

  const isTypingPending = email !== debouncedEmail;

  const showFormatError =
    emailTouched &&
    !isTypingPending &&
    debouncedEmail.length > 0 &&
    !isDebouncedValidEmailFormat;

  const emailCheck = useCheckUser("email", isValidEmailFormat ? email : "");

  const signupRequestOtpMutation = useSignupRequestOtp();

  const storedEmail = useSignupStore((state) => state.email);
  const otpCooldownUntil = useSignupStore((state) => state.otpCooldownUntil);

  const cooldownSeconds = useCountdown(otpCooldownUntil);

  const isSameEmailAsStored =
    email.trim().toLowerCase() === storedEmail.toLowerCase() &&
    storedEmail.length > 0;

  const isCooldownActive = cooldownSeconds > 0 && isSameEmailAsStored;

  function handleContinue() {
    if (isCooldownActive) {
      navigate(ROUTES.signup.otp);

      return;
    }

    signupRequestOtpMutation.mutate({ email: email.trim() });
  }

  const canContinue =
    isValidEmailFormat && emailCheck.data?.is_available === true;

  const requestOtpError =
    signupRequestOtpMutation.error as AxiosError<SignupRequestOtpError> | null;

  // Verified against backend (users/views/otp.py): this endpoint's 400
  // response can be either { error: string } (cooldown/send-failure) or
  // a per-field error map (validation failure). Handle both shapes —
  // don't route this one through getFieldErrorMessage(), since that
  // helper assumes a single consistent shape per endpoint.
  const responseData = requestOtpError?.response?.data;
  const requestOtpErrorMessages = responseData
    ? "error" in responseData
      ? [responseData.error]
      : Object.values(responseData).flat()
    : [];

  const availabilityMessage =
    isValidEmailFormat && emailCheck.data
      ? {
          text: emailCheck.data.is_available
            ? "Email is available."
            : "This email is already registered.",
          isSuccess: emailCheck.data.is_available,
        }
      : null;

  const emailError = showFormatError
    ? "Enter a valid email address."
    : availabilityMessage && !availabilityMessage.isSuccess
      ? availabilityMessage.text
      : requestOtpErrorMessages[0];

  return (
    <Container variant="narrow" scroll>
      <div className="flex-1 flex flex-col justify-center px-6 py-10 gap-8">
        <Text variant="subheading" className="text-center">
          What's your email?
        </Text>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailTouched(false)}
              onBlur={() => setEmailTouched(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (isCooldownActive || canContinue)) {
                  handleContinue();
                }
              }}
              placeholder="Email"
              type="email"
              isSuccess={availabilityMessage?.isSuccess}
              error={emailError}
            />

            {isValidEmailFormat && emailCheck.isFetching ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" />
              </div>
            ) : null}

            {availabilityMessage?.isSuccess ? (
              <Text variant="body-sm" className="text-success-text text-center">
                {availabilityMessage.text}
              </Text>
            ) : null}

            {isCooldownActive ? (
              <Text variant="body-sm" className="text-center">
                An OTP was already sent to this email. You can enter it in{" "}
                {cooldownSeconds}s, or continue now.
              </Text>
            ) : null}
          </div>

          <div className="flex items-center justify-center">
            <Button
              variant="primary"
              title="Continue"
              onClick={handleContinue}
              disabled={!isCooldownActive && !canContinue}
              isLoading={signupRequestOtpMutation.isPending}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
