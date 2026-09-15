import { useQuery } from "@tanstack/react-query";

import { getClientDetailApi } from "../api/clientsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

export function useClientDetails(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.clientDetail(slug),
    queryFn: () => getClientDetailApi(slug),
    enabled: !!slug,
  });
}
