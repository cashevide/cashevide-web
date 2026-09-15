import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProductApi } from "../api/productsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type {
  CreateProductRequest,
  CreateProductResponse,
} from "../types/productTypes";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation<CreateProductResponse, Error, CreateProductRequest>({
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.productUsage });
    },
  });
}
