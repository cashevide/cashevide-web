import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProductApi } from "../api/productsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (slug: string) => deleteProductApi(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.productUsage });
    },
  });
}
