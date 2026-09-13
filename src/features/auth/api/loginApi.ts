import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

import type { LoginRequest, LoginResponse } from "../types/authTypes";

export async function loginApi(
  payload: Omit<LoginRequest, "platform">,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.login, {
    ...payload,
    platform: "web",
  });

  return response.data;
}
