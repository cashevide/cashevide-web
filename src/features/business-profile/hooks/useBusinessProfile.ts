import { useQuery } from "@tanstack/react-query";

import { getBusinessProfileApi } from "../api/businessProfileApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type { BusinessProfileResponse } from "../types/businessProfileTypes";

export function useBusinessProfile() {
  return useQuery<BusinessProfileResponse, Error>({
    queryKey: QUERY_KEYS.businessProfile,
    queryFn: getBusinessProfileApi,
  });
}
