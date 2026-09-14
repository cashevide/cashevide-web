import { useMutation } from "@tanstack/react-query";

import { downloadInvoicePdfApi } from "../api/invoicePdfApi";

// No Platform.OS branching needed here — invoicePdfApi.ts already dropped
// the Expo native share-sheet path (expo-file-system/expo-sharing) when
// it was ported; downloadInvoicePdfApi is unconditionally the browser-
// download implementation on web.
export function useDownloadInvoicePdf() {
  return useMutation<void, Error, number>({
    mutationFn: (id) => downloadInvoicePdfApi(id),
  });
}
