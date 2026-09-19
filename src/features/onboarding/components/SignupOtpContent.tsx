import { useState } from "react";
import type { AxiosError } from "axios";

import { Container } from "../../../components/layout/Container";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { OtpInput } from "../../../components/ui/OtpInput";
import { Spinner } from "../../../components/ui/Spinner";
import { useSignupVerifyOtp } from "../hooks/useSignupVerifyOtp";
import { useSignupRequestOtp } from "../hooks/useSignupRequestOtp";
import { useCountdown } from "../../../hooks/useCountdown";
import { useSignupStore } from "../../../stores/signupStore";

import type {
  SignupRequestOtpError,
  SignupVerifyOtpError,
} from "../types/signupTypes";

const OTP_LENGTH = 6;

export function SignupOtpContent() {
  const [otp, setOtp] = useState("");

  const email = useSignupStore((state) => state.email);
  const otpCooldownUntil = useSignupStore((state) => state.otpCooldownUntil);

  const cooldownSeconds = useCountdown(otpCooldownUntil);

  const verifyOtpMutation = useSignupVerifyOtp();

  const resendOtpMutation = useSignupRequestOtp({ navigateOnSuccess: false });

  function handleVerify() {
    verifyOtpMutation.mutate({ email, otp: otp.trim() });
  }

  function handleResend() {
    resendOtpMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setOtp("");
          verifyOtpMutation.reset();
        },
      },
    );
  }

  const isOtpComplete = otp.trim().length === OTP_LENGTH;

  const canResend = cooldownSeconds === 0 && !resendOtpMutation.isPending;

  const verifyOtpError =
    verifyOtpMutation.error as AxiosError<SignupVerifyOtpError> | null;

  const verifyOtpErrorMessages = verifyOtpError?.response?.data
    ? Object.values(verifyOtpError.response.data).flat()
    : [];

  const resendOtpError =
    resendOtpMutation.error as AxiosError<SignupRequestOtpError> | null;

  // Verified against backend: this endpoint's 400 response can be
  // either { error: string } or a per-field error map — same nuance as
  // in SignupEmailContent.
  const resendResponseData = resendOtpError?.response?.data;
  const resendOtpErrorMessages = resendResponseData
    ? "error" in resendResponseData
      ? [resendResponseData.error]
      : Object.values(resendResponseData).flat()
    : [];

  return (
    <Container variant="narrow" scroll>
      <div className="flex-1 flex flex-col justify-center px-6 py-10 gap-8">
        <div className="flex flex-col gap-2">
          <Text variant="subheading" className="text-center">
            Enter the code
          </Text>
          <Text variant="body-sm" className="text-center">
            OTP sent to {email}
          </Text>
        </div>

        <div className="flex flex-col gap-4">
          <OtpInput
            value={otp}
            onChangeText={setOtp}
            error={verifyOtpErrorMessages.length > 0}
            onEnter={() => {
              if (isOtpComplete) {
                handleVerify();
              }
            }}
            autoFocus
          />

          {verifyOtpErrorMessages[0] ? (
            <Text
              variant="body-sm"
              className="text-destructive-text text-center"
            >
              {verifyOtpErrorMessages[0]}
            </Text>
          ) : null}

          <div className="flex items-center justify-center">
            <Button
              variant="primary"
              title="Verify OTP"
              onClick={handleVerify}
              disabled={!isOtpComplete}
              isLoading={verifyOtpMutation.isPending}
            />
          </div>

          <div className="flex flex-col items-center gap-1">
            {cooldownSeconds > 0 ? (
              <Text variant="body-sm">Resend OTP in {cooldownSeconds}s</Text>
            ) : null}

            {resendOtpMutation.isPending ? (
              <Spinner size="sm" />
            ) : (
              <button
                type="button"
                disabled={!canResend}
                onClick={canResend ? handleResend : undefined}
              >
                <Text
                  variant="link"
                  className={canResend ? "" : "text-muted-foreground"}
                >
                  Resend OTP
                </Text>
              </button>
            )}

            {resendOtpErrorMessages[0] ? (
              <Text variant="body-sm" className="text-destructive-text">
                {resendOtpErrorMessages[0]}
              </Text>
            ) : null}
          </div>
        </div>
      </div>
    </Container>
  );
}
