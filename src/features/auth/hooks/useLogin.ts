import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { useAuthStore } from "../../../stores/authStore";
import { loginApi } from "../api/loginApi";
import { ROUTES } from "../../../lib/routes";

import type { LoginRequest, LoginResponse } from "../types/authTypes";

type LoginFormValues = Omit<LoginRequest, "platform">;

export function useLogin() {
  const navigate = useNavigate();

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation<LoginResponse, Error, LoginFormValues>({
    mutationFn: loginApi,
    onSuccess: () => {
      setAuthenticated(true);
      navigate(ROUTES.home, { replace: true });
    },
  });
}
