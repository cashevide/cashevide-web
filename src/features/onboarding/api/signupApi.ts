import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

import type { SignupRequest, SignupResponse } from "../types/signupTypes";

export async function signupApi(
  payload: Omit<SignupRequest, "platform">,
): Promise<SignupResponse> {
  const response = await api.post<SignupResponse>(AUTH_ENDPOINTS.signup, {
    ...payload,
    platform: "web",
  });

  return response.data;
}
