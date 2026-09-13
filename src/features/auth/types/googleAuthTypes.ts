import type { LoginPlatform, AuthUser } from "./authTypes";

// -------------------- Request --------------------

export type GoogleAuthRequest = {
  google_id_token: string;
  platform: LoginPlatform;
  referral_code_input?: string;
  username?: string;
};

// -------------------- Responses --------------------

// Case 1: existing user (login) OR new user completing signup (2nd hit)
export type GoogleAuthSuccessResponse = {
  message: string;
  user: AuthUser;
};

// Case 2: new user, first hit — backend asks for referral + username
export type GoogleAuthPromptReferralResponse = {
  status: "prompt_referral";
  email: string;
  full_name: string;
};

export type GoogleAuthResponse =
  | GoogleAuthSuccessResponse
  | GoogleAuthPromptReferralResponse;

// -------------------- Errors --------------------

export type GoogleAuthErrorField =
  | "google_id_token"
  | "referral_code_input"
  | "username";

export type GoogleAuthFieldError = Partial<
  Record<GoogleAuthErrorField, string[]>
>;

export type GoogleAuthTokenError = {
  error: string;
};

export type GoogleAuthError = GoogleAuthFieldError | GoogleAuthTokenError;
