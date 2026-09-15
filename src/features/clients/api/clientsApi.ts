import { api } from "../../../lib/api-client";
import { CLIENT_ENDPOINTS } from "../../../lib/api/endpoints";

import type {
  ClientsListResponse,
  CreateClientRequest,
  CreateClientResponse,
  ClientDetailResponse,
  UpdateClientRequest,
  UpdateClientResponse,
  ClientUsageResponse,
} from "../types/clientTypes";

export type GetClientsParams = {
  search?: string;
  ordering?: "name" | "-name" | "created_at" | "-created_at";
  is_archived?: boolean;
  page?: number;
};

export async function getClientsApi(
  params?: GetClientsParams,
): Promise<ClientsListResponse> {
  const response = await api.get<ClientsListResponse>(CLIENT_ENDPOINTS.list, {
    params,
  });
  return response.data;
}

export async function createClientApi(
  payload: CreateClientRequest,
): Promise<CreateClientResponse> {
  const response = await api.post<CreateClientResponse>(
    CLIENT_ENDPOINTS.create,
    payload,
  );
  return response.data;
}

export async function getClientDetailApi(
  slug: string,
): Promise<ClientDetailResponse> {
  const response = await api.get<ClientDetailResponse>(
    CLIENT_ENDPOINTS.detail(slug),
  );
  return response.data;
}

export async function updateClientApi(
  slug: string,
  payload: UpdateClientRequest,
): Promise<UpdateClientResponse> {
  const response = await api.patch<UpdateClientResponse>(
    CLIENT_ENDPOINTS.detail(slug),
    payload,
  );
  return response.data;
}

export async function deleteClientApi(slug: string): Promise<void> {
  await api.delete(CLIENT_ENDPOINTS.detail(slug));
}

export async function getClientUsageApi(): Promise<ClientUsageResponse> {
  const response = await api.get<ClientUsageResponse>(CLIENT_ENDPOINTS.usage);
  return response.data;
}
