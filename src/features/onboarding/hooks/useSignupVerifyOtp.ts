import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { signupVerifyOtpApi } from "../api/signupOtpApi";
import { useSignupStore } from "../../../stores/signupStore";
import { ROUTES } from "../../../lib/routes";

import type {
  SignupVerifyOtpRequest,
  SignupVerifyOtpResponse,
} from "../types/signupTypes";

export function useSignupVerifyOtp() {
  const navigate = useNavigate();

  const setEmailOtpVerified = useSignupStore(
    (state) => state.setEmailOtpVerified,
  );

  return useMutation<SignupVerifyOtpResponse, Error, SignupVerifyOtpRequest>({
    mutationFn: signupVerifyOtpApi,
    onSuccess: () => {
      setEmailOtpVerified(true);
      navigate(ROUTES.signup.account);
    },
  });
}
