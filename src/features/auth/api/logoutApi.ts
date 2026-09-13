import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

import type { LogoutResponse } from "../types/logoutTypes";

export async function logoutApi(): Promise<LogoutResponse> {
  const response = await api.post<LogoutResponse>(AUTH_ENDPOINTS.logout, {});

  return response.data;
}
