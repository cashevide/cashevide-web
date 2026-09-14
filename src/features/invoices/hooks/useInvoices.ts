import { useInfiniteQuery } from "@tanstack/react-query";

import { getInvoicesApi } from "../api/invoicesApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";
import { getPageFromUrl } from "../../../lib/api/pagination";

import type { GetInvoicesParams } from "../api/invoicesApi";
import type { InvoicesListResponse } from "../types/invoiceTypes";

// Infinite-scroll list query — each page fetched appends to the previous
// one as the user scrolls, rather than a single fixed page (matches the
// Expo reference's pattern for this screen). `getPageFromUrl` reads the
// `page` param off DRF's `next` URL; once `next` is null, getNextPageParam
// returns undefined and TanStack Query stops requesting further pages.
export function useInvoices(params?: GetInvoicesParams) {
  return useInfiniteQuery<InvoicesListResponse, Error>({
    queryKey: QUERY_KEYS.invoices(params),
    queryFn: ({ pageParam }) =>
      getInvoicesApi({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getPageFromUrl(lastPage.next),
  });
}
