import { useQuery } from "@tanstack/react-query";

import { getProductUsageApi } from "../api/productsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

export function useProductUsage() {
  return useQuery({
    queryKey: QUERY_KEYS.productUsage,
    queryFn: getProductUsageApi,
  });
}
