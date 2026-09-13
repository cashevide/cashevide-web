import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { signupRequestOtpApi } from "../api/signupOtpApi";
import { useSignupStore } from "../../../stores/signupStore";
import { ROUTES } from "../../../lib/routes";

import type {
  SignupRequestOtpRequest,
  SignupRequestOtpResponse,
} from "../types/signupTypes";

const RESEND_COOLDOWN_MS = 60 * 1000;

type UseSignupRequestOtpOptions = {
  navigateOnSuccess?: boolean;
};

export function useSignupRequestOtp(options: UseSignupRequestOtpOptions = {}) {
  const { navigateOnSuccess = true } = options;

  const navigate = useNavigate();

  const setEmail = useSignupStore((state) => state.setEmail);
  const setOtpCooldownUntil = useSignupStore(
    (state) => state.setOtpCooldownUntil,
  );

  return useMutation<SignupRequestOtpResponse, Error, SignupRequestOtpRequest>({
    mutationFn: signupRequestOtpApi,
    onSuccess: (_data, variables) => {
      setEmail(variables.email);
      setOtpCooldownUntil(Date.now() + RESEND_COOLDOWN_MS);

      if (navigateOnSuccess) {
        navigate(ROUTES.signup.otp);
      }
    },
  });
}
