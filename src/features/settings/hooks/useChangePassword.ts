import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { changePasswordApi } from "../api/securitySettingsApi";
import { useAuthStore } from "../../../stores/authStore";
import { ROUTES } from "../../../lib/routes";

import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/securitySettingsTypes";

// The backend invalidates the session as part of a successful password
// change (see Cashevide_API.yaml: "user's refresh token is blacklisted,
// cookies are cleared... must log in again") — no separate logout call
// needed here, just clearing local state and redirecting, same as
// useLogout's onSettled.
export function useChangePassword() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const resetAuth = useAuthStore((state) => state.resetAuth);

  return useMutation<ChangePasswordResponse, Error, ChangePasswordRequest>({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      queryClient.clear();
      resetAuth();

      navigate(ROUTES.login, { replace: true });
    },
  });
}
