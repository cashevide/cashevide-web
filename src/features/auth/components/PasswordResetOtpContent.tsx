import { useState } from "react";
import type { AxiosError } from "axios";

import { Container } from "../../../components/layout/Container";
import { Text } from "../../../components/ui/Text";
import { Button } from "../../../components/ui/Button";
import { OtpInput } from "../../../components/ui/OtpInput";
import { Spinner } from "../../../components/ui/Spinner";
import { useVerifyPasswordResetOtp } from "../hooks/useVerifyPasswordResetOtp";
import { useRequestPasswordResetOtp } from "../hooks/useRequestPasswordResetOtp";
import { useCountdown } from "../../../hooks/useCountdown";
import { usePasswordResetStore } from "../../../stores/passwordResetStore";

import type {
  PasswordResetRequestOtpError,
  PasswordResetVerifyOtpError,
} from "../types/passwordResetTypes";

const OTP_LENGTH = 6;

export function PasswordResetOtpContent() {
  const [otp, setOtp] = useState("");

  const email = usePasswordResetStore((state) => state.email);
  const otpCooldownUntil = usePasswordResetStore(
    (state) => state.otpCooldownUntil,
  );

  const cooldownSeconds = useCountdown(otpCooldownUntil);

  const verifyOtpMutation = useVerifyPasswordResetOtp();

  const resendOtpMutation = useRequestPasswordResetOtp({
    navigateOnSuccess: false,
  });

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
    verifyOtpMutation.error as AxiosError<PasswordResetVerifyOtpError> | null;

  const verifyOtpErrorMessages = verifyOtpError?.response?.data
    ? Object.values(verifyOtpError.response.data).flat()
    : [];

  const resendOtpError =
    resendOtpMutation.error as AxiosError<PasswordResetRequestOtpError> | null;

  // Same dual-shape nuance as elsewhere in the password-reset/signup flows.
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
