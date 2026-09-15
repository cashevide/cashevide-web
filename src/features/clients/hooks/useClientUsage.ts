import { useQuery } from "@tanstack/react-query";

import { getClientUsageApi } from "../api/clientsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

export function useClientUsage() {
  return useQuery({
    queryKey: QUERY_KEYS.clientUsage,
    queryFn: getClientUsageApi,
  });
}
