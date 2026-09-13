import { api } from "../../../lib/api-client";
import { AUTH_ENDPOINTS } from "../../../lib/api/endpoints";

import type {
  SignupRequestOtpRequest,
  SignupRequestOtpResponse,
  SignupVerifyOtpRequest,
  SignupVerifyOtpResponse,
} from "../types/signupTypes";

export async function signupRequestOtpApi(
  payload: SignupRequestOtpRequest,
): Promise<SignupRequestOtpResponse> {
  const response = await api.post<SignupRequestOtpResponse>(
    AUTH_ENDPOINTS.signupRequestOtp,
    payload,
  );

  return response.data;
}

export async function signupVerifyOtpApi(
  payload: SignupVerifyOtpRequest,
): Promise<SignupVerifyOtpResponse> {
  const response = await api.post<SignupVerifyOtpResponse>(
    AUTH_ENDPOINTS.signupVerifyOtp,
    payload,
  );

  return response.data;
}
