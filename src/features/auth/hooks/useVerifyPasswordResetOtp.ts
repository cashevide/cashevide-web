import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { passwordResetVerifyOtpApi } from "../api/passwordResetApi";
import { usePasswordResetStore } from "../../../stores/passwordResetStore";
import { ROUTES } from "../../../lib/routes";

import type {
  PasswordResetVerifyOtpRequest,
  PasswordResetVerifyOtpResponse,
} from "../types/passwordResetTypes";

export function useVerifyPasswordResetOtp() {
  const navigate = useNavigate();

  const setOtpVerified = usePasswordResetStore((state) => state.setOtpVerified);

  return useMutation<
    PasswordResetVerifyOtpResponse,
    Error,
    PasswordResetVerifyOtpRequest
  >({
    mutationFn: passwordResetVerifyOtpApi,
    onSuccess: () => {
      setOtpVerified(true);
      navigate(ROUTES.passwordReset.reset);
    },
  });
}
