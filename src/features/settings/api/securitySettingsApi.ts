import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/securitySettingsTypes";

export async function changePasswordApi(
  payload: ChangePasswordRequest,
): Promise<ChangePasswordResponse> {
  const response = await api.post<ChangePasswordResponse>(
    AUTH_ENDPOINTS.changePassword,
    payload,
  );

  return response.data;
}
