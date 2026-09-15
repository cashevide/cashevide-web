import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateBusinessProfileApi } from "../api/businessProfileApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type {
  UpdateBusinessProfileRequest,
  UpdateBusinessProfileResponse,
} from "../types/businessProfileTypes";

export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateBusinessProfileResponse,
    Error,
    UpdateBusinessProfileRequest
  >({
    mutationFn: updateBusinessProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.businessProfile });
    },
  });
}
