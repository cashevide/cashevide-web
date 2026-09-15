import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateUserProfileApi } from "../api/userProfileApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type { UpdateUserProfileRequest } from "../api/userProfileApi";
import type { UserProfile } from "../types/userProfileTypes";

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateUserProfileRequest>({
    mutationFn: updateUserProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userProfile });
    },
  });
}
