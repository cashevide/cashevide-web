import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

import type {
  PasswordResetRequestOtpRequest,
  PasswordResetRequestOtpResponse,
  PasswordResetVerifyOtpRequest,
  PasswordResetVerifyOtpResponse,
  ResetPasswordRequest,
  ResetPasswordSuccessResponse,
} from "../types/passwordResetTypes";

export async function passwordResetRequestOtpApi(
  payload: PasswordResetRequestOtpRequest,
): Promise<PasswordResetRequestOtpResponse> {
  const response = await api.post<PasswordResetRequestOtpResponse>(
    AUTH_ENDPOINTS.passwordResetRequestOtp,
    payload,
  );

  return response.data;
}

export async function passwordResetVerifyOtpApi(
  payload: PasswordResetVerifyOtpRequest,
): Promise<PasswordResetVerifyOtpResponse> {
  const response = await api.post<PasswordResetVerifyOtpResponse>(
    AUTH_ENDPOINTS.passwordResetVerifyOtp,
    payload,
  );

  return response.data;
}

export async function resetPasswordApi(
  payload: ResetPasswordRequest,
): Promise<ResetPasswordSuccessResponse> {
  const response = await api.post<ResetPasswordSuccessResponse>(
    AUTH_ENDPOINTS.resetPassword,
    payload,
  );

  return response.data;
}
