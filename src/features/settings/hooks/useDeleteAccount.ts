import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { deleteAccountApi } from "../api/accountSettingsApi";
import { useAuthStore } from "../../../stores/authStore";
import { ROUTES } from "../../../lib/routes";

import type { DeleteAccountResponse } from "../types/accountSettingsTypes";

export function useDeleteAccount() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const resetAuth = useAuthStore((state) => state.resetAuth);

  return useMutation<DeleteAccountResponse, Error, void>({
    mutationFn: deleteAccountApi,
    onSuccess: () => {
      queryClient.clear();
      resetAuth();

      navigate(ROUTES.welcome, { replace: true });
    },
  });
}
