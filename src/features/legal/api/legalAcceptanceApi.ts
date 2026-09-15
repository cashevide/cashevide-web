import { api } from "../../../lib/api-client";
import { LEGAL_ENDPOINTS } from "../../../lib/api/endpoints";

import type {
  AcceptLegalDocumentsRequest,
  AcceptLegalDocumentsResponse,
} from "../types/legalTypes";

export async function acceptLegalDocumentsApi(
  payload: AcceptLegalDocumentsRequest,
): Promise<AcceptLegalDocumentsResponse> {
  const response = await api.post<AcceptLegalDocumentsResponse>(
    LEGAL_ENDPOINTS.accept,
    payload,
  );

  return response.data;
}
