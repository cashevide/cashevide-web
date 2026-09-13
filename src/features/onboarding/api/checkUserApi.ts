import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

import type {
  CheckUserRequest,
  CheckUserResponse,
} from "../types/availabilityTypes";

export async function checkUserApi(
  params: CheckUserRequest,
): Promise<CheckUserResponse> {
  const response = await api.get<CheckUserResponse>(AUTH_ENDPOINTS.checkUser, {
    params,
  });

  return response.data;
}
