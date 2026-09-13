import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { signupApi } from "../api/signupApi";
import { useAuthStore } from "../../../stores/authStore";
import { useSignupStore } from "../../../stores/signupStore";
import { ROUTES } from "../../../lib/routes";

import type { SignupRequest, SignupResponse } from "../types/signupTypes";

type SignupFormValues = Omit<SignupRequest, "platform">;

export function useSignup() {
  const navigate = useNavigate();

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const resetSignup = useSignupStore((state) => state.resetSignup);

  return useMutation<SignupResponse, Error, SignupFormValues>({
    mutationFn: signupApi,
    onSuccess: () => {
      setAuthenticated(true);
      resetSignup();
      navigate(ROUTES.home, { replace: true });
    },
  });
}
