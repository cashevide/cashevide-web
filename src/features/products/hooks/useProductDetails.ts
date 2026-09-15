import { useQuery } from "@tanstack/react-query";

import { getProductDetailApi } from "../api/productsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

export function useProductDetails(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.productDetail(slug),
    queryFn: () => getProductDetailApi(slug),
    enabled: !!slug,
  });
}
