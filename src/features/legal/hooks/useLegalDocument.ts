import { useQuery } from "@tanstack/react-query";

import { getLegalDocumentApi } from "../api/legalDocumentsApi";
import { QUERY_KEYS } from "../../../lib/api/queryKeys";

import type { LegalDocument } from "../types/legalTypes";

export function useLegalDocument(docType: string) {
  return useQuery<LegalDocument, Error>({
    queryKey: QUERY_KEYS.legalDocument(docType),
    queryFn: () => getLegalDocumentApi(docType),
    enabled: docType.length > 0,
  });
}
