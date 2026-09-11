import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { env } from "../config/env";
import { AUTH_ENDPOINTS } from "./api/endpoints";
import { useAuthStore } from "../stores/authStore";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// When several requests hit a 401 at the same moment (e.g. multiple
// queries refetching together on window focus), each would otherwise
// fire its own refresh call. With refresh token rotation on the
// backend, only the first of those calls succeeds — every other one
// would fail with an already-rotated refresh cookie and incorrectly
// log the user out even though their session is still valid. Sharing
// a single in-flight promise across concurrent 401s ensures only one
// refresh call is ever made per expiry; every other request awaits
// and reuses its result.
let refreshPromise: Promise<void> | null = null;

async function performRefresh(): Promise<void> {
  await axios.post(
    `${env.apiUrl}${AUTH_ENDPOINTS.refresh}`,
    { platform: "web" },
    {
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    },
  );
}

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
          refreshPromise = null;
        });
      }

      await refreshPromise;

      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().resetAuth();

      return Promise.reject(refreshError);
    }
  },
);
