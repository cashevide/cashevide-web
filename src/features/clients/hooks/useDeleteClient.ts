import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteClientApi } from "../api/clientsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (slug: string) => deleteClientApi(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clientUsage });
    },
  });
}
