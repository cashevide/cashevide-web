import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

import type {
  CheckReferralCodeRequest,
  CheckReferralCodeResponse,
} from "../types/availabilityTypes";

export async function checkReferralCodeApi(
  params: CheckReferralCodeRequest,
): Promise<CheckReferralCodeResponse> {
  const response = await api.get<CheckReferralCodeResponse>(
    AUTH_ENDPOINTS.checkReferralCode,
    { params },
  );

  return response.data;
}
