import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

import type { BusinessProfileResponse } from "../types/businessProfileTypes";

export async function getBusinessProfileApi(): Promise<BusinessProfileResponse> {
  const response = await api.get<BusinessProfileResponse>(
    AUTH_ENDPOINTS.businessProfile,
  );

  return response.data;
}
