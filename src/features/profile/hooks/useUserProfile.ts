import { useQuery } from "@tanstack/react-query";

import { getUserProfileApi } from "../api/userProfileApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type { UserProfile } from "../types/userProfileTypes";

export function useUserProfile(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;

  return useQuery<UserProfile, Error>({
    queryKey: QUERY_KEYS.userProfile,
    queryFn: getUserProfileApi,
    enabled,
  });
}
