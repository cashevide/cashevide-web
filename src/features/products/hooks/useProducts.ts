import { useInfiniteQuery } from "@tanstack/react-query";

import { getProductsApi } from "../api/productsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";
import { getPageFromUrl } from "../../../lib/api/pagination";

import type { GetProductsParams } from "../api/productsApi";
import type { ProductsListResponse } from "../types/productTypes";

export function useProducts(params?: GetProductsParams) {
  return useInfiniteQuery<ProductsListResponse, Error>({
    queryKey: QUERY_KEYS.products(params),
    queryFn: ({ pageParam }) =>
      getProductsApi({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getPageFromUrl(lastPage.next),
  });
}
