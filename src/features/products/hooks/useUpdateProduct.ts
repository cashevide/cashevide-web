import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProductApi } from "../api/productsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type {
  UpdateProductRequest,
  UpdateProductResponse,
} from "../types/productTypes";

type UpdateProductVariables = {
  slug: string;
  payload: UpdateProductRequest;
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation<UpdateProductResponse, Error, UpdateProductVariables>({
    mutationFn: ({ slug, payload }) => updateProductApi(slug, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.productDetail(data.slug),
      });
      // Fixed vs. the Expo source: same gap as useUpdateClient — this
      // mutation also handles archive/unarchive (is_archived flips),
      // which changes how many active products count against the plan
      // limit. Without this, the usage-limit dialog could show a
      // stale count right after an archive/unarchive.
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.productUsage });
    },
  });
}
