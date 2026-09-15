import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateClientApi } from "../api/clientsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type {
  UpdateClientRequest,
  UpdateClientResponse,
} from "../types/clientTypes";

type UpdateClientVariables = {
  slug: string;
  payload: UpdateClientRequest;
};

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation<UpdateClientResponse, Error, UpdateClientVariables>({
    mutationFn: ({ slug, payload }) => updateClientApi(slug, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clientDetail(data.slug),
      });
      // Fixed vs. the Expo source: this mutation also handles
      // archive/unarchive (is_archived flips), which changes how many
      // active clients count against the plan limit. Without this,
      // the usage-limit dialog (isUsageLimitReached) could show a
      // stale count right after an archive/unarchive until something
      // else happens to refetch it.
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clientUsage });
    },
  });
}
