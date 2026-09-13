import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { passwordResetRequestOtpApi } from "../api/passwordResetApi";
import { usePasswordResetStore } from "../../../stores/passwordResetStore";
import { ROUTES } from "../../../lib/routes";

import type {
  PasswordResetRequestOtpRequest,
  PasswordResetRequestOtpResponse,
} from "../types/passwordResetTypes";

const RESEND_COOLDOWN_MS = 60 * 1000;

type UseRequestPasswordResetOtpOptions = {
  navigateOnSuccess?: boolean;
};

export function useRequestPasswordResetOtp(
  options: UseRequestPasswordResetOtpOptions = {},
) {
  const { navigateOnSuccess = true } = options;

  const navigate = useNavigate();

  const setEmail = usePasswordResetStore((state) => state.setEmail);
  const setOtpCooldownUntil = usePasswordResetStore(
    (state) => state.setOtpCooldownUntil,
  );

  return useMutation<
    PasswordResetRequestOtpResponse,
    Error,
    PasswordResetRequestOtpRequest
  >({
    mutationFn: passwordResetRequestOtpApi,
    onSuccess: (_data, variables) => {
      setEmail(variables.email);
      setOtpCooldownUntil(Date.now() + RESEND_COOLDOWN_MS);

      if (navigateOnSuccess) {
        navigate(ROUTES.passwordReset.otp);
      }
    },
  });
}
