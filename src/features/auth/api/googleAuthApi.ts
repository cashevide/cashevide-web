import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

import type {
  GoogleAuthRequest,
  GoogleAuthResponse,
} from "../types/googleAuthTypes";

export async function googleAuthApi(
  payload: Omit<GoogleAuthRequest, "platform">,
): Promise<GoogleAuthResponse> {
  const response = await api.post<GoogleAuthResponse>(AUTH_ENDPOINTS.google, {
    ...payload,
    platform: "web",
  });

  return response.data;
}
