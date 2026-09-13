import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { useAuthStore } from "../../../stores/authStore";
import { ROUTES } from "../../../lib/routes";

import { logoutApi } from "../api/logoutApi";
import type { LogoutResponse } from "../types/logoutTypes";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const resetAuth = useAuthStore((state) => state.resetAuth);

  return useMutation<LogoutResponse, Error, void>({
    mutationFn: logoutApi,

    onSettled: () => {
      queryClient.clear();
      resetAuth();

      navigate(ROUTES.welcome, { replace: true });
    },
  });
}
