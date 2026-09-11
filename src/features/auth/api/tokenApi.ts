import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

export async function refreshTokenApi(): Promise<void> {
  await api.post(AUTH_ENDPOINTS.refresh, { platform: "web" });
}
