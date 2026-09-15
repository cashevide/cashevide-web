import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createClientApi } from "../api/clientsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type {
  CreateClientRequest,
  CreateClientResponse,
} from "../types/clientTypes";

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation<CreateClientResponse, Error, CreateClientRequest>({
    mutationFn: createClientApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clientUsage });
    },
  });
}
