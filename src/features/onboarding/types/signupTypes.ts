import type { LoginPlatform, AuthUser } from "../../auth/types/authTypes";
import type { FieldErrors } from "../../../lib/api/errors";

// -------------------- signup-request-otp --------------------

export type SignupRequestOtpRequest = {
  email: string;
};

export type SignupRequestOtpResponse = {
  message: string;
};

// Verified against users/views/otp.py (BaseOTPRequestView.post): this
// endpoint's 400 response is either DRF's standard per-field error map
// (serializer.errors, when validation fails — e.g. email already
// registered) or a plain { error: string } (cooldown active, or the
// send-email step raised). Both shapes are real, so both are covered.
export type SignupRequestOtpError = FieldErrors<"email"> | { error: string };

// -------------------- signup-verify-otp --------------------

export type SignupVerifyOtpRequest = {
  email: string;
  otp: string;
};

export type SignupVerifyOtpResponse = {
  message: string;
};

// Verified against users/serializers/otp.py (BaseOTPVerificationSerializer):
// all validation failures raise ValidationError({"otp": "..."}) — a
// per-field error map. No { error: string } path exists for this
// endpoint specifically (that shape is only on the *request* endpoint).
export type SignupVerifyOtpError = FieldErrors<"email" | "otp">;

// -------------------- signup (final submit) --------------------

export type SignupRequest = {
  email: string;
  full_name: string;
  password: string;
  username: string;
  referral_code_input: string;
  platform: LoginPlatform;
};

// Verified directly against users/utils.py (set_auth_cookies): payload
// is { message, user: UserDetailSerializer(user).data }. The OpenAPI
// spec (Cashevide_API.yaml) says `data` instead of `user` here — that's
// stale/incorrect; the actual view code is authoritative.
export type SignupResponse = {
  message: string;
  user: AuthUser;
};

// Standard DRF serializer errors (UserDetailSerializer) — genuinely a
// per-field error map.
export type SignupErrorField =
  | "email"
  | "full_name"
  | "password"
  | "username"
  | "referral_code_input"
  | "platform";

export type SignupError = FieldErrors<SignupErrorField>;
