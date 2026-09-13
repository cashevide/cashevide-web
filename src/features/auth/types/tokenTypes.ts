import type { LoginPlatform } from "./authTypes";

export type TokenRefreshRequest = {
  refresh?: string;
  platform: LoginPlatform;
};

export type TokenRefreshResponse = {
  message?: string;
};
