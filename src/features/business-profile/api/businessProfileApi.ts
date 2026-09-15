import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

import type {
  BusinessProfileResponse,
  UpdateBusinessProfileRequest,
  UpdateBusinessProfileResponse,
} from "../types/businessProfileTypes";

export async function getBusinessProfileApi(): Promise<BusinessProfileResponse> {
  const response = await api.get<BusinessProfileResponse>(
    AUTH_ENDPOINTS.businessProfile,
  );

  return response.data;
}

export async function updateBusinessProfileApi(
  payload: UpdateBusinessProfileRequest,
): Promise<UpdateBusinessProfileResponse> {
  const formData = new FormData();

  if (payload.business_name !== undefined) {
    formData.append("business_name", payload.business_name);
  }
  if (payload.gst_number !== undefined) {
    formData.append("gst_number", payload.gst_number);
  }
  if (payload.vat_number !== undefined) {
    formData.append("vat_number", payload.vat_number);
  }
  if (payload.address !== undefined) {
    formData.append("address", payload.address);
  }
  if (payload.phone_number !== undefined) {
    formData.append("phone_number", payload.phone_number);
  }
  if (payload.business_email !== undefined) {
    formData.append("business_email", payload.business_email);
  }
  if (payload.website !== undefined) {
    formData.append("website", payload.website);
  }
  if (payload.currency !== undefined) {
    formData.append("currency", payload.currency);
  }
  if (payload.logo === null) {
    formData.append("logo", "");
  } else if (payload.logo) {
    formData.append("logo", payload.logo);
  }

  const response = await api.patch<UpdateBusinessProfileResponse>(
    AUTH_ENDPOINTS.businessProfile,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return response.data;
}
