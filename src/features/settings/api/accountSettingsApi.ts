import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

import type { DeleteAccountResponse } from "../types/accountSettingsTypes";

// No refresh-token body needed here — see securitySettingsTypes.ts's
// ChangePasswordRequest comment for why (web's session is cookie-based;
// the backend only expects a manually-passed refresh token from mobile
// clients).
export async function deleteAccountApi(): Promise<DeleteAccountResponse> {
  const response = await api.delete<DeleteAccountResponse>(
    AUTH_ENDPOINTS.deleteAccount,
  );

  return response.data;
}
