import { useInfiniteQuery } from "@tanstack/react-query";

import { getClientsApi } from "../api/clientsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";
import { getPageFromUrl } from "../../../lib/api/pagination";

import type { GetClientsParams } from "../api/clientsApi";
import type { ClientsListResponse } from "../types/clientTypes";

export function useClients(params?: GetClientsParams) {
  return useInfiniteQuery<ClientsListResponse, Error>({
    queryKey: QUERY_KEYS.clients(params),
    queryFn: ({ pageParam }) =>
      getClientsApi({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getPageFromUrl(lastPage.next),
  });
}
