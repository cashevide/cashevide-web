import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { resetPasswordApi } from "../api/passwordResetApi";
import { usePasswordResetStore } from "../../../stores/passwordResetStore";
import { ROUTES } from "../../../lib/routes";

import type {
  ResetPasswordRequest,
  ResetPasswordSuccessResponse,
} from "../types/passwordResetTypes";

export function useResetPassword() {
  const navigate = useNavigate();

  const resetPasswordResetFlow = usePasswordResetStore(
    (state) => state.resetPasswordResetFlow,
  );

  return useMutation<ResetPasswordSuccessResponse, Error, ResetPasswordRequest>(
    {
      mutationFn: resetPasswordApi,
      onSuccess: () => {
        resetPasswordResetFlow();
        navigate(ROUTES.login, { replace: true });
      },
    },
  );
}
